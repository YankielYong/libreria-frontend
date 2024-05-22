<template>
  <div class="container">
    <form role="form">
      <div class="form-group">
        <label for="email">Email address:</label>
        <input
          type="email"
          class="form-control"
          id="email"
          required
          placeholder="Enter Email"
          v-model="email"
        />
      </div>
      <div class="form-group">
        <label for="username">Name:</label>
        <input
          type="text"
          class="form-control"
          id="username"
          required
          placeholder="Enter Name"
          v-model="name"
        />
      </div>
      <div class="form-group">
        <label for="lastname">Last Name:</label>
        <input
          type="text"
          class="form-control"
          id="lastname"
          required
          placeholder="Enter Last Name"
          v-model="lastName"
        />
      </div>
      <div class="form-group">
        <label for="dni">DNI:</label>
        <input
          type="text"
          class="form-control"
          id="dni"
          required
          placeholder="Enter DNI"
          v-model="dni"
        />
      </div>
      <div class="form-group">
        <label for="pwd">Password:</label>
        <input
          type="password"
          class="form-control"
          id="pwd"
          required
          placeholder="Enter Password"
          v-model="password"
        />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="signUp">
        Sign Up
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AuthService from '@/services/AuthService';
import { UserDto } from '@/dto/UserDto';

let email = ref('');
let name = ref('');
let lastName = ref('');
let dni = ref('');
let password = ref('');

const signUp = async () => {
  const authService = new AuthService();
  const user: UserDto = new UserDto(email.value, password.value, name.value, lastName.value, dni.value) 
  const response = await authService.signUp(user);
  if (response) {
    alert('OK');
  } else alert('ERROR');
};
</script>

<style scoped>
.btn {
  margin-top: 10px;
  width: 100%;
}
.container {
  width: 250px;
}
</style>
