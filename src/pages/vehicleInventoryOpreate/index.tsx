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
    vehicleInventoryOpreate: rootState.vehicleInventoryOpreate,
  };
};

@connect(mapStateToProps)
class VehicleInventoryOpreate extends React.Component<any, any> {
  componentDidMount = () => {
    const { vehicleInventoryOpreate } = dispatch;
    vehicleInventoryOpreate.getwareHouseList();
  }
  goOpreate = (type: string, dataSource: any) => {
    const HOST = process.env.MUJI_APP_HOST;
    const ENV = process.env.MUJI_APP_BUILD;
    const {
      vehicleInventoryOpreate: { searchForm },
    } = this.props;
    if (ENV === 'DEV') {
      dispatch.router.push({
        path: '/vehicleInventoryOpreate/opreate',
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
        `${HOST}/srp-stock/#/vehicleInventoryOpreate/opreate`,
        data
      ).onClose!(() => {
        dispatch.vehicleInventoryOpreate.queryDataList(searchForm);
      });
    });
    return;
  }
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.title}>整车成本调整</div>
        <div className={styles.flex}>
          <Button onClick={this.goOpreate.bind(this, 'vehicleOut', null)} style={{ marginLeft: 10 }} type='primary'>
            出库调整
          </Button>
          <Button onClick={this.goOpreate.bind(this, 'vehicleIn', null)} type='primary'>入库调整</Button>
        </div>
        <SearchForm />
        <TableList />
      </div>
    );
  }
}

export default VehicleInventoryOpreate;
