import type { IUser } from '@/interfaces/IUser';

export class SanctionDto {
  id: number;
  startDate: Date;
  duration: number;
  endDate: Date;
  user: IUser;

  constructor(
    id: number,
    startDate: Date,
    duration: number,
    endDate: Date,
    user: IUser
  ) {
    this.id = id;
    this.startDate = startDate;
    this.duration = duration;
    this.endDate = endDate;
    this.user = user;
  }
}
