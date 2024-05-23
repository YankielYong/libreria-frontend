import type { ISubject } from '@/interfaces/ISubject';
import { Configuration } from '@/util/enum/Configuration';
import { ref } from 'vue';
import type { Ref } from 'vue';

class SubjectService {
  private subjects: Ref<Array<ISubject>>;

  constructor() {
    this.subjects = ref<Array<ISubject>>([]);
  }

  getSubjects(): Ref<Array<ISubject>> {
    return this.subjects;
  }

  async fetchAll(): Promise<void> {
    try {
      const url = `${Configuration.BACKEND_HOST}/subject`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      console.log(json.message);

      this.subjects.value = await json;
    } catch (error) {
      console.log(error);
    }
  }
}

export default SubjectService