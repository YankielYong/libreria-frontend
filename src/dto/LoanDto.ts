import type { IBookCopy } from '@/interfaces/IBookCopy';
import type { IUser } from '@/interfaces/IUser';

export class LoanDto {
  bookCopy?: IBookCopy;
  user?: IUser;
  startDate?: Date;
  endDate?: Date;

  constructor(
    bookCopy?: IBookCopy,
    user?: IUser,
    startDate?: Date,
    endDate?: Date
  ) {
    this.bookCopy = bookCopy;
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
