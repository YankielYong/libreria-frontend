<template>
  <div class="card">
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
        @click="signIn"
        :pt="{ root: { class: 'my-button' } }"
      />
      <div>
        <router-link class="register-p" :to="{ name: 'signup' }">
          Don't have an account? Sign Up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/store/auth';

const store = useAuthStore();

let email = ref('');
let password = ref('');

const signIn = async () => {
  const response = await store.signIn(email.value, password.value);
  if (response) {
    router.push({ name: 'home' });
  } else alert(store.error);
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

.register-p:hover{
  color: #056438;
}
</style>
