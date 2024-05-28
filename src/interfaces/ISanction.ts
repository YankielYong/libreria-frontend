import type { IUser } from './IUser';

export interface ISanction {
  id?: number;
  startDate?: Date;
  duration?: number;
  endDate?: Date;
  isActive?: boolean;
  user?: IUser;
}
