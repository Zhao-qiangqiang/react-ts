import React from 'react';
import styles from '@/config/styles.less';
import SearchForm from './searchForm';
import TableList from './tableList';
class VehicleCostInquiry extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.title}>商品成本调整查询</div>
        <SearchForm />
        <TableList />
      </div>
    );
  }
}

export default VehicleCostInquiry;
