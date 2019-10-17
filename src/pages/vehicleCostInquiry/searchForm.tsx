import React, { ReactNode } from 'react';
import { connect } from '@souche-f2e/muji';
import { DatePicker, LocaleProvider } from 'antd';
import { SearchFormRender, SoCarPicker } from '@/components';
import { Select, Input } from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import { CSearchForm } from '@/shared/types';
import { getTwoLevel } from '@/shared/utils';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';

const mapStateToProps = (rootState: IRootState) => {
  return {
    vehicleCostInquiry: rootState.vehicleCostInquiry,
    auth: rootState.auth,
  };
};
type IProps = {} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: CSearchForm;
  defaultValueList: [];
  dateRange: [];
};

const iniateForm = {
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
  cusOrSupplierId: '',
  deptId: '',
  stockNo: '',
};

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(mapStateToProps)
class SearchForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchForm: iniateForm,
      defaultValueList: [],
      dateRange: [],
    };
  }
  componentDidMount = () => {
    dispatch.vehicleCostInquiry.getDepartmentList();
    this.queryData();
  }
  queryData = () => {
    const { searchForm } = this.state;
    const newForm = {
      ...searchForm,
      page: 1,
      stockGoodsTypeCode: '10800000',
    };
    console.log(newForm);
    dispatch.vehicleCostInquiry.queryDataList(newForm);
  }
  typeChange = (value: any) => {
    const { auth } = this.props;
    const obj: any = {
      tentantId: auth.tentantId,
      orgId: auth.orgId,
      groupInterCustomer: '1',
      keyWord: value,
      tentAndOrg: '1',
    };
    dispatch.vehicleCostInquiry.getsupplierAndcusNoList(obj);
  }
  disabledDate = (current?: any) => {
    return current && current > moment().endOf('day');
  }
  selectChange = (type: string, value: any, Option: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    switch (type) {
      case 'stockTypeCode':
        obj.stockTypeCode = value;
        break;
      case 'cusOrSupplierName':
        obj.cusOrSupplierName = Option ? Option.props.label : '';
        obj.cusOrSupplierId = value;
        break;
      case 'deptName':
        obj.deptName = Option ? Option.props.label : '';
        obj.deptId = value;
        break;
      default:
        break;
    }
    this.setState({
      searchForm: {
        ...searchForm,
        ...obj,
      },
    });
  }
  onCarChange = (...args: any) => {
    const { searchForm } = this.state;
    const obj = { ...args };
    const valueListTree = obj[1].valueListTree;
    const carTypeListBack: any[] = [];
    const carDataVos: any[] = [];
    if (
      valueListTree &&
      valueListTree.length > 0 &&
      obj[0] &&
      obj[0].length > 0
    ) {
      valueListTree.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
          getTwoLevel(item, item.children, carTypeListBack);
        } else {
          carDataVos.push({
            goodsL1CategoryCode: item.value,
          });
        }
      });
      const tempArr: any[] = [];
      if (carTypeListBack.length > 0) {
        carTypeListBack.forEach((item: any) => {
          const tempObj = {
            goodsL1CategoryCode: item.carBrandId,
            goodsL2CategoryCode: item.carSeriesId,
            goodsL3CategoryCode: item.carCategoryCode,
            goodsL4CategoryCode: item.carModelId,
          };
          tempArr.push(tempObj);
        });
      }
      const data = {
        ...searchForm,
        goodsCategoryList: carDataVos.concat(tempArr),
      };
      this.setState({
        searchForm: data,
        defaultValueList: obj[0],
      });
    } else {
      const data = {
        ...searchForm,
        goodsCategoryList: [],
      };
      this.setState({
        searchForm: data,
        defaultValueList: [],
      });
    }
  }
  inputChange = (type:string, value: string) => {
    const { searchForm } = this.state;
    const obj:any = {};
    obj[type] = value;
    this.setState({
      searchForm: {
        ...searchForm,
        ...obj
      },
    });
  }
  reset = () => {
    this.setState(
      {
        searchForm: iniateForm,
        defaultValueList: [],
        dateRange: [],
      },
      () => {
        this.queryData();
      }
    );
  }
  dateChange = (date: any) => {
    const { searchForm } = this.state;
    console.log(date);
    const obj = {
      ...searchForm,
      stockStartDate: date.length > 0 ? moment(date[0]).format('YYYY-MM-DD') : '',
      stockEndDate: date.length > 0 ? moment(date[1]).format('YYYY-MM-DD') : '',
    };
    this.setState({
      dateRange: date ? date : [],
      searchForm: obj,
    });
  }
  render() {
    const {
      searchForm: { goodsNo, stockTypeCode, cusOrSupplierId, deptId, stockNo },
      defaultValueList,
      dateRange,
    } = this.state;
    const {
      vehicleCostInquiry: {
        isQueryLoading,
        departmentList,
        cusNoAndsupplierList,
      },
    } = this.props;
    const department =
      Array.isArray(departmentList) && departmentList.length > 0
        ? departmentList.map((item: any, index: number) => {
            return <Option key={index} label={item.deptName} value={item.id} />;
          })
        : null;
    const cusNoAndsupplier =
      Array.isArray(cusNoAndsupplierList) && cusNoAndsupplierList.length > 0
        ? cusNoAndsupplierList.map((item: any, index: number) => {
            return <Option key={index} label={item.label} value={item.value} />;
          })
        : null;
    const renderSearchForm: ReactNode = SearchFormRender([
      {
        span: '成本调整类型',
        component: (
          <Select style={{ width: '100%' }} value={stockTypeCode} clearable={true} onChange={this.selectChange.bind(this, 'stockTypeCode')}>
            <Option key={1} label={'整车出库调整'} value={'10750010'} />
            <Option key={2} label={'整车入库调整'} value={'10650005'} />
        </Select>
        ),
      },
      {
        span: '调整时间',
        component: (
          <LocaleProvider locale={zh_CN}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              format='YYYY-MM-DD'
              style={{ width: '100%' }}
              onChange={this.dateChange}
              disabledDate={this.disabledDate}
              value={dateRange}
            />
          </LocaleProvider>
        ),
      },
      {
        span: '车架号',
        component: (
          <Input
            style={{ width: '100%' }}
            value={goodsNo}
            onChange={this.inputChange.bind(this, 'goodsNo')}
          />
        ),
      },
      {
        span: '车型',
        component: (
          <SoCarPicker
            allowClear
            multiple
            showCheckedStrategy={'SHOW_PARENT'}
            level={4}
            onChange={this.onCarChange}
            showAll={false}
            style={{ width: '100%', maxHeight:'80px', overflow: 'auto' }}
            value={defaultValueList}
          />
        ),
      },
      {
        span: '客商',
        component: (
          <Select
            style={{ width: '100%' }}
            value={cusOrSupplierId}
            clearable={true}
            onType={this.typeChange}
            filterable={true}
            onChange={this.selectChange.bind(this, 'cusOrSupplierName')}
          >
            {cusNoAndsupplier}
          </Select>
        ),
      },
      {
        span: '部门',
        component: (
          <Select
            style={{ width: '100%' }}
            onChange={this.selectChange.bind(this, 'deptName')}
            value={deptId}
            clearable={true}
          >
            {department}
          </Select>
        ),
      },
      {
        span: '成本调整单号',
        component: (
          <Input
            style={{ width: '100%' }}
            value={stockNo}
            onChange={this.inputChange.bind(this, 'stockNo')}
          />
        ),
      },
    ])(this.reset)(this.queryData)(isQueryLoading)([]);
    return (
      <div>
        <div>{renderSearchForm}</div>
      </div>
    );
  }
}
export default SearchForm;
