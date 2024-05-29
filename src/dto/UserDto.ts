export class UserDto {
  id: number;
  email: string;
  password: string;
  name: string;
  lastName: string;
  dni: string;
  role?: number;

  constructor(
    id: number,
    email: string,
    password: string,
    name: string,
    lastName: string,
    dni: string,
    role?: number
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.lastName = lastName;
    this.dni = dni;
    this.role = role;
  }
}
