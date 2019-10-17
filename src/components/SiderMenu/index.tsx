import React from 'react';
// 子组件
import SiderMenu from './SiderMenu';
// 工具函数
import { getFlatMenuKeys } from './utils';
// 接口
import { IMenu } from '@/shared/types/layout';

const SiderMenuWrapper = React.memo((props: IMenu) => {
  const { menuData = [], theme } = props;
  const flatMenuKeys = getFlatMenuKeys(menuData);

  return <SiderMenu {...props} flatMenuKeys={flatMenuKeys} theme={theme} />;
});

export default SiderMenuWrapper;
