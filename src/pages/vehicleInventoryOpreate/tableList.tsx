import React from 'react';
import { connect } from '@souche-f2e/muji';
import { IRootState, dispatch } from '@@/store';
import { Table, Pagination, Loading } from 'so-ui-react';
import { ASearchForm } from '@/shared/types';
import styles from '@/config/styles.less';
import { menuRouter } from '@souche-f2e/souche-menu-partner';

const HOST = process.env.MUJI_APP_HOST;
const ENV = process.env.MUJI_APP_BUILD;
const mapStateToProps = (rootState: IRootState) => {
  return {
    vehicleInventoryOpreate: rootState.vehicleInventoryOpreate,
  };
};

type IProps = {} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: ASearchForm;
};
@connect(mapStateToProps)
class TableList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }
  onCurrentChange = (page: number) => {
    const {
      vehicleInventoryOpreate: { searchForm },
    } = this.props;
    dispatch.vehicleInventoryOpreate.queryDataList({
      ...searchForm,
      page,
    });
  }
  onSizeChange = (pageSize: number) => {
    const {
      vehicleInventoryOpreate: { searchForm },
    } = this.props;
    dispatch.vehicleInventoryOpreate.queryDataList({
      ...searchForm,
      page: 1,
      pageSize,
    });
  }
  summaryMethod = (columns: any, data: any) => {
    const arr: any[] = [];
    for (let i = 0; i < columns.length; i += 1) {
      let num: any = 0;
      for (let j = 0; j < data.length; j += 1) {
        switch (columns[i].label) {
          case '数量':
            num += data[j].qty ? data[j].qty : 0;
            arr[i] = num;
            break;
          case '金额':
            num += data[j].amount ? data[j].amount : 0;
            arr[i] = num.toFixed(2);
            break;
          case '车架号':
            num = '合计';
            arr[i] = num;
            break;

          default:
            break;
        }
      }
    }
    return arr;
  }
  adjustmentCosts = (type: string, dataSource: any) => {
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
    const columns = [
      {
        label: '车架号',
        prop: 'goodsNo',
        key: 'goodsNo',
        width: '250px',
      },
      {
        label: '品牌',
        prop: 'goodsL1CategoryName',
        key: 'goodsL1CategoryName',
        width: '200',
      },
      {
        label: '车系',
        prop: 'goodsL2CategoryName',
        key: 'goodsL2CategoryName',
        width: '200px',
      },
      {
        label: '车款',
        prop: 'goodsL3CategoryName',
        key: 'goodsL3CategoryName',
        width: '250px',
      },
      {
        label: '车型',
        prop: 'goodsL4CategoryName',
        key: 'goodsL4CategoryName',
        width: '300px',
      },
      {
        label: '成本域',
        prop: 'costDomainName',
        key: 'costDomainName',
        width: '200px',
      },
      {
        label: '数量',
        prop: 'qty',
        key: 'qty',
        width: '150px',
      },
      {
        label: '金额',
        prop: 'amount',
        key: 'amount',
        width: '150px',
      },
      {
        label: '操作',
        // prop: 'currentOutgoingAmount',
        key: 'currentOutgoingAmount',
        width: '250px',
        fixed: 'right',
        render: (row: any) => {
          return (
            <div>
              {row.showOutButton === 0 ? null : (
                <span
                  style={{ marginRight: 10, cursor:'pointer'  }}
                  className={styles.hta}
                  onClick={this.adjustmentCosts.bind(this, 'vehicleOut', row)}
                >
                  出库调整
                </span>
              )}
              {row.showInButton === 0 ? null : (
                <span
                  style={{ marginRight: 10, cursor:'pointer'  }}
                  className={styles.hta}
                  onClick={this.adjustmentCosts.bind(this, 'vehicleIn', row)}
                >
                  入库调整
                </span>
              )}
            </div>
          );
        },
      },
    ];
    const {
      vehicleInventoryOpreate: {
        dataSource,
        totalNumber,
        searchForm: { page, pageSize },
        isQueryLoading,
      },
    } = this.props;
    return (
      <div>
        <Loading loading={isQueryLoading}>
          <p>共{totalNumber}条</p>
          <Table
            data={dataSource}
            columns={columns}
            border={true}
            showSummary={true}
            sumText={'合计'}
            summaryMethod={this.summaryMethod}
            height={600}
          />
          {totalNumber < 50 ? null : (
            <div className={styles.table_loading}>
              <Pagination
                className='pagination'
                layout='sizes, prev, pager, next, jumper'
                total={totalNumber}
                pageSizes={[10, 20, 30, 40, 50]}
                pageSize={pageSize}
                currentPage={page}
                onCurrentChange={this.onCurrentChange}
                onSizeChange={this.onSizeChange}
              />
            </div>
          )}
        </Loading>
      </div>
    );
  }
}
export default TableList;
