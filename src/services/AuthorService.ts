import { AuthorDto } from '@/dto/AuthorDto';
import type { IAuthor } from '@/interfaces/IAuthor';
import useAuthStore from '@/store/auth';
import { Configuration } from '@/util/enum/Configuration';
import { ref } from 'vue';
import type { Ref } from 'vue';

class AuthorService {
  private authors: Ref<Array<IAuthor>>;

  private readonly store = useAuthStore();

  constructor() {
    this.authors = ref<Array<IAuthor>>([]);
  }

  getAuthors(): Ref<Array<IAuthor>> {
    return this.authors;
  }

  async fetchAll(): Promise<void> {
    try {
      const url = `${Configuration.BACKEND_HOST}/author`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      this.authors.value = await json;
    } catch (error) {
      console.log(error);
    }
  }

  async create(author: AuthorDto): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/author`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(author),
      });
      const response = await res.json();
      if('error' in response){
        throw new Error(response.message);
      }
      const { id } = response;
      this.authors.value.push({ id, ...author });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(author: IAuthor): Promise<void> {
    try {
      const token = this.store.token;
      const {id, ...details} = author;
      const res = await fetch(`${Configuration.BACKEND_HOST}/author/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      });
      const response = await res.json();
      if('error' in response){
        throw new Error(response.message);
      }
      const index = this.authors.value.findIndex((a) => a.id === id)
      if (index !== -1){
        this.authors.value[index] = {id, ...details};
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async canManage(): Promise<boolean> {
    await this.store.refresh()
    const role = this.store.role;
    if(role === 'Admin' || role === 'Librarian') return true;
    return false;
  }
}

export default AuthorService;
