<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <div class="container">
      <div class="form-group">
        <FloatLabel>
          <InputText
            id="email"
            v-model="email"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="email">Email</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <Password
            v-model="password"
            inputId="pwd"
            :feedback="false"
            toggleMask
          />
          <label for="pwd">Password</label>
        </FloatLabel>
      </div>

      <Button
        label="Sign In"
        raised
        v-if="!loading"
        @click="signIn"
        :pt="{ root: { class: 'my-button' } }"
      />
      <div v-if="!loading">
        <router-link class="register-p" :to="{ name: 'signup' }">
          Don't have an account? Sign Up
        </router-link>
      </div>
      <i
        v-if="loading"
        class="pi pi-spin pi-spinner"
        style="font-size: 1.5rem; color: #10b981"
      ></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import router from '@/router';
import { useAuthStore } from '@/store/auth';

const store = useAuthStore();
const toast = useToast();

let email = ref('');
let password = ref('');

const loading = ref(false);

const signIn = async () => {
  loading.value = true;
  const response = await store.signIn(email.value, password.value);
  if (response) {
    router.push({ name: 'home' });
  } else {
    let error = store.error;
    if (error.includes('email should not be empty'))
      error = 'Email should not be empty';
    else if (error.includes('password should not be empty'))
      error = 'Password should not be empty';
    else if (error.includes('email must be an email'))
      error = 'Email not valid';
    else if (
      error.includes('password must be longer than or equal to 8 characters')
    )
      error = 'Password must be longer than or equal to 8 characters';
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error,
      life: 3000,
    });
  }
  loading.value = false;
};
</script>

<style scoped>
.card {
  border: none;
}
.container {
  padding: 0;
  width: 250px;
  margin-top: 80px;
}

.form-group {
  margin-top: 2rem;
  width: 100%;
  margin-bottom: 20px;
}

.my-input {
  width: 100%;
}

.my-button {
  width: 100%;
  padding: 0.5rem 1rem;
}

:deep(#pwd) {
  padding: 12px;
}

.register-p {
  margin-top: 0.8rem;
  display: inline-block;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: #10b981;
  transition: color 0.2s;
}

.register-p:hover {
  color: #056438;
}

.pi {
  width: 100%;
  text-align: center;
}
</style>
