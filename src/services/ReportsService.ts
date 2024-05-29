import useAuthStore from '@/store/auth';
import { Configuration } from '@/util/enum/Configuration';
class ReportsService {
  private readonly store = useAuthStore();

  async fetchBySubject(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const url = `${Configuration.BACKEND_HOST}/reports/books-by-subject/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await this.download(response);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchByAuthor(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const url = `${Configuration.BACKEND_HOST}/reports/books-by-author/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await this.download(response);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchByUser(id: number): Promise<void> {
    try {
      const token = this.store.token;
      const url = `${Configuration.BACKEND_HOST}/reports/loans-by-user/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await this.download(response);
    } catch (error) {
      console.log(error);
    }
  }

  async download(response: Response): Promise<void> {
    try {
      let contentDisposition = response.headers.get('Content-Disposition');
      let filename = contentDisposition
        ? contentDisposition.split('filename="')[1]
        : 'last-report.pdf';
      if (filename.charAt(filename.length - 1) === '"')
        filename = filename.slice(0, filename.length - 1);
      const blob = await response.blob();
      const url2 = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url2;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url2);
    } catch (error) {
      console.log(error);
    }
  }
}

export default ReportsService;
