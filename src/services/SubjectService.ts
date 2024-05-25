import type { ISubject } from '@/interfaces/ISubject';
import { Configuration } from '@/util/enum/Configuration';
import { SubjectDto } from '@/dto/SubjectDto';
import useAuthStore from '@/store/auth';
import { ref } from 'vue';
import type { Ref } from 'vue';


class SubjectService {
  private subjects: Ref<Array<ISubject>>;

  private readonly store = useAuthStore();

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
      
      this.subjects.value = await json;
    } catch (error) {
      console.log(error);
    }
  }

  async create(subject: SubjectDto): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/subject`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subject),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      const { id } = response;
      this.subjects.value.push(new SubjectDto(subject.name));//revisar esta línea
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(subject: ISubject): Promise<void> {
    try {
      const token = this.store.token;
      const { name, ...details } = subject;
      const res = await fetch(`${Configuration.BACKEND_HOST}/subject/${name}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      const index = this.subjects.value.findIndex((a) => a.name === name);
      if (index !== -1) {
        this.subjects.value[index] = { name, ...details };
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async delete(name:string): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/subject/${name}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      this.subjects.value = this.subjects.value.filter(
        (subject) => subject.name !== name
      );
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async canManage(): Promise<boolean> {
    await this.store.refresh();
    const role = this.store.role;
    if (role === 'Admin' || role === 'Librarian') return true;
    return false;
  }  
}

export default SubjectService