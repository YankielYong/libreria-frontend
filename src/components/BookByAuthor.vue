<template>
    <div class="card">
    <h3>Books By Author Report</h3>
    <h5>In this report you can view the books belonging to any author you select, as long as it is previously registered.</h5>
    <div class ="my-flex align-items-center gap-3 mb-3">

       <label for="author" class="font-semibold w-6rem">Author</label>
       <Dropdown
         v-model="author"
         filter
         :options="authors"
         optionLabel="name"
         placeholder="Select an Author"
         class="w-full md:w-14rem"
         :pt="{
           list: { style: 'padding: 0; margin-bottom: 0' },
           input: { style: 'width: 12.5rem' },
         }"
       />
    
   </div>
   </div>
</template>

<script lang="ts" setup>
import type { IAuthor } from '@/interfaces/IAuthor';
import AuthorService from '@/services/AuthorService';
import router from '@/router';
import { getCurrentInstance, onMounted, ref, type Ref } from 'vue';

const author: Ref<IAuthor> = ref({});
const authorService = new AuthorService();
const authors = ref(authorService.getAuthors());
</script>
<style scoped>

.card {
 border: none;
}
.my-flex {
 display: flex !important;
}
.align-items-center {
 justify-content: space-between;
}

</style>