import type { IUser } from '@/interfaces/IUser';

export class SanctionDto {
  startDate: Date;
  duration: number;
  endDate: Date;
  user: IUser;

  constructor(startDate: Date, duration: number, endDate: Date, user: IUser) {
    this.startDate = startDate;
    this.duration = duration;
    this.endDate = endDate;
    this.user = user;
  }
}
