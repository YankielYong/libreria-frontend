import type { SanctionDto } from '@/dto/SanctionDto';
import type { ISanction } from '@/interfaces/ISanction';
import type { IUser } from '@/interfaces/IUser';
import useAuthStore from '@/store/auth';
import { Configuration } from '@/util/enum/Configuration';
import { ref, type Ref } from 'vue';

class SanctionService {
  private sanctions: Ref<Array<ISanction>>;

  private readonly store = useAuthStore();

  constructor() {
    this.sanctions = ref<Array<ISanction>>([]);
  }

  getSanctions(): Ref<Array<IUser>> {
    return this.sanctions;
  }

  async fetchAll(): Promise<void> {
    try {
      const token = this.store.token;
      const url = `${Configuration.BACKEND_HOST}/sanction`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      this.sanctions.value = await json;
    } catch (error) {
      console.log(error);
    }
  }

  async create(sanction: SanctionDto): Promise<void> {
    try {
      const { id, user, ...details } = sanction;
      const userId = user.id;
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/sanction`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userId,
          ...details,
        }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      sanction.id = response.id;
      this.sanctions.value.push({ ...sanction });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(book: ISanction): Promise<void> {
    try {
      const token = this.store.token;
      const { id, user, ...details } = book;
      const userId = user?.id;
      const res = await fetch(`${Configuration.BACKEND_HOST}/sanction/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...details,
          user: userId,
        }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      const index = this.sanctions.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.sanctions.value[index] = { id, user, ...details };
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/sanction/${id}`, {
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
      this.sanctions.value = this.sanctions.value.filter(
        (sanction) => sanction.id !== id
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

export default SanctionService;
