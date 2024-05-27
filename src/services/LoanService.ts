import { LoanDto } from "@/dto/LoanDto";
import type { ILoan } from "@/interfaces/ILoan"
import useAuthStore from "@/store/auth";
import { Configuration } from "@/util/enum/Configuration";
import {ref} from 'vue';
import type {Ref} from 'vue';

class LoanService {
    private loans: Ref<Array<ILoan>>;
  
    private readonly store = useAuthStore();
  
    constructor() {
      this.loans = ref<Array<ILoan>>([]);
    }
  
    getUsers(): Ref<Array<ILoan>> {
      return this.loans;
    }
  
    async fetchAll(): Promise<void> {
      try {
        const token = this.store.token;
        const url = `${Configuration.BACKEND_HOST}/user`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
  
        const json = await response.json();
  
        this.loans.value = await json;
      } catch (error) {
        console.log(error);
      }
    }
  
    async create(loan: LoanDto): Promise<void> {
      try {
        const token = this.store.token;
        const res = await fetch(`${Configuration.BACKEND_HOST}/loan`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(loan),
        });
        const response = await res.json();
        if ('error' in response) {
          throw new Error(response.message);
        }
        const { id } = response;
        this.loans.value.push({ id, ...loan });
      } catch (error) {
        console.log(error);
        throw new Error(`failed: ${error}`);
      }
    }
  
    async update(loan: ILoan): Promise<void> {
      try {
        const token = this.store.token;
        const { id, ...details } = loan;
        const res = await fetch(`${Configuration.BACKEND_HOST}/loan/${id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(details),
        });
        const response = await res.json();
        if ('error' in response) {
          throw new Error(response.message);
        }
        const index = this.loans.value.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.loans.value[index] = { id, ...details };
        }
      } catch (error) {
        console.log(error);
        throw new Error(`failed: ${error}`);
      }
    }
   async delete(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const res = await fetch(`${Configuration.BACKEND_HOST}/author/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();
      if ('error' in response) {
        throw new Error(response.message);
      }
      this.loans.value = this.loans.value.filter(
        (loan) => loan.id !== id
      );
    } catch (error) {
      console.log(error);
      throw new Error(`failed: ${error}`);
    }
  }

  async canManage(): Promise<boolean> {
    await this.store.refresh();
    const role = this.store.role;
    if (role === 'Admin') return true;
    return false;
  }
}

export default LoanService;