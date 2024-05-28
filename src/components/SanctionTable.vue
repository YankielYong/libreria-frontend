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
                placeholder="Keyword Search"
                :pt="{ root: { style: 'margin-top: 0.2rem' } }"
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
        <Column field="user.email" header="User" sortable></Column>
        <Column field="startDate" header="Start date" :sortable="true"></Column>
        <Column field="duration" header="Duration (months)" sortable></Column>
        <Column field="endDate" header="End Date" sortable></Column>
        <Column v-if="canManage" style="width: 90px">
          <template #body="slotProps">
            <Button
              icon="pi pi-undo"
              class="mr-2"
              v-if="slotProps.data.pending"
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
          <label for="bookCopy" class="font-semibold w-6rem">Book Copy</label>
          <Dropdown
            v-model="user"
            filter
            :options="users"
            optionLabel="email"
            placeholder="Select a book copy"
            class="w-full md:w-14rem"
            :pt="{
              list: { style: 'padding: 0; margin-bottom: 0' },
              input: { style: 'width: 12.5rem' },
            }"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="startDate" class="font-semibold w-6rem">Start Date</label>
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
          <label for="startDate" class="font-semibold w-6rem">Start Date</label>
          <InputNumber v-model="duration" inputId="integeronly" :max="12" />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="danger"
            @click="hideDialog"
          ></Button>
          <Button
            type="button"
            :label="labelSaveButton"
            @click="saveLoan"
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
import UserService from '@/services/UserService';
import type { IUser } from '@/interfaces/IUser';
import type { IBookCopy } from '@/interfaces/IBookCopy';
import SanctionService from '@/services/SanctionService';
import type { ISanction } from '@/interfaces/ISanction';
import { useConfirm } from 'primevue/useconfirm';

const toast = useToast();
const confirm = useConfirm();

const sanctionService = new SanctionService();
const sanctions = sanctionService.getSanctions();

const userService = new UserService();
const users = userService.getUsers();

const canManage = ref(false);

const sanction: Ref<ISanction> = ref({});
const startDate = ref(new Date());
const duration = ref();
const endDate = ref();
const user: Ref<IUser> = ref({});
const sanctionToUpdate = ref();

const sanctionDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('Save');

const loading = ref(true);
const filters = ref();

const saveLoan = async () => {
  sanctionToUpdate.value = {
    id: sanction.value.id,
    startDate: startDate.value,
    duration: duration.value,
    endDate: endDate.value,
    user: user.value,
  };
  try {
    labelSaveButton.value = 'Saving...';
    await sanctionService.create(sanctionToUpdate.value);
    toast.add({
      severity: 'success',
      summary: 'Book created successfully',
      life: 3000,
    });
    hideDialog();
  } catch (error) {
    let errorMessage = 'An unknown error has ocurred';
    if (error instanceof Error) {
      errorMessage = handleError(error.message);
    }
    toast.add({
      severity: 'error',
      summary: errorMessage,
      life: 3000,
    });
  }
  labelSaveButton.value = 'Save';
};

// TO DO
const anulateSanction = async (sanctionToAnulate: ISanction) => {};

const openNew = () => {
  sanction.value = {};
  duration.value = '';
  endDate.value = '';
  user.value = {};

  titleDialog.value = 'New Loan';
  subtitleDialog.value = "Enter the loan's information";
  sanctionDialog.value = true;
};

const hideDialog = () => {
  sanctionDialog.value = false;
  duration.value = '';
  endDate.value = '';
  user.value = {};
};

onMounted(async () => {
  await sanctionService.fetchAll();
  await userService.fetchAll();
  canManage.value = await sanctionService.canManage();
  loading.value = false;
});

const handleError = (error: string): string => {
  if (error.includes('name should not be empty'))
    return 'Name should not be empty';
  if (error.includes('lastName should not be empty'))
    return 'Last name should not be empty';

  return error;
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
