<template>
    <div class="card">
    <h3>User's Loans Report</h3>
    <h5>In this report you can view the loans belonging to any user you select, as long as it is previously registered.</h5>
    <div class ="my-flex align-items-center gap-3 mb-3">

       <label for="user" class="font-semibold w-6rem">Subject</label>
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
   </div>
</template>

<script lang="ts" setup>
import type { IUser } from '@/interfaces/IUser';
import UserService from '@/services/UserService';
import router from '@/router';
import { getCurrentInstance, onMounted, ref, type Ref } from 'vue';

const userService = new UserService();
const user: Ref<IUser> = ref({});

const users = ref(userService.getUsers());
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