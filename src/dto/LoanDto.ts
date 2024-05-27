export class LoanDto {
    bookCopy?: object;
    userId?: object;
    startDate?: string;
    endDate?: string;
  
    constructor(
    bookCopy?: object,
    userId?: object,
    startDate?: string,
    endDate?: string,
    ) {
      this.bookCopy = bookCopy;
      this.userId = userId;
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }
  