<template>
    <div class="card">
      <Toast position="top-right" style="width: 50%" />
      <ConfirmDialog></ConfirmDialog>
      <div class="container">
        <DataTable
          :value="loans"
          v-model:filters="filters"
          dataKey="id"
          :globalFilterFields="['stardDate', 'endDate']"
          showGridlines
          :loading="loading"
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
          <template #loading> Loading users. Please wait. </template>
          <Column field="bookCopy" header="Book Copy" sortable></Column>
          <Column field="userId" header="User" :sortable="true"></Column>
          <Column field="startDate" header="Start date" :sortable="true"></Column>
          <Column field="endDate" header="End Date" :sortable="true"></Column>
          <Column v-if="canManage" style="width: 90px">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDelete(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
  
        <Dialog
          v-model:visible="loanDialog"
          modal
          :header="titleDialog"
          :style="{ width: '25rem' }"
        >
          <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
          <div class="flex align-items-center gap-3 mb-5">
            <label for="bookCopy" class="font-semibold w-6rem">Book Copy</label>
            <InputText
              id="bookCopy"
              v-model="bookCopy"
              class="flex-auto"
              autocomplete="off"
            />
          </div>
          <div class="flex align-items-center gap-3 mb-3">
            <label for="userId" class="font-semibold w-6rem">User</label>
            <Password
              v-model="userId"
              inputId="userId"
              :feedback="false"
              toggleMask
            />
          </div>
          <div class="flex align-items-center gap-3 mb-3">
            <label for="startDate" class="font-semibold w-6rem">Start Date</label>
            <InputText
              id="startDate"
              v-model="startDate"
              class="flex-auto"
              autocomplete="off"
            />
          </div>
          <div class="flex align-items-center gap-3 mb53">
            <label for="endDate" class="font-semibold w-6rem">End date</label>
            <InputText
              id="endDate"
              v-model="endDate"
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
            <Button type="button" label="Save" @click="saveLoan"></Button>
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
  import UserService from '@/services/UserService';
  import type { IUser } from '@/interfaces/IUser';
  import { RoleType } from '@/util/enum/RoleType';
import LoanService from '@/services/LoanService';
import type { ILoan } from '@/interfaces/ILoan';
  
  const toast = useToast();
  const confirm = useConfirm();
  
  const loanService = new LoanService();
  const loans = loanService.getUsers();
  
  const canManage = ref(false);
  
  const loan: Ref<IUser> = ref({});
  const bookCopy = ref({});
  const userId = ref({});
  const startDate = ref();
  const endDate = ref();
  const role = ref(null);
  const submitted = ref(false);
  const newLoan = ref();
  
  const loanDialog = ref(false);
  const loanDeleteDialog = ref(false);
  const titleDialog = ref('');
  const subtitleDialog = ref('');
  const toUpdate = ref(false);
  
  const loading = ref(true);
  const filters = ref();
  
  const saveLoan = async () => {
    submitted.value = true;
    newLoan.value = {
      id: loan.value.id,
      bookCopy: bookCopy.value,
      userId: userId.value,
      startDate: startDate.value,
      endDate: endDate.value,
    };
    try {
        console.log(newLoan.value);
        await loanService.create(newLoan.value);
        toast.add({
          severity: 'success',
          summary: 'User created successfully',
          life: 3000,
        });
        hideDialog();
    } catch (error) {
      let errorMessage = 'An unknown error has ocurred';
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
    loan.value = {};
    submitted.value = false;
  
    titleDialog.value = 'New Loan';
    subtitleDialog.value = "Enter the user's information";
    loanDialog.value = true;
  };

  const editloan = (loanToEdit: ILoan) => {
  loan.value = { ...loanToEdit };

  bookCopy.value = bookCopy.value;
  userId.value = userId.value;
  startDate.value = startDate.value;
  endDate.value = endDate.value;

  titleDialog.value = 'Edit Author';
  subtitleDialog.value = "Edit the author's information";
  loanDialog.value = true;
};
  
  const confirmDelete = (userToDelete: IUser) => {
    try {
      let { id } = userToDelete;
      if (!id) id = -1;
      loan.value = userToDelete;
      confirm.require({
        message: 'Do you want to delete this user?',
        header: 'Delete user',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
          await loanService.delete(id);
          toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'The user was deleted',
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
      let errorMessage = 'An unknown error has ocurred';
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
    loanDialog.value = false;
    submitted.value = false;
    bookCopy.value='';
    userId.value='';
    startDate.value = '';
    endDate.value = '';
  };
  
  onMounted(async () => {
    canManage.value = await loanService.canManage();
    await loanService.fetchAll();
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
  :deep(#pwd) {
    padding-right: 12px !important;
  }
  :deep(.p-dropdown-label) {
    width: 195px;
  }
  :deep(ul) {
    padding-left: 0 !important;
  }
  :deep(.pi) {
    margin-top: -0.7rem !important;
  }
  
  </style>