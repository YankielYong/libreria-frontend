import type { IBook } from './IBook';

export interface IBookCopy {
  id?: number;
  book?: IBook;
  available?: boolean;
}
