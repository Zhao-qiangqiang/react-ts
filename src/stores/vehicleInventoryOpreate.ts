import { createStore } from '@souche-f2e/muji';
import { Toast } from 'so-ui-react';
import {
  AAll,
  ASearchForm,
  AFilterForm,
} from '@/shared/types';
import {
  queryStockList,
  getBasValueByBasCategoryNo,
  listCustomerNonsortByCondition,
  queryStockListWhenAdd,
  getDepartmentByShopCode,
  stockOutCostAdjust,
  stockInCostAdjust,
  querySupplierUnify,
  getDicDataByCategoryCode
} from '@/services';

const initeOpreateSearchForm = {
  bizOrderTypeId: '',
  bizOrderTypeCode: '',
  bizOrderTypeName: '',
  deptId: '',
  deptName: '',
  dets: [],
  stockGoodsTypeCode: '',
};
const inititalState: AAll = {
  searchForm: {
    page: 1,
    pageSize: 50,
    goodsNo: '',
    costDomainCode: '',
    goodsCategoryList: [],
    stockGoodsTypeCode: '',
  },
  opreateSearchForm: initeOpreateSearchForm,
  filterForm: {
    goodsNo: '',
    costDomainCode: '',
    stockGoodsTypeCode: '',
    stockTypeCode: '',
    goodsCategoryList: [],
    noVinList: [],
    page: 1,
    pageSize: 10,
  },
  dataSource: [],
  totalNumber: 0,
  total: 0,
  isQueryLoading: false,
  isSearchLoading: false,
  isChangeLoading: false,
  isShowModal: false,
  businessAjustmentList: [],
  wareHouseList: [],
  cusNoList: [],
  supplierList: [],
  departmentList: [],
  detList: [], // 带过来的数据
  dotList: [], // 弹框的车辆列表
  totalAmount: 0,
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
    // 查询成本
    async queryDataList(payload: ASearchForm) {
      console.log(payload);
      this.SAVE({
        isQueryLoading: true,
        dataSource: [],
        totalNumber: 0,
      });
      try {
        const result = await queryStockList(payload);
        const { list, total } = result;
        this.SAVE({
          dataSource: list,
          isQueryLoading: false,
          searchForm: payload,
          totalNumber: total,
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 成本域
    async getwareHouseList() {
      try {
        const result = await getBasValueByBasCategoryNo({
          categoryNo: 'MD1000',
        });
        this.SAVE({
          wareHouseList: result,
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 业务类型
    async getbusinessAjustmentList() {
      try {
        const result = await getDicDataByCategoryCode({
          code: '4180',
        });
        this.SAVE({
          businessAjustmentList: result,
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 客户列表
    async getcusNoList(payload: any) {
      try {
        const result = await listCustomerNonsortByCondition(payload);
        this.SAVE({
          cusNoList: result,
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 供应商列表
    async getsupplierList(payload: any) {
      try {
        const result = await querySupplierUnify(payload);
        this.SAVE({
          supplierList: result,
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
    // 获取弹框成本列表
    async getCarList(payload: AFilterForm) {
      console.log(payload);
      this.SAVE({
        isSearchLoading: true,
        dotList: [],
        total: 0,
      });
      try {
        const result = await queryStockListWhenAdd(payload);
        const { list, total } = result;
        this.SAVE({
          dotList: list,
          isSearchLoading: false,
          total,
          filterForm:payload
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 出库成本调整
    async stockOutCostAdjust(payload: any) {
      console.log(payload);
      this.SAVE({
        isChangeLoading: true,
      });
      try {
        const result = await stockOutCostAdjust(payload);
        console.log(result);
        this.SAVE({
          isChangeLoading: false,
          totalAmount:0,
        });
        Toast['success']({
          message: '调整成功,1s后将离开此页面',
          duration: 1000,
        });
        return true;
      } catch (error) {
        this.SAVE({
          isChangeLoading: false,
        });
        console.log(error);
        return false;
      }
    },
    // 入库成本调整
    async stockInCostAdjust(payload: any) {
      console.log(payload);
      this.SAVE({
        isChangeLoading: true,
      });
      try {
        const result = await stockInCostAdjust(payload);
        console.log(result);
        this.SAVE({
          isChangeLoading: false,
          totalAmount:0,
        });
        Toast['success']({
          message: '调整成功,1s后将离开此页面',
          duration: 1000,
        });
        return true;
      } catch (error) {
        this.SAVE({
          isChangeLoading: false,
        });
        console.log(error);
        return false;
      }
    },
  },
});
