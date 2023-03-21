import { v4 as uuidv4 } from "uuid";
export class Document<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deleted: boolean;
  data: T;

  constructor(data: T) {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
    this.deleted = false;
    this.data = data;
  }
}
