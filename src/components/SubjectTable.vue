
<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <ConfirmDialog></ConfirmDialog>
    <div class="container">
      <DataTable
        :value="subjects"
        v-model:filters="filters"
        dataKey="id"
        :globalFilterFields="['subject']"
        showGridlines
        :loading="loading"
        sortField="lastName"
        :sortOrder="1"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
      >
        <template #header>
          <div class="flex justify-content-between">
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </IconField>
            <Button
              v-if="canManage"
              label="New"
              icon="pi pi-plus"
              class="mr-2"
              @click="openNew"
            />
          </div>
        </template>
        <template #loading> Loading subjects. Please wait. </template>
        <Column field="subjects" header="Subjects" sortable></Column>
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
        <div class="flex align-items-center gap-3 mb-3">
          <label for="subject" class="font-semibold w-6rem">Subject</label>
          <InputText
            id="subject"
            v-model="subject"
            class="flex-auto"
            autocomplete="off"
          />
        
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="danger"
            @click="hideDialog"
          ></Button>
          <Button type="button" label="Save" @click="saveSubject"></Button>
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
import SubjectService from '@/services/SubjectService';
import type { ISubject } from '@/interfaces/ISubject';

const toast = useToast();
const confirm = useConfirm();

const subjectService = new SubjectService();
const subjects = subjectService.getSubjects();

const canManage = ref(false);

const subject: Ref<ISubject> = ref({});
const name = ref();
const submitted = ref(false);
const subjectToUpdate = ref();

const subjectDialog = ref(false);
const subjectDeleteDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const toUpdate = ref(false);

const loading = ref(true);
const filters = ref();

const saveSubject = async () => {
  submitted.value = true;
  subjectToUpdate.value = {
     name: name.value,
   
  };
  try {
    if (toUpdate.value) {
      await subjectService.update(subjectToUpdate.value);
      toast.add({
        severity: 'success',
        summary: 'Subject updated successfully',
        life: 3000,
      });
      hideDialog();
      toUpdate.value = false;
    } else {
      console.log(subjectToUpdate.value);
      await subjectService.create(subjectToUpdate.value);
      toast.add({
        severity: 'success',
        summary: 'Subject created successfully',
        life: 3000,
      });
      hideDialog();
    }
  } catch (error) {
    let errorMessage = 'An unexpected error has ocurred';
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

const openNew = () => {
  subject.value = {};
  submitted.value = false;

  titleDialog.value = 'New Subject';
  subtitleDialog.value = "Enter the subject's information";
  subjectDialog.value = true;
};

const editSubject = (subjectToEdit: ISubject) => {
  subject.value = { ...subjectToEdit };

  name.value = subject.value.name;
  toUpdate.value = true;

  titleDialog.value = 'Edit Subject';
  subtitleDialog.value = "Edit the subject's information";
  subjectDialog.value = true;
};

const confirmDelete = (subjectToDelete: ISubject) => {
  try {
    let name = subjectToDelete.name;
    if (!name) name = "-1";
    subject.value = subjectToDelete;
    confirm.require({
      message: 'Do you want to delete this subject?',
      header: 'Delete subject',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      rejectClass: 'p-button-secondary',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await subjectService.delete(name);
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'The subject was deleted',
          life: 3000,
        });
      },
      reject: () => {
        toast.add({
          severity: 'error',
          summary: 'Canceled',
          detail: 'The operation was canceled',
          life: 3000,
        });
      },
    });
  } catch (error) {
    let errorMessage = 'An unexpected error has ocurred';
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
  submitted.value = false;
  name.value = '';
  toUpdate.value = false;
};

onMounted(async () => {
  await subjectService.fetchAll();
  canManage.value = await subjectService.canManage();
  loading.value = false;
});

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
}
:deep(td),
:deep(th) {
  border-color: #e5e7eb !important;
  border-style: solid !important;
  border: 1px solid;
}
:deep(.p-input-icon) {
  margin-top: -0.7rem !important;
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
</style>
