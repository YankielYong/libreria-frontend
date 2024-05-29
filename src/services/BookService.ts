import type { BookDto } from '@/dto/BookDto';
import type { IBook } from '@/interfaces/IBook';
import useAuthStore from '@/store/auth';
import { Configuration } from '@/util/enum/Configuration';
import { ref, type Ref } from 'vue';

class BookService {
  private books: Ref<Array<IBook>>;

  private readonly store = useAuthStore();

  constructor() {
    this.books = ref<Array<IBook>>([]);
  }

  getBooks(): Ref<Array<IBook>> {
    return this.books;
  }

  async fetchAll(): Promise<void> {
    try {
      const url = `${Configuration.BACKEND_HOST}/book`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      this.books.value = await json;
    } catch (error) {
      console.log(error);
    }
  }

  async create(book: BookDto): Promise<void> {
    try {
      const { id, subject, authors, ...details } = book;
      const subjectId = subject.id;
      const authorsIds = authors.map((a) => a.id);
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/book`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: subjectId,
          authors: authorsIds,
          ...details,
        }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      book.id = response.id;
      this.books.value.push({ ...book });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(book: IBook): Promise<void> {
    try {
      const token = this.store.token;
      const { id, subject, authors, ...details } = book;
      const subjectId = subject?.id;
      const authorsIds = authors?.map((a) => a.id);
      const res = await fetch(`${Configuration.BACKEND_HOST}/book/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...details,
          subject: subjectId,
          authors: authorsIds,
        }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      const index = this.books.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        this.books.value[index] = { id, subject, authors, ...details };
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/book/${id}`, {
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
      this.books.value = this.books.value.filter((book) => book.id !== id);
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

export default BookService;
