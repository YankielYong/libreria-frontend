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
        :value="authors"
        v-model:filters="filters"
        v-if="!loading"
        dataKey="id"
        :globalFilterFields="['name', 'lastName']"
        showGridlines
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
        <Column field="name" header="Name" sortable></Column>
        <Column field="lastName" header="Last Name" :sortable="true"></Column>
        <Column v-if="canManage" style="width: 144px">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="mr-2"
              @click="editAuthor(slotProps.data)"
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
        v-model:visible="authorDialog"
        modal
        :header="titleDialog"
        :style="{ width: '25rem' }"
      >
        <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="name" class="font-semibold w-6rem">Name</label>
          <InputText
            id="name"
            v-model="name"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="lastname" class="font-semibold w-6rem">Last Name</label>
          <InputText
            id="lastname"
            v-model="lastName"
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
            :pt="{ root: { style: 'width: 30%' } }"
          ></Button>
          <Button
            type="button"
            :label="labelSaveButton"
            @click="saveAuthor"
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
import AuthorService from '@/services/AuthorService';
import type { IAuthor } from '@/interfaces/IAuthor';

const toast = useToast();
const confirm = useConfirm();

const authorService = new AuthorService();
const authors = authorService.getAuthors();

const canManage = ref(false);

const author: Ref<IAuthor> = ref({});
const name = ref();
const lastName = ref();
const authorToUpdate = ref();

const authorDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('Save');
const toUpdate = ref(false);

const loading = ref(true);
const filters = ref();

const saveAuthor = async () => {
  authorToUpdate.value = {
    id: author.value.id,
    name: name.value,
    lastName: lastName.value,
  };
  try {
    labelSaveButton.value = 'Saving...';
    if (toUpdate.value) {
      await authorService.update(authorToUpdate.value);
      toast.add({
        severity: 'success',
        summary: 'Author updated successfully',
        life: 3000,
      });
      hideDialog();
      toUpdate.value = false;
    } else {
      await authorService.create(authorToUpdate.value);
      toast.add({
        severity: 'success',
        summary: 'Author created successfully',
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
  author.value = {};
  name.value = '';
  lastName.value = '';

  titleDialog.value = 'New Author';
  subtitleDialog.value = "Enter the author's information";
  toUpdate.value = false;
  authorDialog.value = true;
};

const editAuthor = (authorToEdit: IAuthor) => {
  author.value = { ...authorToEdit };

  name.value = author.value.name;
  lastName.value = author.value.lastName;
  toUpdate.value = true;

  titleDialog.value = 'Edit Author';
  subtitleDialog.value = "Edit the author's information";
  authorDialog.value = true;
};

const confirmDelete = (authorToDelete: IAuthor) => {
  try {
    let { id } = authorToDelete;
    if (!id) id = -1;
    author.value = authorToDelete;
    confirm.require({
      message: 'Do you want to delete this author?',
      header: 'Delete author',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      rejectClass: 'p-button-secondary',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await authorService.delete(id);
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'The author was deleted',
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
  authorDialog.value = false;
  author.value = {};
  name.value = '';
  lastName.value = '';

  toUpdate.value = false;
};

onMounted(async () => {
  await authorService.fetchAll();
  canManage.value = await authorService.canManage();
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
