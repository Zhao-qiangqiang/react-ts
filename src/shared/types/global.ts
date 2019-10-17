import { Route } from '@souche-f2e/muji-router';
export type IGlobal = {
  router: IRouter;
  currentRoute: Route;
};

export type IRouter = {
  options: IRouterOptions;
};

export type IRouterOptions = { routes: IRoute[] };

export type IRoute = {
  children?: IRoute[];
  component?: React.ReactNode;
  path: string;
  name?: string;
};

export type IHash<T> = {
  [key: string]: T;
};

export type IBreadcrumbLinkMap = IHash<() => void>;

export type IStateMap<T> = Partial<{ [key in keyof T]: T[key] }>;

export type IValidatorMap<T> = Partial<{ [key in keyof T]: any }>;

export type ValueOf<T> = T[keyof T];

export type IPaginationInfo = Partial<{
  currentIndex: number;
  pageSize: number;
  totalNumber: number;
  totalPage: number;
}>;

export type IFormValueChangeFunc<T> = (
  map: IStateMap<T>,
  options?: any,
) => void;

export type IListPage<T> = {
  searchConditions: T;
  listPageTableDataSource: any[];
  listPagePaginationInfo: IPaginationInfo;
};

export type IUiState = {
  isTableLoading?: boolean;
  isSubmitLoading?: boolean;
  isCheckModalLoading?: boolean;
};

export type IVaildator = {
  errInfo: string[];
  rules: IRules[];
};

export type IRules = {
  method: (...args: any[]) => boolean;
  errMsg: string | IFunc;
};

export type IFunc = (...args: any[]) => any;
export type IHighOrderFunc = (...args: any[]) => (...args: any[]) => any;

export type IOperateOrderActionMap = {
  [key: string]: { actionName: string; action: IFunc };
};
