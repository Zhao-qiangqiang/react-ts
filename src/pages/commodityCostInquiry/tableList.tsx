import React from 'react';
import { connect } from '@souche-f2e/muji';
import { IRootState, dispatch } from '@@/store';
import { Table, Pagination, Loading } from 'so-ui-react';
import { CSearchForm } from '@/shared/types';
import styles from '@/config/styles.less';

const mapStateToProps = (rootState: IRootState) => {
  return {
    commodityCostInquiry: rootState.commodityCostInquiry,
  };
};

type IProps = {} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: CSearchForm;
};
@connect(mapStateToProps)
class TableList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }
  onCurrentChange = (page: number) => {
    const {
      commodityCostInquiry: { searchForm },
    } = this.props;
    dispatch.commodityCostInquiry.queryDataList({
      ...searchForm,
      page,
    });
  }
  onSizeChange = (pageSize: number) => {
    const {
      commodityCostInquiry: { searchForm },
    } = this.props;
    dispatch.commodityCostInquiry.queryDataList({
      ...searchForm,
      page: 1,
      pageSize,
    });
  }
  render() {
    const columns = [
      {
        label: '成本调整单号',
        prop: 'stockNo',
        key: 'stockNo',
        width: '250px',
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
        width: '200px',
      },
      {
        label: '商品一级类别',
        prop: 'goodsL1CategoryName',
        key: 'goodsL1CategoryName',
        width: '200px',
      },
      {
        label: '商品二级类别',
        prop: 'goodsL2CategoryName',
        key: 'goodsL2CategoryName',
        width: '250px',
      },
      {
        label: '商品三级类别',
        prop: 'goodsL3CategoryName',
        key: 'goodsL3CategoryName',
        width: '300px',
      },
      {
        label: '客商',
        prop: 'cusOrSupplierName',
        key: 'cusOrSupplierName',
        width: '200px',
      },
      {
        label: '部门',
        prop: 'deptName',
        key: 'deptName',
        width: '150px',
      },
      {
        label: '调整类型',
        prop: 'stockTypeName',
        key: 'stockTypeName',
        width: '150px',
      },
      {
        label: '调整时间',
        prop: 'stockDate',
        key: 'stockDate',
        width: '150px',
      },
      {
        label: '调整金额',
        prop: 'amount',
        key: 'amount',
        width: '150px',
      },
    ];
    const {
      commodityCostInquiry: {
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
