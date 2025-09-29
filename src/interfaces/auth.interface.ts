export interface ILoginCredentials {
  userName: string;
  password: string;
}

export interface IGoogleLoginCredentials {
  name: string;
  email: string;
  googleId: string;
}

export interface IRegisterUser {
  file: string | File;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  password: string;
}
