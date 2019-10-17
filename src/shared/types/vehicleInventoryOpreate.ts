export type ASearchForm = {
  goodsNo?: any;
  costDomainCode?: string;
  goodsCategoryList?: any[];
  stockGoodsTypeCode: string | undefined;
  page: number;
  pageSize: number;
};

export type AFilterForm = {
  goodsNo?: string;
  costDomainCode?: string;
  stockGoodsTypeCode: string | undefined;
  stockTypeCode: string | undefined;
  goodsCategoryList?: any[];
  noVinList?: any[];
  page: number;
  pageSize: number;
};

export type AAll = {
  searchForm: ASearchForm;
  opreateSearchForm: any;
  filterForm:AFilterForm;
  dataSource: any[];
  totalNumber: number;
  total: number;
  isQueryLoading: boolean;
  isSearchLoading: boolean;
  isChangeLoading: boolean;
  isShowModal: boolean;
  wareHouseList: any[];
  departmentList: any[];
  businessAjustmentList: any[];
  cusNoList: any[];
  supplierList: any[];
  detList: any[];
  dotList: any[];
  totalAmount:number;
};
