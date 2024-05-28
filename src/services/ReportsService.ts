import type { IBook } from '@/interfaces/IBook'; 
import useAuthStore from '@/store/auth'; 
import { Configuration } from '@/util/enum/Configuration'; 
import { ref, type Ref } from 'vue';

class ReportsService {
  

  private readonly store = useAuthStore();

  async fetchBySubject(subject: string): Promise<void> {
    try {
      const url = `${Configuration.BACKEND_HOST}/report/subject/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

    
    } catch (error) {
      console.log(error);
    }
  }

  async fetchByAuthor(author: string): Promise<void> {
    try {
      const url = `${Configuration.BACKEND_HOST}/report/author/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

     
    } catch (error) {
      console.log(error);
    }
  }

  async fetchByUser(user: string): Promise<void> {
    try {
      const url = `${Configuration.BACKEND_HOST}/report/user/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

    } catch (error) {
      console.log(error);
    }
  }

}

export default ReportsService;