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
          <label for="email">Email Adress</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <InputText
            id="name"
            v-model="name"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="name">Name</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <InputText
            id="lastname"
            v-model="lastName"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="lastname">Last Name</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <InputText
            id="dni"
            v-model="dni"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="dni">DNI</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <Password v-model="password" inputId="pwd" toggleMask>
            <template #header>
              <h6>Pick a password</h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2">Suggestions</p>
              <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                <li>Minimum 8 characters</li>
              </ul>
            </template>
          </Password>
          <label for="pwd">Password</label>
        </FloatLabel>
      </div>

      <Button
        label="Sign Up"
        raised
        v-if="!loading"
        @click="signUp"
        :pt="{ root: { class: 'my-button' } }"
      />

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
import { UserDto } from '@/dto/UserDto';
import useAuthStore from '@/store/auth';

const store = useAuthStore();
const toast = useToast();
const loading = ref(false);

let email = ref('');
let name = ref('');
let lastName = ref('');
let dni = ref('');
let password = ref('');

const signUp = async () => {
  const user: UserDto = new UserDto(
    email.value,
    password.value,
    name.value,
    lastName.value,
    dni.value
  );
  loading.value = true;
  const response = await store.signUp(user);
  if (response) {
    router.push({ name: 'home' });
  } else {
    let error = store.error;
    if (error.includes('email should not be empty'))
      error = 'Email should not be empty';
    if (error.includes('name should not be empty'))
      error = 'Name should not be empty';
    if (error.includes('lastName should not be empty'))
      error = 'Last name should not be empty';
    else if (error.includes('password should not be empty'))
      error = 'Password should not be empty';
    else if (
      error.includes('dni must be longer than or equal to 11 characters')
    )
      error = 'DNI must have 11 digits';
    else if (error.includes('dni must be a number string'))
      error = 'DNI must have only digits';
    else if (error.includes('email must be an email'))
      error = 'Email not valid';
    else if (
      error.includes('password must be longer than or equal to 8 characters')
    )
      error = 'Password must be longer than or equal to 8 characters';
    else if (error.includes('Invalid dni')) error = 'DNI not valid';
    else if (error.includes('Ya existe la llave (dni)'))
      error = 'DNI already exists';
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
  padding: 0 !important;
  width: 250px;
  margin-top: 30px;
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

.pi {
  width: 100%;
  text-align: center;
}
</style>
