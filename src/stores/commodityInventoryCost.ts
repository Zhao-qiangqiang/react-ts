import { createStore } from '@souche-f2e/muji';
import { BSearchForm, BAll, BFilterForm } from '@/shared/types';
import { Toast } from 'so-ui-react';
import {
  queryStockList,
  getBasValueByBasCategoryNo,
  listCustomerNonsortByCondition,
  queryStockListWhenAdd,
  getDepartmentByShopCode,
  stockOutCostAdjust,
  stockInCostAdjust,
  querySupplierUnify,
  getStockMstrInfo,
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
const inititalState: BAll = {
  searchForm: {
    page: 1,
    pageSize: 50,
    goodsNo: '',
    goodsName: '',
    costDomainCode: '',
    goodsCategoryList: [],
    stockGoodsTypeCode: '',
  },
  opreateSearchForm: initeOpreateSearchForm,
  filtersForm: {
    goodsNo: '',
    costDomainCode: '',
    stockGoodsTypeCode: '',
    stockTypeCode: '',
    goodsCategoryList: [],
    noGoodsCostDoMainList: [],
    page: 1,
    pageSize: 10,
  },
  dataSource: [],
  totalNumber: 0,
  totals: 0,
  isQueryLoading: false,
  isSearchLoadings: false,
  isChangesLoading: false,
  isShowModals: false,
  businessAjustmentList: [],
  wareHouseLists: [],
  cusNoList: [],
  goodsL1List: [],
  goodsL2List: [],
  goodsL3List: [],
  supplierList: [],
  departmentList: [],
  detList: [], // 带过来的数据
  dotLists: [], // 弹框的车辆列表
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
    async queryDataList(payload: BSearchForm) {
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
    // 商品类别
    async getStockMstrInfo(payload: any) {
      try {
        const result = await getStockMstrInfo(payload);
        console.log(result);
        if (payload.levelOneCategoryId === '' && payload.levelSecondCategoryId === '') {
            this.SAVE({
                goodsL1List: result.levelOneCategoryList,
            });
        }
        if (payload.levelOneCategoryId !== '' && payload.levelSecondCategoryId === '') {
            this.SAVE({
                goodsL2List: result.levelSecondCategoryList,
            });
        }
        if (payload.levelOneCategoryId !== '' && payload.levelSecondCategoryId !== '') {
            this.SAVE({
                goodsL3List: result.levelThreeCategoryList,
            });
        }
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
          wareHouseLists: result,
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
    async getCarList(payload: BFilterForm) {
      console.log(payload);
      this.SAVE({
        isSearchLoadings: true,
        dotLists: [],
        totals: 0,
      });
      try {
        const result = await queryStockListWhenAdd(payload);
        const { list, total } = result;
        this.SAVE({
          dotLists: list,
          isSearchLoadings: false,
          totals:total,
          filtersForm:payload
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 出库成本调整
    async stockOutCostAdjust(payload: any) {
      console.log(payload);
      this.SAVE({
        isChangesLoading: true,
      });
      try {
        await stockOutCostAdjust(payload);
        this.SAVE({
          isChangesLoading: false,
          totalAmount:0,
        });
        Toast['success']({
          message: '调整成功,1s后将离开此页面',
          duration: 1000,
        });
        return true;
      } catch (error) {
        this.SAVE({
          isChangesLoading: false,
        });
        console.log(error);
        return false;
      }
    },
    // 入库成本调整
    async stockInCostAdjust(payload: any) {
      console.log(payload);
      this.SAVE({
        isChangesLoading: true,
      });
      try {
        const result = await stockInCostAdjust(payload);
        console.log(result);
        this.SAVE({
          isChangesLoading: false,
          totalAmount:0,
        });
        Toast['success']({
          message: '调整成功,1s后将离开此页面',
          duration: 1000,
        });
        return true;
      } catch (error) {
        this.SAVE({
          isChangesLoading: false,
        });
        return false;
        console.log(error);
      }
    },
  },
});
