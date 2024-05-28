import type { IBookCopy } from './IBookCopy';
import type { IUser } from './IUser';

export interface ILoan {
  id?: number;
  bookCopy?: IBookCopy;
  user?: IUser;
  startDate?: Date;
  endDate?: Date;
  pending?: boolean;
}
