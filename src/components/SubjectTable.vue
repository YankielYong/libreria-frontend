//ESTO NO LO HE TERMINADO//

<template>
    <h1>Subject Table</h1>
  </template>
  
  <script lang="ts" setup>
//revisar imports //

import Toast from 'primevue/toast'
import { computed } from 'vue'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import SubjectService from '@/services/SubjectService'
import AuthorService from '@/services/AuthorService'
import Dropdown from 'primevue/dropdown'
import { SubjectDto} from '@/dto/SubjectDto'
import Message from 'primevue/message'

const toUpdate = ref(false)


const service = new SubjectService()
const subjects = service.getSubjects()
const updatedSuccess = ref(false)

const saveSubject = async () => {
    submitted.value = true
  
    if (toUpdate.value) {
      subjectToUpdate.value = new SubjectDto(
        subject.value.id,
        nameSubject.value,
        
  )
    console.log(subject.value.id)
    console.log(nameSubject.value)

    try {
        await service.update(subjectToUpdate.value)
  
        toast.add({ severity: 'success', summary: 'Subject has been successfully updated', life: 3000 })
      } catch (error) {
        let errorMessage = 'An unexpected error occurred '
        if (error instanceof Error) {
          errorMessage = error.message
        }
        toast.add({
          severity: 'error',
          summary: errorMessage,
          // detail: errorMessage,
          life: 3000
        })
      }
      toUpdate.value = false
      // updatedSuccess.value = true
    } else {
      alert('Insertion may be here')
    }
    hideDialog()
}

//Editing subject//

const editSubject = (sbt: SubjectDto) => {
  subject.value = { ...sbt }
  nameSubject.value = subject.value.name
   subjectDialog.value = true
  toUpdate.value = true
}

//Deleting subject//

const deleteSubject = async () => {
  console.log(subject.value.id)
  await service.deleteSubject(subject.value.id)
  toast.add({ severity: 'success', summary: 'Subject has been successfully updated', life: 3000 })
  deleteSubjectDialog.value = false
  hideDialog()
}

</script>
  
<style scoped></style>
