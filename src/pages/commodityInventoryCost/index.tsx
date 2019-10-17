import React from 'react';
import { IRootState, dispatch } from '@@/store';
import { connect } from '@souche-f2e/muji';
import { Button } from 'so-ui-react';
import SearchForm from './searchForm';
import TableList from './tableList';
import styles from '@/config/styles.less';
import { menuRouter } from '@souche-f2e/souche-menu-partner';

const mapStateToProps = (rootState: IRootState) => {
  return {
    commodityInventoryCost: rootState.commodityInventoryCost,
  };
};

@connect(mapStateToProps)
class VehicleInventoryOpreate extends React.Component<any, any> {
  componentDidMount = () => {
    const { commodityInventoryCost } = dispatch;
    commodityInventoryCost.getwareHouseList();
  }
  goOpreate = (type: string, dataSource: any) => {
    const HOST = process.env.MUJI_APP_HOST;
    const ENV = process.env.MUJI_APP_BUILD;
    const {
      commodityInventoryCost: { searchForm },
    } = this.props;
    if (ENV === 'DEV') {
      dispatch.router.push({
        path: '/commodityInventoryCost/opreate',
        query: {
          type,
          dataSource,
        },
      });
      return;
    }
    const data = {
      type,
      dataSource,
    };
    menuRouter.ready((req: any) => {
      menuRouter.open!(
        `${HOST}/srp-stock/#/commodityInventoryCost/opreate`,
        data
      ).onClose!(() => {
        dispatch.commodityInventoryCost.queryDataList(searchForm);
      });
    });
    return;
  }
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.title}>商品成本调整</div>
        <div className={styles.flex}>
          <Button onClick={this.goOpreate.bind(this, 'commodityOut', null)} style={{ marginLeft: 10 }} type='primary'>
            出库调整
          </Button>
          <Button onClick={this.goOpreate.bind(this, 'commodityIn', null)} type='primary'>入库调整</Button>
        </div>
        <SearchForm />
        <TableList />
      </div>
    );
  }
}

export default VehicleInventoryOpreate;
