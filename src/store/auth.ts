import { defineStore } from 'pinia';
import { Configuration } from '@/util/enum/Configuration';
import type { UserDto } from '@/dto/UserDto';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: null,
      role: null,
      error: '',
    };
  },

  actions: {
    async signIn(email: string, password: string): Promise<boolean> {
      try {
        const res = await fetch(`${Configuration.BACKEND_HOST}/auth/signin`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const response = await res.json();

        if ('error' in response) {
          this.token = null;
          this.role = null;
          this.error = response.message;
          return false;
        }

        this.token = response.token;
        this.error = '';
        return true;
      } catch (error) {
        console.log(error);
        this.token = null;
        this.role = null;
        this.error = 'FATAL ERROR';
        return false;
      }
    },

    async signUp(userDto: UserDto): Promise<boolean> {
      try {
        const { email, password, name, lastName, dni } = userDto;
        const res = await fetch(`${Configuration.BACKEND_HOST}/auth/signup`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
            lastName,
            dni,
          }),
        });

        const response = await res.json();

        if ('error' in response) {
          this.token = null;
          this.role = null;
          this.error = response.message;
          return false;
        }

        this.token = response.token;
        this.role = response.role;
        this.error = '';
        return true;
      } catch (error) {
        console.log(error);
        this.token = null;
        this.role = null;
        this.error = 'FATAL ERROR';
        return false;
      }
    },

    async refresh() {
      try {
        const res = await fetch(
          `${Configuration.BACKEND_HOST}/auth/check-status`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        const response = await res.json();

        if ('statusCode' in response) {
          this.token = null;
          this.role = null;
          this.error = response.message;
          return false;
        }

        this.token = response.token;
        this.role = response.role;
        this.error = '';
        return true;
      } catch (error) {
        console.log(error);
        this.token = null;
        this.error = 'FATAL ERROR';
        return false;
      }
    },

    logout() {
      this.token = null;
      this.role = null;
      this.error = '';
    },
  },
});

export default useAuthStore;
