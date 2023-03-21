export interface Where<T> {
  field: keyof T;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "nin"
    | "contains"
    | "ncontains";
  value: T[keyof T];
}
