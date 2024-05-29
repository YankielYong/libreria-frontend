import type { IBook } from '@/interfaces/IBook';

export class BookCopyDto {
  id: number;
  book: IBook;

  constructor(id: number, book: IBook) {
    this.id = id;
    this.book = book;
  }
}
