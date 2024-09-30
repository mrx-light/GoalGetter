export interface UserInterface {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isActive?: boolean;
}
