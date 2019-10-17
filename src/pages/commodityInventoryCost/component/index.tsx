import React from 'react';
import { IRootState, dispatch } from '@@/store';
import { connect } from '@souche-f2e/muji';
import { MultiSelection, AddInfoList } from '@/components';
import { MessageBox, Toast, Loading } from 'so-ui-react';
import { InputNumber } from 'antd';
import Filter from './filter';
import styles from '@/config/styles.less';
import styled from 'styled-components';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
const Root = styled.div`
 .ant-input-number{
   width:100%
 }
`;
const mapStateToProps = (rootState: IRootState) => {
  return {
    commodityInventoryCost: rootState.commodityInventoryCost,
    currentRoute: rootState.router,
  };
};
type IProps = {
  currentRoute: IRootState;
};

type IState = {
  page_Type: string;
  hintInfo: string;
  amountAdjustment: string;
  form: any;
  isShowPage:boolean
};
const ENV = process.env.MUJI_APP_BUILD;
@connect(mapStateToProps)
class Opreate extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page_Type: '',
      amountAdjustment: '',
      hintInfo: '',
      form: null,
      isShowPage:false
    };
  }
  componentDidMount = () => {
    const { commodityInventoryCost } = dispatch;
    this.getQueryInfo();
    commodityInventoryCost.getbusinessAjustmentList();
    commodityInventoryCost.getwareHouseList();
  }
  // 获取路由信息
  getQueryInfo = () => {
    let page_Type: string = '';
    if (ENV === 'DEV') {
      const { currentRoute } = this.props;
      page_Type = currentRoute.query.type;
      this.setState({
        page_Type,
      });
      this.defaultList(currentRoute.query.dataSource);
    } else {
      menuRouter.ready((req: any) => {
        if (req.type) {
          page_Type = req.type;
          menuRouter.title!(
            page_Type === 'commodityOut' ? '商品出库成本调整' : '商品入库成本调整'
          );
          this.defaultList(req.dataSource);
          // 防止异步加载
          this.setState({
            page_Type,
          });
        }else {
          this.setState({
            isShowPage:true
          });
          setTimeout(() => {
            menuRouter.ready(() => {
              menuRouter.close!({
                noticeSourceWindow: true, // 通知来源页面
              });
            });
          },         2000);
        }
      });
    }
  }
  defaultList = (dataSource?: any) => {
    const tempArr: any[] = [];
    const arr: any[] = [];
    if (dataSource) {
      tempArr.push(dataSource);
    }
    if (tempArr.length > 0) {
      tempArr.forEach((item: any) => {
        const obj = {
          ...dataSource,
          adjustAmount: '',
          frontAmount: item.amount,
          frontQty: item.qty,
          behindAmount: item.amount,
        };
        arr.push(obj);
      });
    }
    dispatch.commodityInventoryCost.SAVE({
      detList: arr,
    });
  }
  // 调整金额逻辑
  inputNumchange = (data: any, value: any) => {
    const { page_Type } = this.state;
    const {
      commodityInventoryCost: { detList },
    } = this.props;
    let num: number = 0;
    let totalAmount: number = 0;
    const arr = detList.find((item: any) => {
      return item.id === data.id;
    });
    arr['adjustAmount'] = value;
    if (page_Type === 'commodityOut') {
      num = Number(data.amount) - Number(value);
      if (Number(data.amount) > 0 && Number(data.qty) === 0) {
        if (0 <= num && num <= Number(data.amount)) {
          arr['isShowHint'] = false;
        } else {
          this.setState({
            hintInfo: '当前输入金额不符合调整逻辑',
          });
          arr['isShowHint'] = true;
        }
      }
      if (Number(data.amount) > 0 && Number(data.qty) !== 0) {
        if (0 < num && num <= Number(data.amount)) {
          arr['isShowHint'] = false;
        } else {
          this.setState({
            hintInfo: '当前输入金额不符合调整逻辑',
          });
          arr['isShowHint'] = true;
        }
      }
      if (Number(data.amount) < 0 && Number(data.qty) === 0) {
        if (Number(data.amount) <= num && num <= 0) {
          arr['isShowHint'] = false;
        } else {
          this.setState({
            hintInfo: '当前输入金额不符合调整逻辑',
          });
          arr['isShowHint'] = true;
        }
      }
      if (Number(data.amount) < 0 && Number(data.qty) !== 0) {
        if (Number(data.amount) <= num && num < 0) {
          arr['isShowHint'] = false;
        } else {
          this.setState({
            hintInfo: '当前输入金额不符合调整逻辑',
          });
          arr['isShowHint'] = true;
        }
      }
    } else {
      num = Number(data.amount) + Number(value);
      if (Number(data.amount) >= 0) {
        if (num > 0) {
          arr['isShowHint'] = false;
        } else {
          this.setState({
            hintInfo: '当前输入金额不符合调整逻辑',
          });
          arr['isShowHint'] = true;
        }
      } else {
        if (Number(data.amount) < num && num <= 0) {
          arr['isShowHint'] = false;
        } else {
          this.setState({
            hintInfo: '当前输入金额不符合调整逻辑',
          });
          arr['isShowHint'] = true;
        }
      }
    }
    arr['behindAmount'] = num.toFixed(2);
    detList.forEach((item: any) => {
      totalAmount = Number(item.adjustAmount) + totalAmount;
    });
    dispatch.commodityInventoryCost.SAVE({
      detList,
      totalAmount,
    });
  }
  onForm = (form?: any) => {
    this.setState({
      form,
    });
  }
  adjustment = () => {
    const {
      commodityInventoryCost: { opreateSearchForm, detList },
    } = this.props;
    const { form, page_Type } = this.state;
    const tempArr: any[] = [];
    let flag = true;
    detList.forEach((item: any) => {
      const obj = {
        ...item,
        costDomainCode: item.costDomainNo,
      };
      tempArr.push(obj);
      if (item.adjustAmount === '') {
        Toast['error']({
          message: '请进行金额调整',
          duration: 1000,
        });
        flag = false;
      }
      if (item.isShowHint) {
        Toast['error']({
          message: '调整金额不符合调整逻辑',
          duration: 1000,
        });
        flag =  false;
      }
    });
    if (!flag) {
      return false;
    }
    const obj: any = {
      ...opreateSearchForm,
      dets: tempArr,
    };
    form.validate((valid: boolean) => {
      if (valid) {
        if (Array.isArray(detList) && detList.length > 0) {
          switch (page_Type) {
            case 'commodityOut':
              obj.stockOutDate = opreateSearchForm.stockDate;
              dispatch.commodityInventoryCost
                .stockOutCostAdjust(obj)
                .then((res: boolean) => {
                  if (res) {
                    setTimeout(() => {
                      if (ENV === 'DEV') {
                        dispatch.router.push('/commodityInventoryCost/list');
                        return;
                      }
                      menuRouter.ready(() => {
                        menuRouter.close!({
                          noticeSourceWindow: true, // 通知来源页面
                        });
                      });
                    },         1000);
                    return;
                  }
                });
              break;
            case 'commodityIn':
              obj.stockInDate = opreateSearchForm.stockDate;
              dispatch.commodityInventoryCost
                .stockInCostAdjust(obj)
                .then((res: boolean) => {
                  if (res) {
                    setTimeout(() => {
                      if (ENV === 'DEV') {
                        dispatch.router.push('/commodityInventoryCost/list');
                        return;
                      }
                      menuRouter.ready(() => {
                        menuRouter.close!({
                          noticeSourceWindow: true, // 通知来源页面
                        });
                      });
                    },         1000);
                    return;
                  }
                });
              break;
            default:
              break;
          }
        } else {
          MessageBox.confirm('请至少选择一辆车辆进行调整！', '提示', {
            type: 'warning',
          });
        }
      }
    });
  }
  render() {
    const { page_Type, hintInfo, isShowPage } = this.state;
    const {
      commodityInventoryCost: { detList },
    } = this.props;
    const columns = [
      {
        type: 'selection',
      },
      {
        label: '商品编码',
        prop: 'goodsNo',
        key: 'goodsNo',
        width: '250px',
      },
      {
        label: '商品名称',
        prop: 'goodsName',
        key: 'goodsName',
        width: '250px',
      },
      {
        label: '一级',
        prop: 'goodsL1CategoryName',
        key: 'goodsL1CategoryName',
        width: '250px',
      },
      {
        label: '二级',
        prop: 'goodsL2CategoryName',
        key: 'goodsL2CategoryName',
        width: '250px',
      },
      {
        label: '三级',
        prop: 'goodsL3CategoryName',
        key: 'goodsL3CategoryName',
        width: '250px',
      },
      {
        label: '四级',
        prop: 'goodsL4CategoryName',
        key: 'goodsL4CategoryName',
        width: '250px',
      },
      {
        label: '调整前金额',
        prop: 'amount',
        key: 'amount',
        width: '150px',
      },
      {
        label: '调整金额',
        // prop: 'goodsNo',
        key: 'adjustAmount',
        width: '250px',
        render: (row: any) => {
          return (
            <Root>
               <InputNumber
                value={row.adjustAmount}
                onChange={this.inputNumchange.bind(this, row)}
                precision={2}
              />
              {row.isShowHint ? (
                <div className={styles.hintInfo}>{hintInfo}</div>
              ) : null}
            </Root>
          );
        },
      },
      {
        label: '调整后金额',
        prop: 'behindAmount',
        key: 'behindAmount',
        width: '250px',
      },
    ];
    return (
      <div className={styles.root}>
              <div className={styles.title}>
                {page_Type === 'commodityOut'
                  ? '商品出库成本调整'
                  : '商品入库成本调整'}
              </div>
              <Loading loading={isShowPage} fullscreen={isShowPage} text={'当前数据变更，请重新打开此页面'}/>
              <Filter onForm={this.onForm} type={page_Type} />
              <MultiSelection
                type={page_Type}
                dataSource={detList}
                columns={columns}
                adjustment={this.adjustment}
                />
              <AddInfoList type={page_Type} />
      </div>
    );
  }
}

export default Opreate;
