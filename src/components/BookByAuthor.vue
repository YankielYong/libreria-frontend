<template>
    <div class="card">
      <h3>{{t('components.booksByAuthor.title')}}</h3>
     <h6><i>{{t('components.booksByAuthor.subtitle')}}</i></h6>
     <div class ="align-items-center gap-3 mb-3">

      
       <Dropdown
         v-model="author"
         filter
         :options="authors"
         optionLabel="name"
         :placeholder="t('components.booksByAuthor.errorAuthor')"
         class="w-full md:w-14rem"
         :pt="{
            root: { style: 'margin-right: 1rem' },
           list: { style: 'padding: 0; margin-bottom: 0' },
           input: { style: 'width: 12.5rem' },
         }"
       />
    
       <Button
            type="button"
            :label="t('components.booksByAuthor.labelExport')"
            @click="createReport"
            :pt="{ root: { style: 'width: 10rem' } }"
          ></Button>
   </div>
   </div>
</template>

<script lang="ts" setup>
import type { IAuthor } from '@/interfaces/IAuthor';
import AuthorService from '@/services/AuthorService';
import ReportService from '@/services/ReportsService';
import { defineEmits, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['error'])
const {t} = useI18n();

const author: Ref<IAuthor> = ref({});
const authorService = new AuthorService();
const authors = authorService.getAuthors();
const reportService = new ReportService();

const createReport  = async () => {
  const id = author.value.id || -1;
  if(id === -1){
    emit('error', t('components.booksByAuthor.errorAuthor'))
  }
  else{await reportService.fetchByAuthor(id)}
  
}

onMounted(async () => {
  await authorService.fetchAll();
})
</script>
<style scoped>

.card {
  padding: 1rem;
 border: none;
 border-bottom: 1px solid #d8d7d7;
 margin-bottom: 1rem;
}

h6{
  margin: 1rem 0 1.5rem 0;
}

</style>