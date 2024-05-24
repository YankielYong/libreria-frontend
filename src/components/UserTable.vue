<template>
  <div class="card">
    <Toast position="top-right" style="width: 50%" />
    <ConfirmDialog></ConfirmDialog>
    <div class="container">
      <DataTable
        :value="users"
        v-model:filters="filters"
        dataKey="id"
        :globalFilterFields="['name', 'lastName', 'email', 'role']"
        showGridlines
        :loading="loading"
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
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
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
        <template #loading> Loading users. Please wait. </template>
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
        :style="{ width: '25rem' }"
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
          <label for="password" class="font-semibold w-6rem">Password</label>
          <InputText
            id="password"
            v-model="password"
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
          <label for="dni" class="font-semibold w-6rem">DNI</label>
          <InputText
            id="dni"
            v-model="dni"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="role" class="font-semibold w-6rem">Role</label>
          <InputText
            id="role"
            v-model="role"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="danger"
            @click="hideDialog"
          ></Button>
          <Button type="button" label="Save" @click="saveUser"></Button>
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
const role = ref();
const submitted = ref(false);
const newUser = ref();

const userDialog = ref(false);
const userDeleteDialog = ref(false);
const titleDialog = ref('');
const subtitleDialog = ref('');
const toUpdate = ref(false);

const loading = ref(true);
const filters = ref();

const saveUser = async () => {
  submitted.value = true;
  newUser.value = {
    id: user.value.id,
    email: email.value,
    password: password.value,
    name: name.value,
    lastName: lastName.value,
    dni: dni.value,
  };
  try {
      console.log(newUser.value);
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
      errorMessage = error.message;
    }
    toast.add({
      severity: 'error',
      summary: errorMessage,
      life: 3000,
    });
  }
};

const openNew = () => {
  user.value = {};
  submitted.value = false;

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
  submitted.value = false;
  email.value='';
  password.value='';
  name.value = '';
  lastName.value = '';
  dni.value = '';
  role.value = '';
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

initFilters();
</script>

<style scoped>
.card {
  border: none;
}
.container {
  margin-top: 20px;
  width: 80%;
}
:deep(td),
:deep(th) {
  border-color: #e5e7eb !important;
  border-style: solid !important;
  border: 1px solid;
}
:deep(.p-input-icon) {
  margin-top: -0.7rem !important;
}
:deep(.flex) {
  display: flex !important;
}
:deep(.p-dialog-content) {
  padding: 0 1.5rem, 2rem, 1.5rem;
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
</style>