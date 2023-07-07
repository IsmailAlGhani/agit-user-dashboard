export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  expiredDate: Date;
  groupAccess: GroupAccess;
}

export interface Sorting {
  label: string;
  isAscend: boolean;
}

export enum GroupAccess {
  ADMIN = "admin",
  MEMBER = "member",
}

export enum FormType {
  CREATE,
  UPDATE,
  DELETE,
}

export enum PageType {
  PREVIOUS,
  NEXT,
}
