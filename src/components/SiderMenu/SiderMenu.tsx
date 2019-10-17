import React, { Component, lazy, Suspense } from 'react';
// 第三方库
import { Layout } from 'antd';
import get from 'lodash/get';

// 子组件
import { PageLoading } from '@/components';
// import BaseMenu from './BaseMenu';
const BaseMenu = lazy(() => import('./BaseMenu'));
// 工具函数
import { getDefaultCollapsedSubMenus } from './utils';
// 接口
import { IMenu } from '@/shared/types/layout';
// 常量
const { Sider } = Layout;

type ISiderMenuWrapperProps = IMenu & { flatMenuKeys: any };
type ISiderMenuWrapperState = {
  openKeys: string[]
  pathname: string
  flatMenuKeysLen: string[],
};
export default class SiderMenu extends Component<
  ISiderMenuWrapperProps,
  ISiderMenuWrapperState
> {
  constructor(props: ISiderMenuWrapperProps) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
      pathname: '',
      flatMenuKeysLen: [],
    };
  }
  static getDerivedStateFromProps(
    props: ISiderMenuWrapperProps,
    state: ISiderMenuWrapperState,
  ) {
    const { pathname, flatMenuKeysLen } = state;
    const path = get(props, 'currentRoute.path', '');

    if (path !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
      return {
        pathname: path,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  private handleOpenChange = (openKeys: string[]) => {
    this.setState({
      openKeys,
    });
  }

  public render() {
    const { theme } = this.props;
    const { openKeys } = this.state;
    return (
      <>
        <Sider theme={theme} width={256}>
          <Suspense fallback={<PageLoading />}>
            <BaseMenu
              {...this.props}
              openKeys={openKeys}
              style={{ padding: '16px 0', width: '100%' }}
              onOpenChange={this.handleOpenChange}
            />
          </Suspense>
        </Sider>
      </>
    );
  }
}
