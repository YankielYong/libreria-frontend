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
        :value="bookCopies"
        v-model:filters="filters"
        v-if="!loading"
        dataKey="id"
        :globalFilterFields="['book.title']"
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
              <InputIcon style="margin-top: -0.7rem">
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                :placeholder="t('components.general.keywordSearch')"
                :pt="{
                  root: {
                    style: 'margin-top: 0.2rem',
                  },
                }"
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
          field="book.title"
          :header="t('components.bookCopyTable.book')"
          sortable
        ></Column>

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
        <div class="flex align-items-center gap-3 mb-5">
          <label for="book" class="font-semibold w-6rem">{{
            t('components.bookCopyTable.book')
          }}</label>
          <Dropdown
            v-model="book"
            filter
            :options="books"
            optionLabel="title"
            :placeholder="t('components.bookCopyTable.bookLabel')"
            class="w-full md:w-14rem"
            :pt="{
              list: { style: 'padding: 0; margin-bottom: 0' },
              input: { style: 'width: 12.5rem' },
            }"
          />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            :label="t('components.general.cancel')"
            severity="danger"
            @click="hideDialog"
            :pt="{ root: { style: 'width: 30%' } }"
          ></Button>
          <Button
            type="button"
            :label="labelSaveButton"
            @click="saveBookCopy"
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
import BookCopyService from '@/services/BookCopyService';
import type { IBookCopy } from '@/interfaces/IBookCopy';
import BookService from '@/services/BookService';
import type { IBook } from '@/interfaces/IBook';

const toast = useToast();
const confirm = useConfirm();
const { t } = useI18n();

const bookCopyService = new BookCopyService();
const bookCopies = bookCopyService.getBookCopies();

const bookService = new BookService();
const books = bookService.getBooks();

const canManage = ref(false);

const bookCopy: Ref<IBookCopy> = ref({});
const book: Ref<IBook> = ref({});
const bookCopyToUpdate = ref();

const bookCopyDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('');
labelSaveButton.value = t('components.general.save');
const toUpdate = ref(false);

const loading = ref(true);
const filters = ref();

const saveBookCopy = async () => {
  bookCopyToUpdate.value = {
    id: bookCopy.value.id,
    book: book.value,
  };
  try {
    labelSaveButton.value = t('components.general.saving');
    if (toUpdate.value) {
      await bookCopyService.update(bookCopyToUpdate.value);
      toast.add({
        severity: 'success',
        summary: t('components.bookCopyTable.bookCopyUpdated'),
        life: 3000,
      });
      hideDialog();
      toUpdate.value = false;
    } else {
      await bookCopyService.create(bookCopyToUpdate.value);
      toast.add({
        severity: 'success',
        summary: t('components.bookCopyTable.bookCopyCreated'),
        life: 3000,
      });
      hideDialog();
    }
  } catch (error) {
    let errorMessage = t('components.general.unknowError');
    if (error instanceof Error) {
      errorMessage = handleError(error.message);
    }
    toast.add({
      severity: 'error',
      summary: errorMessage,
      life: 3000,
    });
  }
  labelSaveButton.value = t('components.general.save');
};

const openNew = () => {
  bookCopy.value = {};
  book.value = {};

  titleDialog.value = t('components.bookCopyTable.newBookCopyTitle');
  subtitleDialog.value = t('components.bookCopyTable.newBookCopySubtitle');
  toUpdate.value = false;
  bookCopyDialog.value = true;
};

const editBookCopy = (bookCopyToEdit: IBookCopy) => {
  bookCopy.value = { ...bookCopyToEdit };

  book.value = books.value.filter((b) => b.id === bookCopy.value.book?.id)[0];
  toUpdate.value = true;

  titleDialog.value = t('components.bookCopyTable.editBookCopyTitle');
  subtitleDialog.value = t('components.bookCopyTable.editBookCopySubtitle');
  bookCopyDialog.value = true;
};

const confirmDelete = (bookCopyToDelete: IBookCopy) => {
  try {
    let { id } = bookCopyToDelete;
    if (!id) id = -1;
    bookCopy.value = bookCopyToDelete;
    confirm.require({
      message: t('components.bookCopyTable.messageDelete'),
      header: t('components.bookCopyTable.headerDelete'),
      icon: 'pi pi-info-circle',
      rejectLabel: t('components.general.cancel'),
      acceptLabel: t('components.general.delete'),
      rejectClass: 'p-button-secondary',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await bookCopyService.delete(id);
        toast.add({
          severity: 'success',
          summary: t('components.general.deleted'),
          detail: t('components.bookCopyTable.detailDeleted'),
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
  bookCopyDialog.value = false;
  bookCopy.value = {};
  book.value = {};
  toUpdate.value = false;
};

onMounted(async () => {
  await bookCopyService.fetchAll();
  await bookService.fetchAll();
  canManage.value = await bookCopyService.canManage();
  loading.value = false;
});

const handleError = (error: string): string => {
  if (error.includes('id should not be empty')) return 'id should not be empty';

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
