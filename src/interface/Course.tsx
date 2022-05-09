import { IStudent } from "./Student";

export interface ICourse {
  id: string;
  name: string;
  students: string[];
}

export interface ICourseHydrated {
  id: string;
  name: string;
  students: (IStudent | undefined)[];
}
