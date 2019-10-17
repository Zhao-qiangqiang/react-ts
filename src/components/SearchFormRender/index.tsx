import React, { ReactNode, CSSProperties } from 'react';
import { Row, Col, Button } from 'so-ui-react';

type IStyle = {
  search_label?: CSSProperties;
  search_control?: CSSProperties;
  search_item?: CSSProperties;
};

type ISearchItem = {
  span: string | boolean;
  component: ReactNode;
  style?: IStyle;
};

import styles from './styles.less';

/**
 *
 * @param searchItem
 * 以curry形式调用本函数，渲染出srp列表页的查询条件
 * 第一个函数入参：每个筛选条件的数据对象，一个拥有span:string和component:ReactNode键名的对象，eg
 *

  {
    span: '车架号',
    component: (
      <Input
        value={supplierId}
        style={{ width: '100%' }}
        onChange={(value: any) => this.onChangeItem('supplierId', value)}
      />
    ),
  },
 *
 *第二个函数入参：重置按钮的方法，一般为清空所有已输入的值
 *第三个函数入参：查询按钮的方法，一般ajax请求
 *第四个函数入参：loading:boolean状态，供按钮和table的loading状态使用
 *第五个函数入参：额外的按钮，传入ReactNode,按从左到右排列在查询按钮后，TODO：自定义按钮位置
 *
 * 完整示例：
 *  const renderSearchForm: ReactNode = SearchFormRender([
      {
        span: '业务单号',
        component: (
          <Input
            value={bizOrderNo}
            style={{ width: '100%' }}
            onChange={(value: any) => this.onChangeItem('bizOrderNo', value)}
          />
        ),
      }
    ])(this.resetSearchValues)(this.queryData)(isQueryDataLoading)([
      <Button key="register" type="primary" onClick={this.showRegisterModal}>
        发票勾稽
      </Button>,
    ]);
    在组件的render函数中 <div>{renderSearchForm}</div>
 *
 */

const renderSearchFormHoc = (searchItem: ISearchItem[]) => (resetFunc: any) => (
  submitFunc: any
) => (loading: boolean) => (extraButtons: ReactNode[]) => {
  if (searchItem.length === 0) {
    throw new Error('请传入任一表单项');
  }
  // 定义组件每行显示个数
  const eachRowHasItemNumber = 3;
  const renderView: ReactNode[] = [];
  for (let j = 0; j < searchItem.length; j += eachRowHasItemNumber) {
    let colItem = null;
    colItem = searchItem.slice(j, j + eachRowHasItemNumber).map((k, index) => {
      const isHasExtraStyle = !!k.style;
      const itemStyle = k.style!;
      return (
        <Col
          span={24 / eachRowHasItemNumber}
          className={styles.search_item}
          style={isHasExtraStyle ? itemStyle.search_item : undefined}
          key={j + index}
        >
          <span
            className={styles.search_label}
            style={isHasExtraStyle ? itemStyle.search_label : undefined}
          >
            {k.span}
          </span>
          <div
            className={styles.search_control}
            style={isHasExtraStyle ? itemStyle.search_control : undefined}
          >
            {k.component}
          </div>
        </Col>
      );
    });
    renderView.push(
      <Row
        key={j}
        gutter={8}
        type='flex'
        align='middle'
        className={styles.search_hasmargin}
      >
        {colItem}
      </Row>
    );
  }
  return (
    <div className={styles.search_form}>
      {renderView}
      <Row className={styles.search_buttons}>
        {resetFunc ? <Button onClick={resetFunc}>重置</Button> : null}
        {submitFunc ? (
          <Button type='primary' onClick={submitFunc} loading={loading}>
            查询
          </Button>
        ) : null}
        {extraButtons && extraButtons}
      </Row>
    </div>
  );
};

export default renderSearchFormHoc;
