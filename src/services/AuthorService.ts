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
      const response = await fetch(`${Configuration.BACKEND_HOST}/author`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(author),
      });
      const { id } = await response.json();
      this.authors.value.push({ id, ...author });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }
}

export default AuthorService;
