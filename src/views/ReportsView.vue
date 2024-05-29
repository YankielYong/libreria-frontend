<template>
    <Toast position="top-right" style="width: 50%" />
    <BookByAuthor @error="showError" />
    <BookBySubject @error="showError" />
    <UserLoans @error="showError" />

</template>

<script lang="ts" setup>
import BookByAuthor from '@/components/BookByAuthor.vue';
import BookBySubject from '@/components/BookBySubject.vue';
import UserLoans from '@/components/UserLoans.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const showError = (msg: string) => {
    toast.add({
      severity: 'error',
      summary: msg,
      life: 3000,
    })
}

</script>

<style scoped>

</style>