import type { IAuthor } from '@/interfaces/IAuthor';
import { Configuration } from '@/util/enum/Configuration';
import { ref } from 'vue';
import type { Ref } from 'vue';

class AuthorService {
  private authors: Ref<Array<IAuthor>>;

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
      console.log(json.message);

      this.authors.value = await json;
    } catch (error) {
      console.log(error);
    }
  }
}

export default AuthorService
