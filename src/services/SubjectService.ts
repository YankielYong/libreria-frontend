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
      const { id, ...details } = subject;
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/subject`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...details }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      subject.id = response.id;
      this.subjects.value.push({ ...subject });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(subject: ISubject): Promise<void> {
    try {
      const token = this.store.token;
      const { id, ...details } = subject;
      const res = await fetch(`${Configuration.BACKEND_HOST}/subject/${id}`, {
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
      const index = this.subjects.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.subjects.value[index] = { id, ...details };
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/subject/${id}`, {
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
        (subject) => subject.id !== id
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

export default SubjectService;
