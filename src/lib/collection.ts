import { Document } from "@lib/document";
import fastDb, { FastDB } from "@lib/db";
import { Where } from "@lib/interfaces";

export class Collection<T> {
  name: string;
  documents: Document<T>[] = [];
  db: FastDB = fastDb;

  constructor(name: string) {
    this.name = name;
    (async () => {
      this.documents = await this.getFromDb();
    })();
  }

  private async getFromDb(): Promise<Document<T>[]> {
    const documents = await this.db.get<T>(this.name);
    return documents.map((document) => document);
  }

  private async save(): Promise<void> {
    try {
      await this.db.save<T>(this.name, this.documents);
    } catch (err: any) {
      new Error(err);
    }
  }

  private async getDocuments(where: Where<T>): Promise<Document<T>[]> {
    const documents = this.documents.filter((document) => {
      switch (where.operator) {
        case "eq":
          return document.data[where.field] === where.value;
        case "neq":
          return document.data[where.field] !== where.value;
        case "gt":
          return document.data[where.field] > where.value;
        case "gte":
          return document.data[where.field] >= where.value;
        case "lt":
          return document.data[where.field] < where.value;
        case "lte":
          return document.data[where.field] <= where.value;
        case "in":
          return (where.value as any[]).includes(document.data[where.field]);
        case "nin":
          return !(where.value as any[]).includes(document.data[where.field]);
        case "contains":
          return (document.data[where.field] as string).includes(
            where.value as string
          );
        case "ncontains":
          return !(document.data[where.field] as string).includes(
            where.value as string
          );
        default:
          return false;
      }
    });
    if (!documents) {
      throw new Error("Document not found");
    }
    return documents;
  }

  public async insertOne(document: T): Promise<Document<T>> {
    const doc = new Document<T>(document);
    this.documents.push(doc);
    await this.save();
    return doc;
  }

  public async insertMany(documents: T[]): Promise<Document<T>[]> {
    const docs = documents.map((document) => new Document<T>(document));
    this.documents.push(...docs);
    await this.save();
    return docs;
  }

  public async findById(id: string): Promise<Document<T>> {
    const document = this.documents.find((document) => document.id === id);
    if (!document) {
      throw new Error("Document not found");
    }
    return document;
  }

  public async findOne(where: Where<T>): Promise<Document<T>> {
    const documents = await this.getDocuments(where);
    if (!documents) {
      throw new Error("Document not found");
    }
    return documents[0];
  }

  public async findMany(where: Where<T>): Promise<Document<T>[]> {
    const documents = await this.getDocuments(where);
    if (!documents) {
      throw new Error("Document not found");
    }
    return documents;
  }

  public async updateById(id: string, data: Partial<T>): Promise<Document<T>> {
    const document = this.documents.find((document) => document.id === id);
    if (!document) {
      throw new Error("Document not found");
    }
    document.data = { ...document.data, ...data };
    this.save();
    return document;
  }

  public async updateOne(
    where: Where<T>,
    data: Partial<T>
  ): Promise<Document<T>> {
    const documents = await this.getDocuments(where);
    if (!documents) {
      throw new Error("Document not found");
    }
    documents[0].data = { ...documents[0].data, ...data };
    this.save();
    return documents[0];
  }

  public async updateMany(
    where: Where<T>,
    data: Partial<T>
  ): Promise<Document<T>[]> {
    const documents = await this.getDocuments(where);
    if (!documents) {
      throw new Error("Document not found");
    }
    documents.forEach((document) => {
      document.data = { ...document.data, ...data };
    });
    this.save();
    return documents;
  }

  public async deleteById(id: string): Promise<Document<T>> {
    const document = this.documents.find((document) => document.id === id);
    if (!document) {
      throw new Error("Document not found");
    }
    this.documents = this.documents.filter((document) => document.id !== id);
    this.save();
    return document;
  }

  public async deleteOne(where: {
    [key in keyof T]?: T[key];
  }): Promise<Document<T>> {
    const foundDocument = this.documents.find((document) => {
      for (const key in where) {
        if (document.data[key] !== where[key]) {
          return false;
        }
      }
      return true;
    });
    if (!document) {
      throw new Error("Document not found");
    }
    this.documents = this.documents.filter(
      (document) => document.id !== foundDocument!.id
    );
    this.save();
    return foundDocument!;
  }

  public async deleteMany(where: {
    [key in keyof T]?: T[key];
  }): Promise<Document<T>[]> {
    const documents = this.documents.filter((document) => {
      for (const key in where) {
        if (document.data[key] !== where[key]) {
          return false;
        }
      }
      return true;
    });
    if (!documents) {
      throw new Error("Document not found");
    }
    this.documents = this.documents.filter(
      (document) => !documents.includes(document)
    );
    this.save();
    return documents;
  }

  public count = (): number => this.documents.length;

  public async drop(): Promise<void> {
    this.documents = [];
    this.save();
  }
}
