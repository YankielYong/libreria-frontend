export class UserDto {
  email: string;
  password: string;
  name: string;
  lastName: string;
  dni: string;
  role?: number;

  constructor(
    email: string,
    password: string,
    name: string,
    lastName: string,
    dni: string,
    role?: number
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.lastName = lastName;
    this.dni = dni;
    this.role = role;
  }
}
