import * as React from 'react';
import { Route, RouteRecord } from '@souche-f2e/muji-router';
// 第三方库
import { Breadcrumb } from 'so-ui-react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
// 子组件
import { LifeCircle } from '@/components/Decorators';
// 样式
import styles from './index.less';
type IPageHeaderProps = {
  currentRoute: Route;
  showBreadcrumb?: boolean;
  breadcrumbLinkMap: any;
  pageTitleName?: string;
};
type IPageHeaderState = typeof defaultPageHeaderState;

const defaultPageHeaderState = {
  pageTitle: '',
  path: '',
};

@LifeCircle
class PageHeader extends React.Component<IPageHeaderProps, IPageHeaderState> {
  state = {
    pageTitle: '',
    path: '',
  };
  /**
   * @TODO currentRote中的name: undefined问题需要解决（从matched中获取name不是很合理）
   */
  static getDerivedStateFromProps(
    props: IPageHeaderProps,
    state: IPageHeaderState,
  ): IPageHeaderState | null {
    if (state.path !== props.currentRoute.path) {
      let sparePathName: any = '';
      const { currentRoute } = props;
      const { fullPath, matched } = currentRoute;
      const matchedObj: any = matched.find((item:any) => item.path === fullPath);
      if (!matchedObj) {
        const matchedLen = Array.isArray(matched) && matched.length;
        const matchedObj = matchedLen && matched[matchedLen - 1];
        sparePathName = matchedObj && matchedObj.name;
      }
      if (!isEmpty(matchedObj)) {
        return {
          pageTitle:
            matchedObj.name || get(matchedObj, 'parent.name', '') || '', // 对被重定向页面处理,
          path: matchedObj.path,
        };
      }
      return {
        pageTitle: sparePathName || get(matchedObj, 'parent.name', '') || '', // 对被重定向页面处理
        path: '',
      };
    }
    return null;
  }

  private renderTitle = (title: string): React.ReactNode => {
    return <span className={styles.pageTitle}>{title}</span>;
  }

  private renderBreadcrumb = (): React.ReactNode => {
    const {
      currentRoute: { matched },
      showBreadcrumb,
      breadcrumbLinkMap,
      pageTitleName,
    } = this.props;
    return (
      showBreadcrumb && (
        <span>
          <Breadcrumb separator='/'>
            {matched &&
              matched.map((item: RouteRecord, index: number) => {
                const action =
                  breadcrumbLinkMap && breadcrumbLinkMap[item.name!];

                if (
                  item.name &&
                  item.path &&
                  (item.component || item.redirect)
                ) {
                  return (
                    <Breadcrumb.Item key={item.path}>
                      <span
                        style={{ cursor: !action ? 'not-allowed' : 'pointer' }}
                        onClick={() => {
                          action && action(item.path!);
                        }}
                      >
                        {index === matched.length - 1
                          ? pageTitleName
                            ? pageTitleName
                            : item.name
                          : item.name}
                      </span>
                    </Breadcrumb.Item>
                  );
                }
                return null;
              })}
          </Breadcrumb>
        </span>
      )
    );
  }

  render() {
    const { pageTitle: routerName } = this.state;
    const { pageTitleName: customName } = this.props;
    const pageTitle = customName || routerName;
    return (
      <div className={styles.pageHeader}>
        {this.renderTitle(pageTitle)}
        {this.renderBreadcrumb()}
      </div>
    );
  }
}

export default PageHeader;
