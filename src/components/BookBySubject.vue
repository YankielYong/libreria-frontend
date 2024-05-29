<template>
  <div class="card">
    <h3>{{ t('components.booksBySubject.title') }}</h3>
    <h6>
      <i>{{ t('components.booksBySubject.subtitle') }}</i>
    </h6>
    <div class="align-items-center gap-3 mb-3">
      <Dropdown
        v-model="subject"
        filter
        :options="subjects"
        optionLabel="name"
        :placeholder="t('components.booksBySubject.errorSubject')"
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
import type { ISubject } from '@/interfaces/ISubject';
import SubjectService from '@/services/SubjectService';
import ReportService from '@/services/ReportsService';
import { onMounted, ref, watchEffect, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['error']);
const { t } = useI18n();

const exportLabel = ref(t('components.booksBySubject.labelExport'));

const subject: Ref<ISubject> = ref({});
const subjectService = new SubjectService();
const subjects = subjectService.getSubjects();
const reportService = new ReportService();

const createReport = async () => {
  const id = subject.value.id || -1;
  if (id === -1) {
    emit('error', t('components.booksBySubject.errorSubject'));
  } else {
    exportLabel.value = t('components.booksBySubject.labelExporting');
    await reportService.fetchBySubject(id);
    exportLabel.value = t('components.booksBySubject.labelExport');
  }
};

watchEffect(() => {
  exportLabel.value = t('components.usersLoans.labelExport');
});

onMounted(async () => {
  await subjectService.fetchAll();
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
