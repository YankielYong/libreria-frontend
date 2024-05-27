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
          :value="bookcopies"
          v-model:filters="filters"
          v-if="!loading"
          dataKey="id"
          :globalFilterFields="['id']"
          showGridlines
          sortField="id"
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
          <Column field="book id" header="Book ID" sortable></Column>
          
          <Column v-if="canManage" style="width: 144px">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="mr-2"
                @click="editBookCopy(slotProps.data)"
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
          v-model:visible="bookCopyDialog"
          modal
          :header="titleDialog"
          :style="{ width: '25rem' }"
        >
          <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
          <div class="flex align-items-center gap-3 mb-3">
            <label for="name" class="font-semibold w-6rem">Name</label>
            <InputText
              id="id"
              v-model="name"
              class="flex-auto"
              autocomplete="off"
            />
          
            <Button
              type="button"
              label="Cancel"
              severity="danger"
              @click="hideDialog"
              :pt="{ root: { style: 'width: 30%' } }"
            ></Button>
            <Button
              type="button"
              :label="labelSaveButton"
              @click="saveBookCopy"
              :pt="{ root: { style: 'width: 35%' } }"
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
  import BookCopyService from '@/services/BookCopyService';
  import type { IBookCopy } from '@/interfaces/IBookCopy';
  
  const toast = useToast();
  const confirm = useConfirm();
  
  const bookCopyService = new BookCopyService();
  const bookCopy = bookCopyService.getBookCopies();
  
  const canManage = ref(false);
  
  const bookCopy: Ref<IBookCopy> = ref({});
  const id = ref();
  const bookCopyToUpdate = ref();
  
  const bookCopyDialog = ref(false);
  const titleDialog = ref('');
  const subtitleDialog = ref('');
  const labelSaveButton = ref('Save');
  const toUpdate = ref(false);
  
  const loading = ref(true);
  const filters = ref();
  
  const saveBookCopy = async () => {
    bookCopyToUpdate.value = {
      id: bookCopy.value.id,
   };
    try {
      labelSaveButton.value = 'Saving...';
      if (toUpdate.value) {
        await bookCopyService.update(bookCopyToUpdate.value);
        toast.add({
          severity: 'success',
          summary: 'Book copy updated successfully',
          life: 3000,
        });
        hideDialog();
        toUpdate.value = false;
      } else {
        await bookCopyService.create(bookCopyToUpdate.value);
        toast.add({
          severity: 'success',
          summary: 'Book copy created successfully',
          life: 3000,
        });
        hideDialog();
      }
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
  
  const openNew = () => {
    bookCopy.value = {};
    id.value = '';
 
  
    titleDialog.value = 'New Book Copy';
    subtitleDialog.value = "Enter the book copy's id";
    toUpdate.value = false;
    bookCopyDialog.value = true;
  };
  
  const editBookCopy = (bookCopyToEdit: IBookCopy) => {
    bookCopy.value = { ...bookCopyToEdit };
    console.log(bookCopy.value);
  
    id.value = bookCopy.value.id;
    toUpdate.value = true;
  
    titleDialog.value = 'Edit Book Copy';
    subtitleDialog.value = "Edit the  book copy's id";
    bookCopyDialog.value = true;
  };
  
  const confirmDelete = (bookCopyToDelete: IBookCopy) => {
    try {
      let { id } = bookCopyToDelete;
      if (!id) id = -1;
      bookCopy.value = bookCopyToDelete;
      confirm.require({
        message: 'Do you want to delete this book copy?',
        header: 'Delete book copy',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
          await bookCopyService.delete(id);
          toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'The book copy was deleted',
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
    bookCopyDialog.value = false;
    bookCopy.value = {};
    id.value = '';
    toUpdate.value = false;
  };
  
  onMounted(async () => {
    await bookCopyService.fetchAll();
    canManage.value = await bookCopyService.canManage();
    loading.value = false;
  });
  
  const handleError = (error: string): string => {
    if (error.includes('id should not be empty'))
      return 'id should not be empty';
    
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
  
  .big-loading {
    height: 65vh;
    text-align: center;
    align-content: center;
  }
  </style>
  