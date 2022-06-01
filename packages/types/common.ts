import { match, RouteComponentProps } from 'react-router';

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

export type PageProps = {
  match: match<{ ns?: string; name?: string }>;
};

export type PagePropsRoute = {
  match: RouteComponentProps<{ resourceName: string; plural: string }>['match'];
};
