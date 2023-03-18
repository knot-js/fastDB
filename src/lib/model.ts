interface Config<T> {
  defaultValue: T;
  validator?: (val: T) => boolean;
}

type Structure<T> = {
  [P in keyof T]: Config<T[P]>;
};

export class Model<T> {
  constructor(private structure: Structure<T>) {}

  public create(data: Partial<T>): T {
    const result = {} as T;
    for (const key in this.structure) {
      if (this.structure.hasOwnProperty(key)) {
        const config = this.structure[key];
        if (config.validator && data[key] && !config.validator(data[key]!)) {
          throw new Error(`Invalid value for ${key}`);
        }
        result[key] = data[key] || config.defaultValue;
      }
    }
    return result;
  }
}

interface Student {
  name: string;
  age: number;
  rollNo: number;
}

const student = new Model<Student>({
  name: {
    defaultValue: "John",
  },
  age: {
    defaultValue: 18,
    validator: (val) => val > 5,
  },
  rollNo: {
    defaultValue: 1,
  },
});
