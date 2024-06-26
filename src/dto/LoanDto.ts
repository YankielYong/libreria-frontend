import type { IBookCopy } from '@/interfaces/IBookCopy';
import type { IUser } from '@/interfaces/IUser';

export class LoanDto {
  id: number;
  bookCopy: IBookCopy;
  user: IUser;
  startDate: Date;
  endDate: Date;

  constructor(
    id: number,
    bookCopy: IBookCopy,
    user: IUser,
    startDate: Date,
    endDate: Date
  ) {
    this.id = id;
    this.bookCopy = bookCopy;
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
