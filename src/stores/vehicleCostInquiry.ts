import { createStore } from '@souche-f2e/muji';
import { CSearchForm, CAll } from '@/shared/types';
import {
  listCustomerNonsortByCondition,
  getDepartmentByShopCode,
  querySupplierUnify,
  listStockCostAdjust,
} from '@/services';

const inititalState: CAll = {
  searchForm: {
    page: 1,
    pageSize: 50,
    goodsNo: '',
    stockGoodsTypeCode: '',
    stockTypeCode: '',
    goodsCategoryList: [],
    cusOrSupplierName: '',
    stockStartDate: '',
    stockEndDate: '',
    deptName: '',
    stockNo:'',
    cusOrSupplierId: '',
    deptId: '',
  },
  dataSource: [],
  businessAjustmentList: [],
  cusNoAndsupplierList: [],
  departmentList: [],
  totalNumber: 0,
  isQueryLoading: false,
};
export default createStore({
  state: inititalState,
  reducers: {
    SAVE(state: any, payload: any) {
      return {
        ...state,
        ...payload,
      };
    },
    RESET(state: any, payload: { key: string }) {
      return {
        ...state,
      };
    },
  },
  effects: {
    async queryDataList(payload: CSearchForm) {
      this.SAVE({
        dataSource:[],
        totalNumber:0,
        isQueryLoading:true
      });
      try {
        const result = await listStockCostAdjust(payload);
        const { list, total } = result;
        this.SAVE({
          dataSource: list,
          totalNumber:total,
          searchForm:payload,
          isQueryLoading:false
        });
      } catch (error) {
        this.SAVE({
          sQueryLoading:false
        });
        console.log(error);
      }
    },
    // 客户，供应商列表
    async getsupplierAndcusNoList(payload: any) {
      try {
        const results = await querySupplierUnify(payload);
        const result = await listCustomerNonsortByCondition(payload);
        const arr: any[] = [];
        if (Array.isArray(results) && results.length > 0) {
          results.forEach((item: any) => {
            const obj = {
              value: item.supplierCode,
              label: item.supplierName,
            };
            arr.push(obj);
          });
        }
        if (Array.isArray(results) && results.length > 0) {
          result.forEach((item: any) => {
            const obj = {
              value: item.cusId,
              label: item.cusName,
            };
            arr.push(obj);
          });
        }
        this.SAVE({
          cusNoAndsupplierList: arr,
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 部门列表
    async getDepartmentList() {
      try {
        const result = await getDepartmentByShopCode();
        this.SAVE({
          departmentList: result,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
