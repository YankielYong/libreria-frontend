<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <ConfirmDialog></ConfirmDialog>
    <div class="container">
      <i
        v-if="loading"
        class="pi pi-spin pi-spinner big-loading"
        style="font-size: 5rem; color: #10b981"
      ></i>
      <DataTable
        :value="subjects"
        v-model:filters="filters"
        v-if="!loading"
        dataKey="id"
        :globalFilterFields="['name']"
        showGridlines
        sortField="name"
        :sortOrder="1"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
      >
        <template #header>
          <div class="flex justify-content-between">
            <IconField iconPosition="left">
              <InputIcon style="margin-top: -0.7rem">
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                :placeholder="t('components.general.keywordSearch')"
                :pt="{ root: { style: 'margin-top: 0.2rem' } }"
              />
            </IconField>
            <Button
              v-if="canManage"
              :label="t('components.general.new')"
              icon="pi pi-plus"
              class="mr-2"
              @click="openNew"
            />
          </div>
        </template>
        <Column
          field="name"
          :header="t('components.subjectTable.name')"
          sortable
        ></Column>
        <Column v-if="canManage" style="width: 144px">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="mr-2"
              @click="editSubject(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="subjectDialog"
        modal
        :header="titleDialog"
        :style="{ width: '25rem' }"
      >
        <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="name" class="font-semibold w-6rem">{{
            t('components.subjectTable.name')
          }}</label>
          <InputText
            id="name"
            v-model="name"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            :label="t('components.general.cancel')"
            severity="danger"
            @click="hideDialog"
            :pt="{ root: { style: 'width: 35%' } }"
          ></Button>
          <Button
            type="button"
            :label="labelSaveButton"
            @click="saveSubject"
            :pt="{ root: { style: 'width: 40%' } }"
          ></Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FilterMatchMode } from 'primevue/api';
import { onMounted, ref, type Ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import SubjectService from '@/services/SubjectService';
import type { ISubject } from '@/interfaces/ISubject';
import { watchEffect } from 'vue';

const toast = useToast();
const confirm = useConfirm();
const { t } = useI18n();

const subjectService = new SubjectService();
const subjects = subjectService.getSubjects();

const canManage = ref(false);

const subject: Ref<ISubject> = ref({});
const name = ref();
const subjectToUpdate = ref();

const subjectDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('');
labelSaveButton.value = t('components.general.save');
const toUpdate = ref(false);

const loading = ref(true);
const filters = ref();

const saveSubject = async () => {
  subjectToUpdate.value = {
    id: subject.value.id,
    name: name.value,
  };
  try {
    labelSaveButton.value = t('components.general.saving');
    if (toUpdate.value) {
      await subjectService.update(subjectToUpdate.value);
      toast.add({
        severity: 'success',
        summary: t('components.subjectTable.subjectUpdated'),
        life: 3000,
      });
      hideDialog();
      toUpdate.value = false;
    } else {
      await subjectService.create(subjectToUpdate.value);
      toast.add({
        severity: 'success',
        summary: t('components.subjectTable.subjectCreated'),
        life: 3000,
      });
      hideDialog();
    }
  } catch (error) {
    let errorMessages = [t('components.general.unknowError')];
    if (error instanceof Error) {
      errorMessages = handleError(error.message);
    }
    for (const errorMessage of errorMessages) {
      toast.add({
        severity: 'error',
        summary: errorMessage,
        life: 3000,
      });
    }
  }
  labelSaveButton.value = t('components.general.save');
};

const openNew = () => {
  subject.value = {};
  name.value = '';

  titleDialog.value = t('components.subjectTable.newSubjectTitle');
  subtitleDialog.value = t('components.subjectTable.newSubjectSubtitle');
  toUpdate.value = false;
  subjectDialog.value = true;
};

const editSubject = (subjectToEdit: ISubject) => {
  subject.value = { ...subjectToEdit };

  name.value = subject.value.name;
  toUpdate.value = true;

  titleDialog.value = t('components.subjectTable.editSubjectTitle');
  subtitleDialog.value = t('components.subjectTable.editSubjectSubtitle');
  subjectDialog.value = true;
};

const confirmDelete = (subjectToDelete: ISubject) => {
  try {
    let { id } = subjectToDelete;
    if (!id) id = -1;
    subject.value = subjectToDelete;
    confirm.require({
      message: t('components.subjectTable.messageDelete'),
      header: t('components.subjectTable.headerDelete'),
      icon: 'pi pi-info-circle',
      rejectLabel: t('components.general.cancel'),
      acceptLabel: t('components.general.delete'),
      rejectClass: 'p-button-secondary',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await subjectService.delete(id);
        toast.add({
          severity: 'success',
          summary: t('components.general.deleted'),
          detail: t('components.subjectTable.detailDeleted'),
          life: 3000,
        });
      },
      reject: () => {
        toast.add({
          severity: 'error',
          summary: t('components.general.canceled'),
          detail: t('components.general.detailCanceled'),
          life: 3000,
        });
      },
    });
  } catch (error) {
    let errorMessage = t('components.general.unknowError');
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.add({
      severity: 'error',
      summary: errorMessage,
      life: 3000,
    });
  }
};

const hideDialog = () => {
  subjectDialog.value = false;
  subject.value = {};
  name.value = '';
  toUpdate.value = false;
};

watchEffect(() => {
  labelSaveButton.value = t('components.general.save');
});

onMounted(async () => {
  await subjectService.fetchAll();
  canManage.value = await subjectService.canManage();
  loading.value = false;
});

const handleError = (error: string): string[] => {
  let errors = [];
  if (error.includes('name should not be empty'))
    errors.push(t('components.subjectTable.errorName'));

  if (errors.length === 0) errors.push(error);

  return errors;
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

initFilters();
</script>

<style scoped>
.card {
  border: none;
}
.container {
  margin-top: 20px;
  width: 80%;
  text-align: center;
}
:deep(td),
:deep(th) {
  border-color: #e5e7eb !important;
  border-style: solid !important;
  border: 1px solid;
}
:deep(.flex) {
  display: flex !important;
}
:deep(.p-dialog-content) {
  padding: 0 1.5rem, 2rem, 1.5rem;
}
.flex {
  display: flex !important;
}
button {
  margin: 0.2rem;
}
.align-items-center {
  justify-content: space-between;
}
.big-loading {
  height: 65vh;
  text-align: center;
  align-content: center;
}
</style>
