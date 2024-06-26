<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <ConfirmDialog></ConfirmDialog>
    <i
      v-if="loading"
      class="pi pi-spin pi-spinner big-loading"
      style="font-size: 5rem; color: #10b981"
    ></i>
    <DataView
      :value="books"
      paginator
      v-if="!loading"
      :rows="5"
      dataKey="'id'"
      :sortOrder="sortOrder"
      :sortField="sortField"
    >
      <template #header>
        <div class="flex justify-content-between my-flex">
          <Dropdown
            v-model="sortKey"
            :options="sortOptions"
            optionLabel="label"
            :placeholder="t('components.bookDetails.sortLabel')"
            @change="onSortChange($event)"
            :pt="{
              list: { style: 'padding: 0; margin-bottom: 0' },
            }"
          />
          <Button
            v-if="canManage"
            :label="t('components.general.new')"
            icon="pi pi-plus"
            class="mr-2"
            @click="openNew"
          />
        </div>
      </template>

      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="col-12 my-row"
          >
            <div
              class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
              :class="{ 'border-top-1 surface-border': index !== 0 }"
            >
              <div
                class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4"
              >
                <div class="flex align-items-center">
                  <div
                    class="flex flex-row md:flex-column justify-content-between align-items-start gap-2 div-izq"
                  >
                    <div>
                      <p class="font-medium text-sm my-title">
                        <b>
                          {{ item.title }}
                        </b>
                        ({{ item.yearEdition }})
                      </p>
                      <div class="text-lg font-medium text-900 mt-2 my-subject">
                        {{ item.subject.name }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row md:flex-column justify-content-between align-items-start gap-2 div-der"
                  >
                    <div>
                      <p class="font-medium text-sm no-margin">
                        {{ item.country }}
                      </p>
                      <p class="font-medium text-sm no-margin">
                        {{ item.publisher }}
                      </p>
                      <div class="text-lg font-medium text-900 mt-2">
                        {{ item.numberPages }}
                        {{ t('components.bookDetails.pages') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-lg font-medium text-900 mt-2 my-summary">
                  <i>{{ item.summary }}</i>
                </div>
                <div class="text-lg font-medium text-900 mt-2 my-authors">
                  <ul class="my-list">
                    <li v-for="author in item.authors">
                      {{ author.name }} {{ author.lastName }}
                    </li>
                  </ul>
                </div>
                <div
                  class="flex flex-column md:align-items-end gap-5 my-buttons"
                  v-if="canManage"
                >
                  <Button
                    icon="pi pi-pencil"
                    class="mr-2 my-button"
                    @click="editBook(item)"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    class="my-button"
                    @click="confirmDelete(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>

    <Dialog
      v-model:visible="bookDialog"
      modal
      :header="titleDialog"
      :style="{ width: '28rem' }"
    >
      <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="title" class="font-semibold w-6rem">{{
          t('components.bookDetails.title')
        }}</label>
        <InputText
          id="title"
          v-model="title"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="integeronly" class="font-semibold w-6rem">{{
          t('components.bookDetails.yearEdition')
        }}</label>
        <InputNumber v-model="yearEdition" inputId="integeronly" :min="1900" />
      </div>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="publisher" class="font-semibold w-6rem">{{
          t('components.bookDetails.publisher')
        }}</label>
        <InputText
          id="publisher"
          v-model="publisher"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="country" class="font-semibold w-6rem">{{
          t('components.bookDetails.country')
        }}</label>
        <Dropdown
          v-model="country"
          filter
          :options="countries"
          optionLabel="name"
          :placeholder="t('components.bookDetails.labelCountry')"
          class="w-full md:w-14rem"
          :pt="{
            list: { style: 'padding: 0; margin-bottom: 0' },
            input: { style: 'width: 12.5rem' },
          }"
        />
      </div>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="summary" class="font-semibold w-6rem">{{
          t('components.bookDetails.summary')
        }}</label>
        <Textarea v-model="summary" variant="filled" rows="5" cols="30" />
      </div>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="integeronly" class="font-semibold w-6rem">{{
          t('components.bookDetails.numberPages')
        }}</label>
        <InputNumber v-model="numberPages" inputId="integeronly" :min="1" />
      </div>
      <div class="my-flex align-items-center gap-3 mb-3">
        <label for="subject" class="font-semibold w-6rem">{{
          t('components.bookDetails.subject')
        }}</label>
        <Dropdown
          v-model="subject"
          filter
          :options="subjects"
          optionLabel="name"
          :placeholder="t('components.bookDetails.subjectLabel')"
          class="w-full md:w-14rem"
          :pt="{
            list: { style: 'padding: 0; margin-bottom: 0' },
            input: { style: 'width: 12.5rem' },
          }"
        />
      </div>
      <div class="my-flex align-items-center gap-3 mb-5">
        <label for="subject" class="font-semibold w-6rem">{{
          t('components.bookDetails.authors')
        }}</label>
        <MultiSelect
          v-model="authors"
          :options="allAuthors"
          filter
          :optionLabel="formatAuthorsName"
          :placeholder="t('components.bookDetails.authorsLabel')"
          :maxSelectedLabels="5"
          class="w-full md:w-20rem"
        />
      </div>
      <div class="my-flex justify-content-end gap-2">
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
          @click="saveBook"
          :pt="{ root: { style: 'width: 40%' } }"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import BookService from '@/services/BookService';
import type { IBook } from '@/interfaces/IBook';
import { onMounted, ref, watchEffect, type Ref } from 'vue';
import { Countries } from '@/util/enum/Country';
import type { ISubject } from '@/interfaces/ISubject';
import type { IAuthor } from '@/interfaces/IAuthor';
import SubjectService from '@/services/SubjectService';
import AuthorService from '@/services/AuthorService';

const toast = useToast();
const confirm = useConfirm();
const { t } = useI18n();

const bookService = new BookService();
const books = bookService.getBooks();

const subjectService = new SubjectService();
const subjects = ref(subjectService.getSubjects());

const authorService = new AuthorService();
const allAuthors = authorService.getAuthors();

const canManage = ref(false);
const countries = ref(Countries);

const book: Ref<IBook> = ref({});
const title = ref();
const yearEdition = ref();
const publisher = ref();
const country = ref({ name: '' });
const summary = ref();
const numberPages = ref();
const subject: Ref<ISubject> = ref({});
const authors: Ref<Array<IAuthor>> = ref([]);
const bookToUpdate = ref();

const bookDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('');
labelSaveButton.value = t('components.general.save');
const toUpdate = ref(false);

const loading = ref(true);

const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
  { label: 'A-Z', value: 'title' },
  { label: 'Z-A', value: '!title' },
]);
const onSortChange = (event: { value: { value: any } }) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  } else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

const saveBook = async () => {
  bookToUpdate.value = {
    id: book.value.id,
    title: title.value,
    yearEdition: yearEdition.value,
    publisher: publisher.value,
    country: country.value.name,
    summary: summary.value,
    numberPages: numberPages.value,
    subject: subject.value,
    authors: authors.value,
  };
  try {
    labelSaveButton.value = t('components.general.saving');
    if (toUpdate.value) {
      await bookService.update(bookToUpdate.value);
      toast.add({
        severity: 'success',
        summary: t('components.bookDetails.bookUpdated'),
        life: 3000,
      });
      hideDialog();
      toUpdate.value = false;
    } else {
      await bookService.create(bookToUpdate.value);
      toast.add({
        severity: 'success',
        summary: t('components.bookDetails.bookCreated'),
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
  book.value = {};
  title.value = '';
  yearEdition.value = null;
  publisher.value = '';
  country.value = { name: '' };
  summary.value = '';
  numberPages.value = null;
  subject.value = {};
  authors.value = [];

  titleDialog.value = t('components.bookDetails.newBookTitle');
  subtitleDialog.value = t('components.bookDetails.newBookSubtitle');
  toUpdate.value = false;
  bookDialog.value = true;
};

const editBook = (bookToEdit: IAuthor) => {
  book.value = { ...bookToEdit };

  title.value = book.value.title;
  yearEdition.value = book.value.yearEdition;
  publisher.value = book.value.publisher;
  country.value = { name: book.value.country || '' };
  summary.value = book.value.summary;
  numberPages.value = book.value.numberPages;
  subject.value = {
    id: book.value.subject?.id,
    name: book.value.subject?.name,
  };
  authors.value =
    book.value.authors?.map((a) => {
      return {
        id: a.id,
        name: a.name,
        lastName: a.lastName,
      };
    }) || [];
  toUpdate.value = true;

  titleDialog.value = t('components.bookDetails.editBookTitle');
  subtitleDialog.value = t('components.bookDetails.editBookSubtitle');
  bookDialog.value = true;
};

const confirmDelete = (bookToDelete: IBook) => {
  try {
    let { id } = bookToDelete;
    if (!id) id = -1;
    book.value = bookToDelete;
    confirm.require({
      message: t('components.bookDetails.messageDelete'),
      header: t('components.bookDetails.headerDelete'),
      icon: 'pi pi-info-circle',
      rejectLabel: t('components.general.cancel'),
      acceptLabel: t('components.general.delete'),
      rejectClass: 'p-button-secondary',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await bookService.delete(id);
        toast.add({
          severity: 'success',
          summary: t('components.general.deleted'),
          detail: t('components.bookDetails.detailDeleted'),
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
  bookDialog.value = false;
  book.value = {};
  title.value = '';
  yearEdition.value = null;
  publisher.value = '';
  country.value = { name: '' };
  summary.value = '';
  numberPages.value = null;
  subject.value = {};
  authors.value = [];
  toUpdate.value = false;
};

onMounted(async () => {
  await bookService.fetchAll();
  await subjectService.fetchAll();
  await authorService.fetchAll();
  canManage.value = await bookService.canManage();
  loading.value = false;
});

watchEffect(() => {
  labelSaveButton.value = t('components.general.save');
});

const handleError = (error: string): string[] => {
  let errors = [];
  if (error.includes('title should not be empty'))
    errors.push(t('components.bookDetails.errorTitle'));
  if (error.includes('yearEdition should not be empty'))
    errors.push(t('components.bookDetails.errorYearEdition'));
  if (error.includes('publisher should not be empty'))
    errors.push(t('components.bookDetails.errorPublisher'));
  if (error.includes('country should not be empty'))
    errors.push(t('components.bookDetails.errorCountry'));
  if (error.includes('summary should not be empty'))
    errors.push(t('components.bookDetails.errorSummary'));
  if (error.includes('numberPages must be a positive number'))
    errors.push(t('components.bookDetails.errorNumberPages'));
  if (error.includes('subject must be a positive number'))
    errors.push(t('components.bookDetails.errorSubject'));
  if (error.includes('authors must be longer than or equal to 1 characters'))
    errors.push(t('components.bookDetails.errorAuthors'));

  if (errors.length === 0) errors.push(error);

  return errors;
};

const formatAuthorsName = (author: IAuthor) =>
  `${author.name} ${author.lastName}`;
</script>

<style scoped>
.card {
  border: none;
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem, 4rem, 1.5rem;
}

.my-flex {
  display: flex !important;
}

.my-title {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  display: inline-block;
}

.my-subject {
  font-size: 1.2rem;
}

.my-summary {
  margin-top: 1rem;
}

.my-authors {
  display: inline-block;
  margin-top: 0.8rem;
  width: calc(100% - 144px);
}

.no-margin {
  margin-bottom: 0;
}

.div-izq,
.div-der {
  display: inline-block;
  width: 49%;
}

.my-row {
  border-bottom: 1px solid #afa8a8;
}

.my-buttons {
  display: inline-block;
}

.my-button {
  margin-right: 10px;
}

.my-list {
  margin-bottom: 0;
}

.align-items-center {
  justify-content: space-between;
}

.big-loading {
  height: 65vh;
  text-align: center;
  align-content: center;
}

:deep(.p-multiselect-label) {
  width: 12.5rem;
  max-width: 12.5rem;
}

:deep(.p-inputtextarea) {
  width: 15.6rem;
}
</style>
