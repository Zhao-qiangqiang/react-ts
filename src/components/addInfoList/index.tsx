import React from 'react';
import {
  Loading,
  Table,
  Pagination,
  Button,
  Modal,
  Input,
  Select,
  Row,
  Col,
  Toast,
} from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import { connect } from '@souche-f2e/muji';
import { SoCarPicker, CommodityLevelFour } from '@/components';
import { getTwoLevel } from '@/shared/utils';
import styles from '@/config/styles.less';
import console = require('console');
type IProps = {
  dataSource?: any;
  columns?: any;
  type: any;
  currentRoute: IRootState;
} & ReturnType<typeof mapStateToProps>;

type IState = {
  searchForm: any;
  defaultValueList: any[];
  currentRowKey: any[];
  isDisabled: boolean;
  sureModal: boolean;
  addSureLoading: boolean;
};

const initeSearch = {
  page: 1,
  pageSize: 10,
  goodsNo: '',
  costDomainCode: '',
  goodsCategoryList: [],
};

const mapStateToProps = (rootState: IRootState) => {
  return {
    auth: rootState.auth,
    vehicleInventoryOpreate: rootState.vehicleInventoryOpreate,
    commodityInventoryCost: rootState.commodityInventoryCost,
    currentRoute: rootState.router,
  };
};

const { Option } = Select;
@connect(mapStateToProps)
class AddInfoList extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchForm: initeSearch,
      defaultValueList: [],
      currentRowKey: [],
      isDisabled: true,
      sureModal: false,
      addSureLoading: false,
    };
  }
  componentDidMount() {
    this.initeForm();
  }

  // 初始化
  initeForm = () => {
    this.setState({
      searchForm: initeSearch,
      defaultValueList: [],
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
      valueListTree.forEach((item: any, index: number) => {
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
  selectChange = (value: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    obj.costDomainCode = value;
    const newForm = {
      ...searchForm,
      ...obj,
    };
    this.setState({
      searchForm: newForm,
    });
  }
  onCancel = () => {
    const { type } = this.props;
    if (type === 'vehicleOut' || type === 'vehicleIn') {
      dispatch.vehicleInventoryOpreate.SAVE({
        isShowModal: false,
      });
    } else {
      dispatch.commodityInventoryCost.SAVE({
        isShowModals: false,
      });
    }
    this.initeForm();
  }
  inputChange = (value: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    obj.goodsNo = value;
    const newForm = {
      ...searchForm,
      ...obj,
    };
    this.setState({
      searchForm: newForm,
    });
  }
  searchCarList = () => {
    const {
      type,
      vehicleInventoryOpreate: { filterForm },
      commodityInventoryCost: { filtersForm },
    } = this.props;
    const { searchForm } = this.state;
    if (type === 'vehicleOut' || type === 'vehicleIn') {
      const obj = {
        ...filterForm,
        ...searchForm,
      };
      dispatch.vehicleInventoryOpreate.getCarList(obj);
    } else {
      console.log(filtersForm, 'filtersForm');
      const obj = {
        ...filtersForm,
        ...searchForm,
      };
      dispatch.commodityInventoryCost.getCarList(obj);
    }
  }
  addCarList = () => {
    this.setState({
      sureModal: true,
    });
  }
  sureAddCar = () => {
    const { currentRowKey, searchForm } = this.state;
    const { type } = this.props;

    this.setState({
      addSureLoading: true,
    });
    if (type === 'vehicleOut' || type === 'vehicleIn') {
      const {
        vehicleInventoryOpreate: { detList, isSearchLoading },
      } = this.props;
      const tempArr: any[] = [];
      const arr: any[] = [];
      const tempObj: any = {
        stockGoodsTypeCode: '10800000',
        stockTypeCode: type === 'vehicleOut' ? '10750010' : '10650005',
      };
      detList.concat(currentRowKey).forEach((item: any) => {
        const obj = {
          ...item,
          adjustAmount: '',
          frontAmount: item.amount,
          frontQty: item.qty,
          behindAmount: item.amount,
        };
        tempArr.push(obj);
      });
      dispatch.vehicleInventoryOpreate.SAVE({
        detList: tempArr,
        totalAmount: 0,
      });
      tempArr.forEach((item: any) => {
        arr.push(item.goodsNo);
      });
      const newForm = {
        ...searchForm,
        noVinList: arr,
        page: 1,
        ...tempObj,
      };
      dispatch.vehicleInventoryOpreate.getCarList(newForm).then(() => {
        if (!isSearchLoading) {
          Toast['success']({
            message: '添加成功',
            duration: 1000,
          });
        }
      });
    } else {
      const {
        commodityInventoryCost: { detList, isSearchLoadings },
      } = this.props;
      const tempArr: any[] = [];
      const arr: any[] = [];
      const tempObj: any = {
        stockGoodsTypeCode: '10800005',
        stockTypeCode: type === 'commodityOut' ? '10750010' : '10650005',
      };
      detList.concat(currentRowKey).forEach((item: any) => {
        const obj = {
          ...item,
          adjustAmount: '',
          frontAmount: item.amount,
          frontQty: item.qty,
          behindAmount: item.amount,
        };
        tempArr.push(obj);
      });
      dispatch.commodityInventoryCost.SAVE({
        detList: tempArr,
        totalAmount: 0,
      });
      tempArr.forEach((item: any) => {
        const obq = {
          goodsNo: item.goodsNo,
          costDomainCode: item.costDomainNo,
        };
        arr.push(obq);
      });
      const newForm = {
        ...searchForm,
        noGoodsCostDoMainList: arr,
        page: 1,
        ...tempObj,
      };
      dispatch.commodityInventoryCost.getCarList(newForm).then(() => {
        if (!isSearchLoadings) {
          Toast['success']({
            message: '添加成功',
            duration: 1000,
          });
        }
      });
    }
    this.setState({
      addSureLoading: false,
      sureModal: false,
      searchForm: initeSearch,
      defaultValueList: [],
      currentRowKey:[],
      isDisabled:true
    });
  }
  onCurrentChange = (page: number) => {
    const { type } = this.props;
    const { searchForm } = this.state;
    if (type === 'vehicleOut' || type === 'vehicleIn') {
      const filter = this.props.vehicleInventoryOpreate.filterForm;
      const newForm = {
        ...filter,
        ...searchForm,
        page,
      };
      dispatch.vehicleInventoryOpreate.getCarList(newForm);
    } else {
      const filter = this.props.commodityInventoryCost.filtersForm;
      const newForm = {
        ...filter,
        ...searchForm,
        page,
      };
      dispatch.commodityInventoryCost.getCarList(newForm);
    }
    this.setState({
      searchForm: {
        ...searchForm,
        page,
      },
    });
  }
  onSelectChange = (selection: any) => {
    const { searchForm } = this.state;
    console.log(selection);
    if (Array.isArray(selection) && selection.length > 0) {
      const arr: any[] = [];
      selection.forEach((item: any) => {
        arr.push(item.goodsNo);
      });
      const obj = {
        ...searchForm,
      };
      this.setState({
        currentRowKey: selection,
        searchForm: obj,
        isDisabled: false,
      });
    } else {
      const obj = {
        ...searchForm,
      };
      this.setState({
        currentRowKey: [],
        searchForm: obj,
        isDisabled: true,
      });
    }
  }
  render() {
    const {
      defaultValueList,
      searchForm: { page, pageSize, goodsNo, costDomainCode },
      isDisabled,
      sureModal,
      addSureLoading,
      currentRowKey
    } = this.state;
    const {
      vehicleInventoryOpreate: {
        wareHouseList,
        isShowModal,
        dotList,
        isSearchLoading,
        total,
      },
      commodityInventoryCost: {
        wareHouseLists,
        isShowModals,
        totals,
        isSearchLoadings,
        dotLists,
      },
      type,
    } = this.props;
    const isShow =
      type === 'vehicleOut' || type === 'vehicleIn'
        ? isShowModal
        : isShowModals;
    const totalNumber =
      type === 'vehicleOut' || type === 'vehicleIn' ? total : totals;
    const isLoading =
      type === 'vehicleOut' || type === 'vehicleIn'
        ? isSearchLoading
        : isSearchLoadings;
    const wares =
      type === 'vehicleOut' || type === 'vehicleIn'
        ? wareHouseList
        : wareHouseLists;
    const wareHouse =
      Array.isArray(wares) && wares.length > 0
        ? wares.map((item: any, index: number) => {
            return (
              <Option key={item.id} label={item.basText} value={item.basCode} />
            );
          })
        : null;
    const column = [
      {
        type: 'selection',
      },
      {
        label: '车架号',
        prop: 'goodsNo',
        key: 'goodsNo',
        width: '200px',
      },
      {
        label: '车型',
        prop: 'goodsL4CategoryName',
        key: 'goodsL4CategoryName',
      },
      {
        label: '成本域',
        prop: 'costDomainName',
        key: 'costDomainName',
        width: '100px',
      },
      {
        label: '成本金额',
        prop: 'amount',
        key: 'amount',
        width: '150px',
      },
    ];
    const columns = [
      {
        type: 'selection',
      },
      {
        label: '商品编码',
        prop: 'goodsNo',
        key: 'goodsNo',
        width: '200px',
      },
      {
        label: '商品名称',
        prop: 'goodsName',
        key: 'goodsName',
      },
      {
        label: '商品一级',
        prop: 'goodsL1CategoryName',
        key: 'goodsL1CategoryName',
        width: '100px',
      },
      {
        label: '商品二级',
        prop: 'goodsL2CategoryName',
        key: 'goodsL2CategoryName',
        width: '100px',
      },
      {
        label: '商品三级',
        prop: 'goodsL3CategoryName',
        key: 'goodsL3CategoryName',
        width: '100px',
      },
      {
        label: '商品四级',
        prop: 'goodsL4CategoryName',
        key: 'goodsL4CategoryName',
        width: '100px',
      },
      {
        label: '成本域',
        prop: 'costDomainName',
        key: 'costDomainName',
        width: '100px',
      },
      {
        label: '成本金额',
        prop: 'amount',
        key: 'amount',
        width: '150px',
      },
    ];
    return (
      <div>
        <Modal
          width={'80%'}
          title={
            type === 'vehicleOut' || type === 'vehicleIn'
              ? '添加车辆'
              : '添加商品'
          }
          visible={isShow}
          onCancel={this.onCancel}
          closeOnClickModal={false}
        >
          <Modal.Body>
            <div>
              <Row gutter={24}>
                <Col span={12}>
                  <div className={styles.modalFlex}>
                    <div className={styles.modalDiv}>
                      {type === 'vehicleOut' || type === 'vehicleIn'
                        ? '车架号'
                        : '商品编码'}
                    </div>
                    <Input
                      style={{ width: '90%' }}
                      value={goodsNo}
                      onChange={this.inputChange}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.modalFlex}>
                    <div className={styles.modalDiv}>
                      {type === 'vehicleOut' || type === 'vehicleIn'
                        ? '车型'
                        : '商品类别'}
                    </div>
                    {type === 'vehicleOut' || type === 'vehicleIn' ? (
                      <SoCarPicker
                        allowClear
                        multiple
                        level={4}
                        showCheckedStrategy={'SHOW_PARENT'}
                        onChange={this.onCarChange}
                        showAll={false}
                        style={{ width: '100%', maxHeight:'80px', overflow: 'auto' }}
                        value={defaultValueList}
                      />
                    ) : (
                      <CommodityLevelFour
                        allowClear
                        multiple
                        level={4}
                        showCheckedStrategy={'SHOW_PARENT'}
                        onChange={this.onCarChange}
                        showAll={false}
                        style={{ width: '100%',  maxHeight:'80px', overflow: 'auto' }}
                        value={defaultValueList}
                      />
                    )}
                  </div>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: 24 }}>
                <Col span={12}>
                  <div className={styles.modalFlex}>
                    <div className={styles.modalDiv}>成本域</div>
                    <Select
                      style={{ width: '90%' }}
                      onChange={this.selectChange}
                      value={costDomainCode}
                      clearable={true}
                    >
                      {wareHouse}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles.modalLine}>
              <Button
                type='primary'
                onClick={this.addCarList}
                disabled={isDisabled}
              >
                确定
              </Button>
              <Button
                type='primary'
                loading={isLoading}
                onClick={this.searchCarList}
              >
                查询
              </Button>
            </div>
            <Loading loading={isLoading}>
              <div>共{totalNumber}条,已选{currentRowKey.length}条</div>
              <Table
                data={
                  type === 'vehicleOut' || type === 'vehicleIn'
                    ? dotList
                    : dotLists
                }
                columns={
                  type === 'vehicleOut' || type === 'vehicleIn'
                    ? column
                    : columns
                }
                border={true}
                rowKey={'id'}
                onSelectChange={this.onSelectChange}
              />
              <div className={styles.table_loading}>
                <Pagination
                  className='pagination'
                  layout='prev, pager, next, jumper'
                  total={totalNumber}
                  pageSize={pageSize}
                  currentPage={page}
                  onCurrentChange={this.onCurrentChange}
                />
              </div>
            </Loading>
          </Modal.Body>
        </Modal>
        <Modal
          // width={'30%'}
          visible={sureModal}
          onCancel={() => {
            this.setState({ sureModal: false });
          }}
          title='提示'
        >
          <Modal.Body>
            确定要添加
            {type === 'vehicleOut' || type === 'vehicleIn' ? '车辆' : '商品'}
            吗？
          </Modal.Body>
          <Modal.Footer className='modal-footer'>
            <Button
              loading={addSureLoading}
              type='primary'
              onClick={this.sureAddCar}
            >
              确定
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddInfoList;
