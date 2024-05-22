import type { UserDto } from '@/dto/UserDto';
import { Configuration } from '@/util/enum/Configuration';
import { ref, type Ref } from 'vue';

class AuthService {
  private jwt: Ref<string>;
  private error: Ref<string>;

  constructor() {
    this.jwt = ref('');
    this.error = ref('');
  }

  getJwt() {
    return this.jwt;
  }

  getError() {
    return this.error;
  }

  async sigIn(email: string, password: string): Promise<boolean> {
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
        this.error.value = 'Failed';
        return false;
      }

      this.jwt.value = response.token;
      return true;
    } catch (error) {
      this.error.value = 'Failed';
      console.log(error);
      return false;
    }
  }

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
        this.error.value = 'Failed';
        return false;
      }

      this.jwt.value = response.token;
      return true;
    } catch (error) {
      this.error.value = 'Failed';
      console.log(error);
      return false;
    }
  }
}

export default AuthService;
