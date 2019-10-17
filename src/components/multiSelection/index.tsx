import React from 'react';
import { Loading, Table, Modal, Button } from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import { connect } from '@souche-f2e/muji';
import styles from '@/config/styles.less';
type IProps = {
  dataSource: any;
  columns: any;
  type: string;
  adjustment: () => void;
} & ReturnType<typeof mapStateToProps>;
type IState = {
  currentRowKey: any[];
  addSureLoading: boolean;
  sureModal: boolean;
};

const mapStateToProps = (rootState: IRootState) => {
  return {
    auth: rootState.auth,
    vehicleInventoryOpreate: rootState.vehicleInventoryOpreate,
    commodityInventoryCost: rootState.commodityInventoryCost,
  };
};
@connect(mapStateToProps)
class MultiSelection extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentRowKey: [],
      addSureLoading: false,
      sureModal: false,
    };
  }
  componentDidMount() {}

  openModal = () => {
    const {
      type,
    } = this.props;
    let detList:any[] = [];
    const obj: any = {};
    if (type === 'vehicleOut' || type === 'vehicleIn') {
      detList = this.props.vehicleInventoryOpreate.detList;
      const tempArr: any[] = [];
      detList.forEach((item: any) => {
        tempArr.push(item.goodsNo);
      });
      obj.stockGoodsTypeCode = '10800000';
      obj.stockTypeCode = type === 'vehicleOut' ? '10750010' : '10650005';
      obj.noVinList = tempArr;
      obj.costDomainCode = '';
      obj.goodsNo = '';
      obj.goodsCategoryList = [];
      obj.page = 1;
      obj.pageSize = 10;
      dispatch.vehicleInventoryOpreate.SAVE({
        isShowModal: true,
        filterForm:obj
      });
      dispatch.vehicleInventoryOpreate.getCarList(obj);
    }else {
      detList = this.props.commodityInventoryCost.detList;
      const tempArr: any[] = [];
      detList.forEach((item: any) => {
        const obq = {
          goodsNo: item.goodsNo,
          costDomainCode: item.costDomainNo,
        };
        tempArr.push(obq);
      });
      obj.stockGoodsTypeCode = '10800005';
      obj.stockTypeCode = type === 'commodityOut' ? '10750010' : '10650005';
      obj.noGoodsCostDoMainList = tempArr;
      obj.costDomainCode = '';
      obj.goodsNo = '';
      obj.goodsCategoryList = [];
      obj.page = 1;
      obj.pageSize = 10;
      dispatch.commodityInventoryCost.SAVE({
        isShowModals: true,
        filtersForm:obj
      });
      dispatch.commodityInventoryCost.getCarList(obj);
    }
  }
  onSelectChange = (selection: any) => {
    console.log(selection);
    if (selection.length > 0) {
      this.setState({
        currentRowKey: selection,
      });
    } else {
      this.setState({
        currentRowKey: [],
      });
    }
  }
  isSureDelete = () => {
    this.setState({
      sureModal: true,
    });
  }

  deleteCarList = () => {
    const { currentRowKey } = this.state;
    const {
      type,
    } = this.props;
    let detList:any[] = [];
    let totalAmount: number = 0;
    if (Array.isArray(currentRowKey) && currentRowKey.length > 0) {
      if (type === 'vehicleOut' || type === 'vehicleIn') {
        detList = this.props.vehicleInventoryOpreate.detList;
      }else {
        detList = this.props.commodityInventoryCost.detList;
      }
      currentRowKey.forEach((item: any) => {
        detList.forEach((it: any, index: number) => {
          if (item === it.id) {
            detList.splice(index, 1);
            detList.forEach((item: any) => {
              totalAmount = Number(item.adjustAmount) + totalAmount;
            });
            type === 'vehicleOut' || type === 'vehicleIn' ?
            dispatch.vehicleInventoryOpreate.SAVE({
              detList,
              totalAmount
            }) : dispatch.commodityInventoryCost.SAVE({
              detList,
              totalAmount
            });
          }
        });
      });
      this.setState({
        sureModal: false,
        currentRowKey:[]
      });
    }
  }
  adjustment = () => {
    this.props.adjustment();
  }
  render() {

    const {
      dataSource,
      columns,
      type,
      vehicleInventoryOpreate: { isChangeLoading },
      commodityInventoryCost:{ isChangesLoading }
    } = this.props;
    const { currentRowKey, sureModal, addSureLoading } = this.state;
    const isLoading =
      type === 'vehicleOut' || type === 'vehicleIn' ? isChangeLoading : isChangesLoading;
    return (
      <div>
        <div className={styles.addOrDelete}>
          <div>
            <Button
              type='primary'
              style={{ marginRight: 10 }}
              onClick={this.openModal}
            >
             {type === 'vehicleOut' || type === 'vehicleIn' ? '添加车辆' : '添加商品'}
            </Button>
            <Button
              type='primary'
              disabled={currentRowKey.length > 0 ? false : true}
              onClick={this.isSureDelete}
              >
              {type === 'vehicleOut' || type === 'vehicleIn' ? '删除车辆' : '删除商品'}
            </Button>
          </div>
          <div>
            <Button
              type='primary'
              loading={isLoading}
              onClick={this.adjustment}
            >
              调整
            </Button>
          </div>
        </div>
        <div>
          共{dataSource.length}条,已选择{currentRowKey.length}条
        </div>
        <Loading loading={false}>
          <Table
            data={dataSource}
            columns={columns}
            border={true}
            height={600}
            onSelectChange={this.onSelectChange}
            rowKey={'id'}
            currentRowKey={currentRowKey}
          />
        </Loading>
        <Modal
          visible={sureModal}
          onCancel={() => {
            this.setState({ sureModal: false });
          }}
          title='提示'
        >
          <Modal.Body>确定要删除所选{type === 'vehicleOut' || type === 'vehicleIn' ? '车辆' : '商品'}吗？</Modal.Body>
          <Modal.Footer className='modal-footer'>
            <Button
              loading={addSureLoading}
              type='primary'
              onClick={this.deleteCarList}
            >
              确定
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default MultiSelection;
