import type { IAuthor } from './IAuthor';
import type { ISubject } from './ISubject';

export interface IBook {
  id?: number;
  title?: string;
  yearEdition?: number;
  publisher?: string;
  country?: string;
  summary?: string;
  numberPages?: number;
  subject?: ISubject;
  authors?: IAuthor[];
}
