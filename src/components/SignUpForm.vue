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
        @click="signUp"
        :pt="{ root: { class: 'my-button' } }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import router from '@/router';
import { UserDto } from '@/dto/UserDto';
import useAuthStore from '@/store/auth';

const store = useAuthStore();

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
  const response = await store.signUp(user);
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
  padding: 0!important;
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
</style>
