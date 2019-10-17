export type CSearchForm = {
  goodsNo?: string;
  cusOrSupplierName?: string;
  stockStartDate?: string;
  stockEndDate?: string;
  deptName?: string;
  cusOrSupplierId?: string;
  stockNo?: string;
  deptId?: string;
  stockTypeCode?: string;
  goodsCategoryList?: any[];
  stockGoodsTypeCode: string | undefined;
  page: number;
  pageSize: number;
};

export type CAll = {
  searchForm: CSearchForm;
  dataSource: any[];
  totalNumber: number;
  isQueryLoading: boolean;
  cusNoAndsupplierList:any[],
  departmentList:any[],
  businessAjustmentList:any[]
};
