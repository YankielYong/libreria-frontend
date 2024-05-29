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
        :value="sanctions"
        v-model:filters="filters"
        dataKey="id"
        :globalFilterFields="['user.email', 'duration', 'startDate', 'endDate']"
        showGridlines
        v-if="!loading"
        sortField="startDate"
        :sortOrder="-1"
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
          field="user.email"
          :header="t('components.sanctionTable.user')"
          sortable
        ></Column>
        <Column
          field="startDate"
          :header="t('components.sanctionTable.startDate')"
          :sortable="true"
        ></Column>
        <Column
          field="duration"
          :header="t('components.sanctionTable.duration')"
          sortable
        ></Column>
        <Column
          field="endDate"
          :header="t('components.sanctionTable.endDate')"
          sortable
        ></Column>
        <Column v-if="canManage" style="width: 90px">
          <template #body="slotProps">
            <Button
              icon="pi pi-undo"
              class="mr-2"
              v-if="slotProps.data.isActive"
              @click="anulateSanction(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="sanctionDialog"
        modal
        :header="titleDialog"
        :style="{ width: '25rem' }"
      >
        <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="user" class="font-semibold w-6rem">{{
            t('components.sanctionTable.user')
          }}</label>
          <Dropdown
            v-model="user"
            filter
            :options="users"
            optionLabel="email"
            :placeholder="t('components.sanctionTable.userLabel')"
            class="w-full md:w-14rem"
            :pt="{
              list: { style: 'padding: 0; margin-bottom: 0' },
              input: { style: 'width: 12.5rem' },
            }"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="startDate" class="font-semibold w-6rem">{{
            t('components.sanctionTable.startDate')
          }}</label>
          <Calendar
            v-model="startDate"
            showIcon
            showButtonBar
            iconDisplay="input"
            inputId="startDate"
            :manualInput="false"
            disabled
            dateFormat="dd/mm/yy"
            :pt="{
              input: { style: 'padding: 12px' },
              svg: { style: 'margin-top: 5px' },
            }"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="startDate" class="font-semibold w-6rem">{{
            t('components.sanctionTable.duration')
          }}</label>
          <InputNumber
            v-model="duration"
            inputId="integeronly"
            :max="12"
            :min="1"
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
            @click="saveSanction"
            :pt="{ root: { style: 'width: 40%' } }"
          ></Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FilterMatchMode } from 'primevue/api';
import { onMounted, ref, watchEffect, type Ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { addMonths } from 'date-fns';
import UserService from '@/services/UserService';
import type { IUser } from '@/interfaces/IUser';
import SanctionService from '@/services/SanctionService';
import type { ISanction } from '@/interfaces/ISanction';

const toast = useToast();
const { t } = useI18n();

const sanctionService = new SanctionService();
const sanctions = sanctionService.getSanctions();

const userService = new UserService();
const users = userService.getUsers();

const canManage = ref(false);

const sanction: Ref<ISanction> = ref({});
const startDate = ref(new Date());
const duration = ref(1);
const endDate = ref();
const user: Ref<IUser> = ref({});
const sanctionToUpdate = ref();

const sanctionDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref(t('components.general.save'));

const loading = ref(true);
const filters = ref();

const saveSanction = async () => {
  sanctionToUpdate.value = {
    id: sanction.value.id,
    startDate: startDate.value,
    duration: duration.value,
    endDate: addMonths(startDate.value, duration.value),
    user: user.value,
  };
  try {
    labelSaveButton.value = t('components.general.saving');
    await sanctionService.create(sanctionToUpdate.value);
    toast.add({
      severity: 'success',
      summary: t('components.sanctionTable.sanctionCreated'),
      life: 3000,
    });
    hideDialog();
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

// TO DO
const anulateSanction = async (sanctionToAnulate: ISanction) => {
  const { id } = sanctionToAnulate;
  let myId = -1;
  if (id) myId = id;
  try {
    await sanctionService.desactivate(myId);
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
};

const openNew = () => {
  sanction.value = {};
  duration.value = 1;
  endDate.value = '';
  user.value = {};

  titleDialog.value = t('components.sanctionTable.newSanctionTitle');
  subtitleDialog.value = t('components.sanctionTable.newSanctionSubtitle');
  sanctionDialog.value = true;
};

const hideDialog = () => {
  sanctionDialog.value = false;
  duration.value = 1;
  endDate.value = '';
  user.value = {};
};

onMounted(async () => {
  await sanctionService.fetchAll();
  await userService.fetchAll();
  canManage.value = await sanctionService.canManage();
  loading.value = false;
});

watchEffect(() => {
  labelSaveButton.value = t('components.general.save');
});

const handleError = (error: string): string[] => {
  let errors = [];
  if (error.includes('name should not be empty'))
    errors.push(t('components.userTable.errorEmailExists'));
  if (error.includes('lastName should not be empty'))
    errors.push(t('components.userTable.errorEmailExists'));

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
  padding: 0 1.5rem, 4rem, 1.5rem;
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
:deep(ul) {
  padding-left: 0 !important;
}
.big-loading {
  height: 65vh;
  text-align: center;
  align-content: center;
}
:depp(#startDate),
:deep(#endDate) {
  padding: 12px;
}
</style>
