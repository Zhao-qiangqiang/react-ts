import React, { Component, ReactNode } from 'react';
// 第三方库
import { Menu } from 'antd';
import { MujiLink } from '@souche-f2e/muji';
import _ from 'lodash';
// 常量
const { SubMenu } = Menu;
// 工具函数
import { urlToList, getMenuMatches } from './utils';
import { getIcon } from '@/components';
// 接口
import { IMenuItem } from '@/shared/types/layout';

type IBaseMenuProps = {
  menuData: IMenuItem[];
  theme?: 'light' | 'dark';
  currentRoute?: any;
  flatMenuKeys?: any[];
  onOpenChange: (openKeys: string[]) => void;
  openKeys: string[];
  style: object;
};

export default class BaseMenu extends Component<IBaseMenuProps, any> {
  private getNavMenuItems = (menusData: IMenuItem[]): ReactNode => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter((item: IMenuItem) => item && item.name)
      .map((item: IMenuItem) => this.getSubMenuOrItem(item))
      .filter((item: any) => item);
  }

  private getSubMenuOrItem = (item: IMenuItem): ReactNode => {
    const { name, path, icon = '' } = item;
    const iconRender = getIcon({ icon });
    if (
      item &&
      item.children &&
      item.children.some((child: IMenuItem) => !!(child && child.name))
    ) {
      return (
        <SubMenu
          key={path}
          title={
            icon ? (
              <span>
                {iconRender}
                <span>{name}</span>
              </span>
            ) : (
              <span>{name}</span>
            )
          }
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return (
      item && (
        <Menu.Item key={item.path}>{this.getMenuItemLink(item)}</Menu.Item>
      )
    );
  }

  private getMenuItemLink = (item: IMenuItem): ReactNode => {
    const { name, path: itemPath, icon = '' } = item;
    const iconRender = getIcon({ icon });
    const {
      currentRoute: { path: pathName },
    } = this.props;
    return (
      item && (
        <MujiLink to={itemPath} replace={itemPath === pathName}>
          {iconRender} <span>{name}</span>
        </MujiLink>
      )
    );
  }

  private getSelectedMenuKeys = (path: string): string[] => {
    const { flatMenuKeys } = this.props;
    return urlToList(path).map((itemPath: string) => {
      return getMenuMatches(flatMenuKeys, itemPath).pop();
    });
  }

  render() {
    const {
      menuData,
      theme,
      openKeys,
      currentRoute,
      onOpenChange,
      style,
    } = this.props;
    const { path } = currentRoute;
    const selectedKeys = this.getSelectedMenuKeys(path);
    return (
      <Menu
        key='Menu'
        mode='inline'
        theme={theme}
        style={style}
        onOpenChange={onOpenChange}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
