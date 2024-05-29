import type { IAuthor } from '@/interfaces/IAuthor';
import type { ISubject } from '@/interfaces/ISubject';

export class BookDto {
  id: number;
  title: string;
  yearEdition: number;
  publisher: string;
  country: string;
  summary: string;
  numberPages: number;
  subject: ISubject;
  authors: IAuthor[];

  constructor(
    id: number,
    title: string,
    yearEdition: number,
    publisher: string,
    country: string,
    summary: string,
    numberPages: number,
    subject: ISubject,
    authors: IAuthor[]
  ) {
    this.id = id;
    this.title = title;
    this.yearEdition = yearEdition;
    this.publisher = publisher;
    this.country = country;
    this.summary = summary;
    this.numberPages = numberPages;
    this.subject = subject;
    this.authors = authors;
  }
}
