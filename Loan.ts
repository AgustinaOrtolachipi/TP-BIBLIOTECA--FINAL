import { User } from './User';
import { Book } from './Book';
import { Magazine } from './Magazine';


export class Loan {
  private startDate: Date;
  private returned: boolean = false;

  constructor(private user: User, private item: Book | Magazine, startDate: Date = new Date()) {
    this.startDate = startDate;
  }

  getUser(): User {
    return this.user;
  }

  getItem(): Book | Magazine {
    return this.item;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  isReturned(): boolean {
    return this.returned;
  }

  returnItem() {
    this.returned = true;
  }
}
