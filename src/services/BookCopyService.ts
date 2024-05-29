import type { IBookCopy } from '@/interfaces/IBookCopy';
import { Configuration } from '@/util/enum/Configuration';
import { BookCopyDto } from '@/dto/BookCopyDto';
import useAuthStore from '@/store/auth';
import { ref } from 'vue';
import type { Ref } from 'vue';

class BookCopyService {
  private bookCopies: Ref<Array<IBookCopy>>;
  private availables: Ref<Array<IBookCopy>>;

  private readonly store = useAuthStore();

  constructor() {
    this.bookCopies = ref<Array<IBookCopy>>([]);
    this.availables = ref<Array<IBookCopy>>([]);
  }

  getBookCopies(): Ref<Array<IBookCopy>> {
    return this.bookCopies;
  }

  getAvailables() {
    return this.availables;
  }

  async fetchAll(): Promise<void> {
    try {
      const token = this.store.token;
      const url = `${Configuration.BACKEND_HOST}/book-copy`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      this.bookCopies.value = await json;
      this.availables.value = this.bookCopies.value.filter(
        (b) => b.available === true
      );
    } catch (error) {
      console.log(error);
    }
  }

  async create(bookCopy: BookCopyDto): Promise<void> {
    try {
      const { id, book } = bookCopy;
      const bookId = book.id;
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/book-copy`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book: bookId }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      bookCopy.id = response.id;
      this.bookCopies.value.push({ ...bookCopy });
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async update(bookCopy: IBookCopy): Promise<void> {
    try {
      const token = this.store.token;
      const { id, book } = bookCopy;
      const bookId = book?.id;
      const res = await fetch(`${Configuration.BACKEND_HOST}/book-copy/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book: bookId }),
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      const index = this.bookCopies.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        this.bookCopies.value[index] = { id, book };
      }
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/book-copy/${id}`, {
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
      this.bookCopies.value = this.bookCopies.value.filter(
        (bookCopy) => bookCopy.id !== id
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

export default BookCopyService;
