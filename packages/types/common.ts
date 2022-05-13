export type HumanizeResult = {
  value: number;
  unit: string;
  string: string;
};

export type RowFunctionArgs<T = any, C = any> = {
  obj: T;
  columns: any[];
  customData?: C;
};

export type Patch = {
  op: string;
  path: string;
  value?: any;
};
