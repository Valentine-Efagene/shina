import { IStudent } from "./Student";

export interface ICourse {
  name: string;
  students: IStudent[];
}
