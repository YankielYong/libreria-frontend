<template>
  <div class="card">
    <h3>{{ t('components.usersLoans.title') }}</h3>
    <h6>
      <i>{{ t('components.usersLoans.subtitle') }}</i>
    </h6>
    <div class="align-items-center gap-3 mb-3">
      <Dropdown
        v-model="user"
        filter
        :options="users"
        optionLabel="email"
        :placeholder="t('components.usersLoans.errorLoans')"
        class="w-full md:w-14rem"
        :pt="{
          root: { style: 'margin-right: 1rem' },
          list: { style: 'padding: 0; margin-bottom: 0' },
          input: { style: 'width: 12.5rem' },
        }"
      />
      <Button
        type="button"
        :label="exportLabel"
        @click="createReport"
        :pt="{ root: { style: 'width: 10rem' } }"
      ></Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IUser } from '@/interfaces/IUser';
import UserService from '@/services/UserService';
import ReportService from '@/services/ReportsService';
import { onMounted, ref, watchEffect, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['error']);
const { t } = useI18n();

const exportLabel = ref(t('components.usersLoans.labelExport'));

const user: Ref<IUser> = ref({});
const userService = new UserService();
const users = userService.getUsers();

const reportService = new ReportService();

const createReport = async () => {
  const id = user.value.id || -1;
  if (id === -1) {
    emit('error', t('components.usersLoans.errorLoans'));
  } else {
    exportLabel.value = t('components.usersLoans.labelExporting');
    await reportService.fetchByUser(id);
    exportLabel.value = t('components.usersLoans.labelExport');
  }
};

watchEffect(() => {
  exportLabel.value = t('components.usersLoans.labelExport');
});

onMounted(async () => {
  await userService.fetchAll();
});
</script>

<style scoped>
.card {
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #d8d7d7;
  margin-bottom: 1rem;
}

h6 {
  margin: 1rem 0 1.5rem 0;
}
</style>
