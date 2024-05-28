<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <ConfirmDialog></ConfirmDialog>
    <div class="container">
      <i
        v-if="loading"
        class="pi pi-spin pi-spinner big-loading"
        style="font-size: 5rem; color: #10b981"
      ></i>
      <DataTable
        :value="users"
        v-model:filters="filters"
        dataKey="id"
        :globalFilterFields="['name', 'lastName', 'email', 'role']"
        showGridlines
        v-if="!loading"
        sortField="lastName"
        :sortOrder="1"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
      >
        <template #header>
          <div class="flex justify-content-between">
            <IconField iconPosition="left">
              <InputIcon style="margin-top: -0.7rem">
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
                :pt="{ root: { style: 'margin-top: 0.2rem' } }"
              />
            </IconField>
            <Button
              v-if="canManage"
              label="New"
              icon="pi pi-plus"
              class="mr-2"
              @click="openNew"
            />
          </div>
        </template>
        <Column field="name" header="Name" sortable></Column>
        <Column field="lastName" header="Last Name" :sortable="true"></Column>
        <Column field="email" header="Email" :sortable="true"></Column>
        <Column field="role" header="Role" :sortable="true"></Column>
        <Column v-if="canManage" style="width: 90px">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="userDialog"
        modal
        :header="titleDialog"
        :style="{ width: '28rem' }"
      >
        <p class="p-text-secondary block mb-5">{{ subtitleDialog }}</p>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="name" class="font-semibold w-6rem">Name</label>
          <InputText
            id="name"
            v-model="name"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="lastname" class="font-semibold w-6rem">Last Name</label>
          <InputText
            id="lastname"
            v-model="lastName"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="dni" class="font-semibold w-6rem">DNI</label>
          <InputText
            id="dni"
            v-model="dni"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="email" class="font-semibold w-6rem">Email</label>
          <InputText
            id="email"
            v-model="email"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="pwd" class="font-semibold w-6rem">Password</label>
          <Password
            v-model="password"
            inputId="pwd"
            :feedback="false"
            toggleMask
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="role" class="font-semibold w-6rem">Role</label>
          <Dropdown
            v-model="role"
            :options="roles"
            optionLabel="name"
            placeholder="Select a Role"
            class="w-full md:w-14rem"
            :pt="{
              list: { style: 'padding: 0; margin-bottom: 0' },
              input: { style: 'width: 12.5rem' },
            }"
          />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="danger"
            @click="hideDialog"
            :pt="{ root: { style: 'width: 30%' } }"
          ></Button>
          <Button
            type="button"
            :label="labelSaveButton"
            @click="saveUser"
            :pt="{ root: { style: 'width: 35%' } }"
          ></Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FilterMatchMode } from 'primevue/api';
import { onMounted, ref, type Ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import UserService from '@/services/UserService';
import type { IUser } from '@/interfaces/IUser';
import { RoleType } from '@/util/enum/RoleType';

const toast = useToast();
const confirm = useConfirm();

const userService = new UserService();
const users = userService.getUsers();

const canManage = ref(false);

const user: Ref<IUser> = ref({});
const email = ref();
const password = ref();
const name = ref();
const lastName = ref();
const dni = ref();
const role = ref({ name: RoleType.USER });
const newUser = ref();

const roles = ref([
  { name: RoleType.USER },
  { name: RoleType.LIBRARIAN },
  { name: RoleType.ADMIN },
]);
const userDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const labelSaveButton = ref('Save');

const loading = ref(true);
const filters = ref();

const saveUser = async () => {
  newUser.value = {
    id: user.value.id,
    email: email.value,
    password: password.value,
    name: name.value,
    lastName: lastName.value,
    dni: dni.value,
    role: role.value.name,
  };
  try {
    labelSaveButton.value = 'Saving...';
    await userService.create(newUser.value);
    toast.add({
      severity: 'success',
      summary: 'User created successfully',
      life: 3000,
    });
    hideDialog();
  } catch (error) {
    let errorMessage = 'An unknown error has ocurred';
    if (error instanceof Error) {
      errorMessage = handleError(error.message);
    }
    toast.add({
      severity: 'error',
      summary: errorMessage,
      life: 3000,
    });
  }
  labelSaveButton.value = 'Save';
};

const openNew = () => {
  user.value = {};
  email.value = '';
  password.value = '';
  name.value = '';
  lastName.value = '';
  dni.value = '';
  role.value = { name: RoleType.USER };

  titleDialog.value = 'New User';
  subtitleDialog.value = "Enter the user's information";
  userDialog.value = true;
};

const confirmDelete = (userToDelete: IUser) => {
  try {
    let { id } = userToDelete;
    if (!id) id = -1;
    user.value = userToDelete;
    confirm.require({
      message: 'Do you want to delete this user?',
      header: 'Delete user',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      rejectClass: 'p-button-secondary',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await userService.delete(id);
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'The user was deleted',
          life: 3000,
        });
      },
      reject: () => {
        toast.add({
          severity: 'error',
          summary: 'Canceled',
          detail: 'The operation was canceled',
          life: 3000,
        });
      },
    });
  } catch (error) {
    let errorMessage = 'An unknown error has ocurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.add({
      severity: 'error',
      summary: errorMessage,
      life: 3000,
    });
  }
};

const hideDialog = () => {
  userDialog.value = false;
  user.value = {};
  email.value = '';
  password.value = '';
  name.value = '';
  lastName.value = '';
  dni.value = '';
  role.value = { name: RoleType.USER };
};

onMounted(async () => {
  canManage.value = await userService.canManage();
  await userService.fetchAll();
  loading.value = false;
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

const handleError = (error: string): string => {
  if (error.includes('name should not be empty'))
    return 'Name should not be empty';
  if (error.includes('lastName should not be empty'))
    return 'Last name should not be empty';
  if (error.includes('dni must be longer than or equal to 11 characters'))
    return 'DNI must have 11 digits';
  if (error.includes('email should not be empty'))
    return 'Email should not be empty';
  if (error.includes('password must be longer than or equal to 8 characters'))
    return 'Password must be longer than or equal to 8 characters';
  if (error.includes('role must be one of the')) return 'Select a role';
  if (error.includes('email must be an email')) return 'Email not valid';
  if (error.includes('dni must be a number string'))
    return 'DNI must have only digits';
  if (error.includes('Invalid dni')) return 'DNI not valid';
  if (error.includes('Ya existe la llave (dni)')) return 'DNI already exists';
  if (error.includes('Email already exists')) return 'Email already exists';

  return error;
};

initFilters();
</script>

<style scoped>
.card {
  border: none;
}

.container {
  margin-top: 20px;
  width: 80%;
  text-align: center;
}

:deep(td),
:deep(th) {
  border-color: #e5e7eb !important;
  border-style: solid !important;
  border: 1px solid;
}

:deep(.flex) {
  display: flex !important;
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem, 4rem, 1.5rem;
}

.flex {
  display: flex !important;
}

button {
  margin: 0.2rem;
}

.align-items-center {
  justify-content: space-between;
}

:deep(#pwd) {
  padding-right: 12px !important;
}

:deep(ul) {
  padding-left: 0 !important;
}

.big-loading {
  height: 65vh;
  text-align: center;
  align-content: center;
}
</style>
