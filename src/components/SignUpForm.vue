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
          <label for="email">{{ t('components.auth.email') }}</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <InputText
            id="name"
            v-model="name"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="name">{{ t('components.auth.name') }}</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <InputText
            id="lastname"
            v-model="lastName"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="lastname">{{ t('components.auth.lastName') }}</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <InputText
            id="dni"
            v-model="dni"
            :pt="{ root: { class: 'my-input' } }"
          />
          <label for="dni">{{ t('components.auth.dni') }}</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <FloatLabel>
          <Password v-model="password" inputId="pwd" toggleMask>
            <template #header>
              <h6>{{ t('components.auth.pickPassword') }}</h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2">{{ t('components.auth.sugg') }}</p>
              <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                <li>{{ t('components.auth.minPassw') }}</li>
              </ul>
            </template>
          </Password>
          <label for="pwd">{{ t('components.auth.password') }}</label>
        </FloatLabel>
      </div>

      <Button
        :label="t('components.auth.signup')"
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
import { useI18n } from 'vue-i18n';
import router from '@/router';
import { UserDto } from '@/dto/UserDto';
import useAuthStore from '@/store/auth';

const store = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const loading = ref(false);

let email = ref('');
let name = ref('');
let lastName = ref('');
let dni = ref('');
let password = ref('');

const signUp = async () => {
  const user: UserDto = new UserDto(
    0,
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
      error = t('components.auth.errorEmailEmpty');
    if (error.includes('name should not be empty'))
      error = t('components.auth.errorNameEmpty');
    if (error.includes('lastName should not be empty'))
      error = t('components.auth.errorLastNameEmpty');
    else if (error.includes('password should not be empty'))
      error = t('components.auth.errorPasswordEmpty');
    else if (
      error.includes('dni must be longer than or equal to 11 characters')
    )
      error = t('components.auth.errorDniLength');
    else if (error.includes('dni must be a number string'))
      error = t('components.auth.errorDniFormat');
    else if (error.includes('email must be an email'))
      error = t('components.auth.errorInvalidEmail');
    else if (
      error.includes('password must be longer than or equal to 8 characters')
    )
      error = t('components.auth.errorPasswordLength');
    else if (error.includes('Invalid dni'))
      error = t('components.auth.errorInvalidDni');
    else if (error.includes('Ya existe la llave (dni)'))
      error = t('components.auth.errorDniExists');
    toast.add({
      severity: 'error',
      summary: t('components.auth.failLogin'),
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
