<template>
  <h3>Autores</h3>
  <ul>
    <li v-for="author in authors" :key="author.id">
      {{ author.name }} {{ author.lastName }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import AuthorService from '@/services/AuthorService';
import { onMounted } from 'vue';

const authorService = new AuthorService();
const authors = authorService.getAuthors();

onMounted(async () => {
  await authorService.fetchAll();
});
</script>

<style></style>
