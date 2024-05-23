<template>
    <div class="card">
        <DataTable :value="authors" tableStyle="min-width: 50rem">
            <Column field="name" header="Name"></Column>
            <Column field="lastName" header="Last Name"></Column>
        </DataTable>
    </div>
</template>

<script lang="ts" setup>
import AuthorService from '@/services/AuthorService';
import { onMounted } from 'vue';

const authorService = new AuthorService();
const authors = authorService.getAuthors();

onMounted(async () => {
    await authorService.fetchAll()
})
</script>

<style scoped></style>
