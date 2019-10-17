import React, { Component } from 'react';
// 第三方库
import { Layout } from 'antd';
import { dispatch, IRootState } from '@@/store';
import { connect } from '@souche-f2e/muji';
import get from 'lodash/get';
// 子组件
import Header from './Header';
import { SiderMenu, RouterContext } from '@/components';
import { LifeCircle } from '@/components/Decorators';
// 样式
import styles from './index.less';
// 配置
import Setting from '@/config/defaultSetting';
// 常量
const BUILD_ENV = process.env.BUILD_ENV;
const { Content } = Layout;
const { titleIconUrl: logo, title, theme } = Setting;
const mapStateToProps = (rootState: IRootState) => {
  return {
    menuData: rootState.menu.menuData,
    layout: rootState.setting.layout,
  };
};
// 接口
import { ILayoutProps } from '@/shared/types/layout';
type IBasicLayoutProps = ILayoutProps & ReturnType<typeof mapStateToProps>;

@connect(mapStateToProps)
@LifeCircle
class BasicLayout extends Component<IBasicLayoutProps, any> {
  constructor(props: IBasicLayoutProps) {
    super(props);
  }

  componentWillMount() {
    const ele = document.getElementById('init-loading');
    if (ele) {
      setTimeout(() => {
        ele.style.opacity = '0';
      });
    }
  }

  componentDidMount() {
    const routes = get(this.props, 'router.options.routes', []);
    dispatch.menu.getMenuData({ routes });
  }

  getLayoutStyle = () => {
    return {};
  }

  getContentStyle = () => {
    const { layout } = this.props;
    return {
      padding: layout === 'print' ? 0 : '',
    };
  }

  private getRouterInfo = () => {
    const { currentRoute } = this.props;
    return {
      currentRoute,
    };
  }

  render() {
    const { menuData = [], children, layout } = this.props;
    return (
      <>
        <RouterContext.Provider value={this.getRouterInfo()}>
          <Layout>
            {BUILD_ENV === 'dev' && layout === 'sidemenu' && (
              <Header logo={logo} title={title} />
            )}
            <Layout
              style={{
                ...this.getLayoutStyle(),
              }}
            >
              {BUILD_ENV === 'dev' && layout === 'sidemenu' && (
                <SiderMenu menuData={menuData} theme={theme} {...this.props} />
              )}
              <Content
                className={styles.content}
                style={{ ...this.getContentStyle() }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        </RouterContext.Provider>
      </>
    );
  }
}

export default BasicLayout;
