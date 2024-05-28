<template>
     <div class="card">
     <h3>Books By Subject Report</h3>
     <h5>In this report you can view the books belonging to any subject you select, as long as it is previously registered.</h5>
     <div class ="my-flex align-items-center gap-3 mb-3">

        <label for="subject" class="font-semibold w-6rem">Subject</label>
        <Dropdown
          v-model="subject"
          filter
          :options="subjects"
          optionLabel="name"
          placeholder="Select a Subject"
          class="w-full md:w-14rem"
          :pt="{
            list: { style: 'padding: 0; margin-bottom: 0' },
            input: { style: 'width: 12.5rem' },
          }"
        />
     
    </div>
    </div>
</template>

<script lang="ts" setup>
import type { ISubject } from '@/interfaces/ISubject';
import SubjectService from '@/services/SubjectService';
import router from '@/router';
import { getCurrentInstance, onMounted, ref, type Ref } from 'vue';

const subject: Ref<ISubject> = ref({});
const subjectService = new SubjectService();
const subjects = ref(subjectService.getSubjects());
</script>
<style scoped>

.card {
  border: none;
}
.my-flex {
  display: flex !important;
}
.align-items-center {
  justify-content: space-between;
}

</style>