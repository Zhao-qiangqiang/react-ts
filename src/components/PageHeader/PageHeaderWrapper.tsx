import * as React from 'react';
// 子组件
import RouterContext from './RouteContext';
import PageHeader from './PageHeader';
// 接口
type IPageHeaderWrapper = Partial<typeof defaultPageHeaderWrapper>;
// 常量
const defaultPageHeaderWrapper = {
  showBreadcrumb: false,
  breadcrumbLinkMap: {},
  pageTitleName: '',
};

const PageHeaderWrapper: React.SFC<IPageHeaderWrapper> = ({
  children,
  showBreadcrumb,
  breadcrumbLinkMap,
  pageTitleName,
}) => {
  return (
    <>
      <RouterContext.Consumer>
        {({ currentRoute }: any) => {
          return (
            <PageHeader
              currentRoute={currentRoute}
              showBreadcrumb={showBreadcrumb}
              breadcrumbLinkMap={breadcrumbLinkMap}
              pageTitleName={pageTitleName}
            />
          );
        }}
      </RouterContext.Consumer>
      {children && children}
    </>
  );
};

export default PageHeaderWrapper;
