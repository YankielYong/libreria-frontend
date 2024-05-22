<template>
  <div class="container">
    <form role="form">
      <div class="form-group">
        <label for="email">Email address:</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter Email"
          v-model="email"
        />
      </div>
      <div class="form-group">
        <label for="pwd">Password:</label>
        <input
          type="password"
          class="form-control"
          id="pwd"
          placeholder="Enter Password"
          v-model="password"
        />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="signIn">
        Sign In
      </button>
      <div>
      <router-link class="register-p" :to="{ name: 'signup' }"
        ><a class="register-p">Don't have an account? Sign Up</a></router-link
      ></div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AuthService from '@/services/AuthService';

let email = ref('');
let password = ref('');

const signIn = async () => {
  const authService = new AuthService();
  const response = await authService.sigIn(email.value, password.value);
  if (response) {
    console.log('Esta pingueta se conectooo');
    alert('OK');
  } else alert('ERROR');
};
</script>

<style scoped>
.register-p {
  display: inline-block;
  width: 100%;
  padding: 2px;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
  color: #000000;
  text-decoration: none;
}
.register-p:hover {
  color: #1930ff;
  background-color: #ffffff;
}
.btn {
  margin-top: 10px;
  width: 100%;
}
.container {
  width: 250px;
}
</style>
