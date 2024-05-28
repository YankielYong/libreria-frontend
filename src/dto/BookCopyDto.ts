import type { IBook } from '@/interfaces/IBook';

export class BookCopyDto {
  book: IBook;

  constructor(book: IBook) {
    this.book = book;
  }
}
