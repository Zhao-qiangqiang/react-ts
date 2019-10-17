export type DSearchForm = {
  goodsNo?: string;
  goodsName?: string;
  cusOrSupplierName?: string;
  stockStartDate?: string;
  stockEndDate?: string;
  costDomainCode?: string;
  deptName?: string;
  stockNo?: string;
  cusOrSupplierId?:string,
  deptId?: string;
  stockTypeCode?: string;
  goodsCategoryList?: any[];
  stockGoodsTypeCode: string | undefined;
  page: number;
  pageSize: number;
};

export type DAll = {
  searchForm: DSearchForm;
  dataSource: any[];
  totalNumber: number;
  isQueryLoading: boolean;
  cusNoAndsupplierList: any[];
  departmentList: any[];
  wareHouseList: any[];
};
