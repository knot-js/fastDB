import crypto from "crypto";
export class Document<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deleted: boolean;
  data: T;

  constructor(data: T) {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
    this.deleted = false;
    this.data = data;
  }
}
