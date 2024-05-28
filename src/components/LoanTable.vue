<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <div class="container">
      <i
        v-if="loading"
        class="pi pi-spin pi-spinner big-loading"
        style="font-size: 5rem; color: #10b981"
      ></i>
      <DataTable
        :value="loans"
        v-model:filters="filters"
        dataKey="id"
        :globalFilterFields="[
          'bookCopy.book.title',
          'user.email',
          'startDate',
          'endDate',
        ]"
        showGridlines
        v-if="!loading"
        sortField="endDate"
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
        <Column field="bookCopy.book.title" header="Book" sortable></Column>
        <Column field="user.email" header="User" sortable></Column>
        <Column field="startDate" header="Start date" sortable></Column>
        <Column field="endDate" header="End Date" :sortable="true"></Column>
        <Column v-if="canManage" style="width: 90px">
          <template #body="slotProps">
            <Button
              icon="pi pi-undo"
              class="mr-2"
              v-if="slotProps.data.pending"
              @click="returnLoan(slotProps.data)"
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
        <div class="flex align-items-center gap-3 mb-3">
          <label for="bookCopy" class="font-semibold w-6rem">Book Copy</label>
          <Dropdown
            v-model="bookCopy"
            filter
            :options="availables"
            optionLabel="book.title"
            placeholder="Select a book copy"
            class="w-full md:w-14rem"
            :pt="{
              list: { style: 'padding: 0; margin-bottom: 0' },
              input: { style: 'width: 12.5rem' },
            }"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="user" class="font-semibold w-6rem">User</label>
          <Dropdown
            v-model="user"
            filter
            :options="users"
            optionLabel="email"
            placeholder="Select an user"
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
          <label for="endDate" class="font-semibold w-6rem">End date</label>
          <Calendar
            v-model="endDate"
            showIcon
            showButtonBar
            iconDisplay="input"
            inputId="endDate"
            :manualInput="false"
            :minDate="minDate"
            dateFormat="dd/mm/yy"
            :pt="{
              input: { style: 'padding: 12px' },
              svg: { style: 'margin-top: 5px' },
            }"
          />
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
import LoanService from '@/services/LoanService';
import type { ILoan } from '@/interfaces/ILoan';
import BookCopyService from '@/services/BookCopyService';
import type { IBookCopy } from '@/interfaces/IBookCopy';

const toast = useToast();

const loanService = new LoanService();
const loans = loanService.getUsers();

const bookCopyService = new BookCopyService();
const availables = bookCopyService.getAvailables();

const userService = new UserService();
const users = userService.getUsers();

const canManage = ref(false);

const loan: Ref<ILoan> = ref({});
const bookCopy: Ref<IBookCopy> = ref({});
const user: Ref<IUser> = ref({});
const startDate = ref(new Date());
const endDate = ref();
const loanToUpdate = ref();

const minDate = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

const loanDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('Save');

const loading = ref(true);
const filters = ref();

const saveLoan = async () => {
  loanToUpdate.value = {
    id: loan.value.id,
    bookCopy: bookCopy.value,
    user: user.value,
    startDate: startDate.value,
    endDate: endDate.value,
  };
  try {
    labelSaveButton.value = 'Saving...';
    const bookCopy2 = await loanService.create(loanToUpdate.value);
    toast.add({
      severity: 'success',
      summary: 'Book created successfully',
      life: 3000,
    });
    availables.value = availables.value.filter((a) => a.id !== bookCopy2.id);
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

const returnLoan = async (loanToReturn: ILoan) => {
  const { id } = loanToReturn;
  try {
    const bookCopy2 = await loanService.return(id || -1);
    toast.add({
      severity: 'success',
      summary: 'Loan returned successfully',
      life: 3000,
    });
    availables.value.push(bookCopy2);
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
};

const openNew = () => {
  loan.value = {};
  bookCopy.value = {};
  user.value = {};
  endDate.value = '';

  titleDialog.value = 'New Loan';
  subtitleDialog.value = "Enter the loan's information";
  loanDialog.value = true;
};

const hideDialog = () => {
  loanDialog.value = false;
  bookCopy.value = {};
  user.value = {};
  endDate.value = '';
};

onMounted(async () => {
  await loanService.fetchAll();
  await bookCopyService.fetchAll();
  await userService.fetchAll();
  canManage.value = await loanService.canManage();
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
