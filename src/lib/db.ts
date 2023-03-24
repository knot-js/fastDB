import fs from "fs";
import path from "path";
import { Document } from "@lib/document";
export class FastDB {
  public name: string = "";
  public dbPath: string = "";

  public init = async (name: string, dbPath: string) => {
    if (!name) throw new Error("Database name is required");
    if (!dbPath) throw new Error("Database path is required");

    this.name = name;
    this.dbPath = dbPath;
    try {
      await fs.promises.mkdir(dbPath);
    } catch (err: any) {
      if (err.code !== "EEXIST") {
        new Error(err);
      }
    }
  };

  public get = async <T>(collectionName: string): Promise<Document<T>[]> => {
    const collectionPath = path.join(
      this.dbPath,
      collectionName,
      `${collectionName}.json`
    );
    const collection = await fs.promises.readFile(collectionPath);
    return JSON.parse(collection.toString());
  };

  public save = async <T>(
    collectionName: string,
    documents: Document<T>[]
  ): Promise<void> => {
    const collectionPath = path.join(
      this.dbPath,
      collectionName,
      `${collectionName}.json`
    );
    const collection = JSON.stringify(documents);

    try {
      await fs.promises.writeFile(collectionPath, collection);
    } catch (err: any) {
      new Error(err);
    }
  };
}

const fastDb = new FastDB();

export default fastDb;
