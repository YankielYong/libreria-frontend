import { UserDto } from '@/dto/UserDto';
import type { IUser } from '@/interfaces/IUser';
import useAuthStore from '@/store/auth';
import { Configuration } from '@/util/enum/Configuration';
import { ref } from 'vue';
import type { Ref } from 'vue';

class UserService {
  private users: Ref<Array<IUser>>;

  private readonly store = useAuthStore();

  constructor() {
    this.users = ref<Array<IUser>>([]);
  }

  getUsers(): Ref<Array<IUser>> {
    return this.users;
  }

  async fetchAll(): Promise<void> {
    try {
      const token = this.store.token;
      const url = `${Configuration.BACKEND_HOST}/user`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      this.users.value = await json;
    } catch (error) {
      console.log(error);
    }
  }

  async create(user: UserDto): Promise<void> {
    try {
      const { id, ...details } = user;
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/user`, {
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
      user.id = response.id;
      this.users.value.push({ ...user });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(user: IUser): Promise<void> {
    try {
      const token = this.store.token;
      const { id, ...details } = user;
      const res = await fetch(`${Configuration.BACKEND_HOST}/user/${id}`, {
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
      const index = this.users.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.users.value[index] = { id, ...details };
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }
  async delete(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/user/${id}`, {
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
      this.users.value = this.users.value.filter((user) => user.id !== id);
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async canManage(): Promise<boolean> {
    await this.store.refresh();
    const role = this.store.role;
    if (role === 'Admin') return true;
    return false;
  }
}

export default UserService;
