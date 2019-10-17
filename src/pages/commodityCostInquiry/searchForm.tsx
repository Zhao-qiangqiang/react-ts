import React from 'react';
import { DatePicker, LocaleProvider } from 'antd';
import { connect } from '@souche-f2e/muji';
import { CommodityLevelFour } from '@/components';
import { Select, Input, Row, Col, Button, Icon } from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import { DSearchForm } from '@/shared/types';
import { getSecondLevel } from '@/shared/utils';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import styles from '@/config/styles.less';

const mapStateToProps = (rootState: IRootState) => {
  return {
    commodityCostInquiry: rootState.commodityCostInquiry,
    auth: rootState.auth,
  };
};
type IProps = {} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: DSearchForm;
  defaultValueList: any[];
  dateRange: any[];
  isShowMore: boolean;
};

const iniateForm = {
  page: 1,
  pageSize: 50,
  goodsNo: '',
  goodsName: '',
  costDomainCode: '',
  stockGoodsTypeCode: '',
  stockTypeCode: '',
  goodsCategoryList: [],
  cusOrSupplierName: '',
  cusOrSupplierId: '',
  stockStartDate: '',
  stockEndDate: '',
  deptName: '',
  deptId: '',
  stockNo:''
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
      isShowMore: false,
    };
  }
  componentDidMount = () => {
    dispatch.commodityCostInquiry.getDepartmentList();
    dispatch.commodityCostInquiry.getwareHouseList();
    this.queryData();
  }
  disabledDate = (current?: any) => {
    return current && current > moment().endOf('day');
  }
  queryData = () => {
    const { searchForm } = this.state;
    const newForm = {
      ...searchForm,
      page: 1,
      stockGoodsTypeCode: '10800005',
    };
    console.log(newForm);
    dispatch.commodityCostInquiry.queryDataList(newForm);
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
    dispatch.commodityCostInquiry.getsupplierAndcusNoList(obj);
  }
  selectChange = (type: string, value: any, Option: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    switch (type) {
      case 'stockTypeCode':
        obj.stockTypeCode = value;
        break;
      case 'costDomainCode':
        obj.costDomainCode = value;
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
    const newForm = {
        ...searchForm,
        ...obj,
    };
    this.setState({
      searchForm: newForm,
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
          getSecondLevel(item, item.children, carTypeListBack);
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
  inputChange = (type: string, value: any) => {
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
  toggleShow = () => {
    this.setState({
      isShowMore: !this.state.isShowMore,
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
      stockStartDate:
        date.length > 0 ? moment(date[0]).format('YYYY-MM-DD') : '',
      stockEndDate: date.length > 0 ? moment(date[1]).format('YYYY-MM-DD') : '',
    };
    this.setState({
      dateRange: date ? date : [],
      searchForm: obj,
    });
  }
  render() {
    const {
      searchForm: {
        goodsNo,
        goodsName,
        stockTypeCode,
        costDomainCode,
        cusOrSupplierId,
        deptId,
        stockNo
      },
      defaultValueList,
      dateRange,
      isShowMore,
    } = this.state;
    const {
      commodityCostInquiry: {
        isQueryLoading,
        departmentList,
        cusNoAndsupplierList,
        wareHouseList,
      },
    } = this.props;
    const wareHouse =
      Array.isArray(wareHouseList) && wareHouseList.length > 0
        ? wareHouseList.map((item: any, index: number) => {
            return (
              <Option key={item.id} label={item.basText} value={item.basCode} />
            );
          })
        : null;
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
    return (
      <div>
        <div className={styles.back}>
          <Row gutter={12} className={styles.ro}>
            <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>成本调整类型</span>
                <Select
                  style={{ width: '100%' }}
                  value={stockTypeCode}
                  onChange={this.selectChange.bind(this, 'stockTypeCode')}
                  clearable={true}
                >
                  <Option key={1} label={'商品出库调整'} value={'10750010'} />
                  <Option key={2} label={'商品入库调整'} value={'10650005'} />
                </Select>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>调整时间</span>
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
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>商品编码</span>
                <Input
                  style={{ width: '100%' }}
                  value={goodsNo}
                  onChange={this.inputChange.bind(this, 'goodsNo')}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={12} className={styles.ro}>
            <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>商品名称</span>
                <Input
                  style={{ width: '100%' }}
                  value={goodsName}
                  onChange={this.inputChange.bind(this, 'goodsName')}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>商品类别</span>
                <CommodityLevelFour
                  allowClear
                  multiple
                  level={4}
                  showCheckedStrategy={'SHOW_PARENT'}
                  onChange={this.onCarChange}
                  showAll={false}
                  style={{ width: '100%', maxHeight:'80px', overflow: 'auto' }}
                  value={defaultValueList}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>成本域</span>
                <Select
                  style={{ width: '100%' }}
                  value={costDomainCode}
                  onChange={this.selectChange.bind(this, 'costDomainCode')}
                  clearable={true}
                >
                  {wareHouse}
                </Select>
              </div>
            </Col>
          </Row>
          <div style={{ display: isShowMore ? 'block' : 'none' }}>
            <Row gutter={12} className={styles.ro}>
              <Col span={8}>
                <div className={styles.flexWhite}>
                  <span className={styles.sp}>客商</span>
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
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.flexWhite}>
                  <span className={styles.sp}>部门</span>
                  <Select
                    style={{ width: '100%' }}
                    onChange={this.selectChange.bind(this, 'deptName')}
                    value={deptId}
                    clearable={true}
                  >
                    {department}
                  </Select>
                </div>
              </Col>
              <Col span={8}>
              <div className={styles.flexWhite}>
                <span className={styles.sp}>成本调整单号</span>
                <Input
                  style={{ width: '100%' }}
                  value={stockNo}
                  onChange={this.inputChange.bind(this, 'stockNo')}
                />
              </div>
            </Col>
            </Row>
          </div>
          <div style={{ color: 'rgb(77, 166, 255)', display:'inline-block' }} onClick={this.toggleShow}>
            <span>更多筛选条件</span>
            <Icon name={isShowMore ? 'arrow-up' : 'arrow-down'} />
          </div>
          <div className={styles.searc}>
            <Button
              type='primary'
              loading={isQueryLoading}
              onClick={this.queryData}
            >
              查询
            </Button>
            <Button style={{ marginRight: '12px' }} onClick={this.reset}>
              重置
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchForm;
