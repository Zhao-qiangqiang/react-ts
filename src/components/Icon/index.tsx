import React from 'react';
// 第三方库
import { Icon } from 'antd';
// 工具函数
import { isUrl } from '@/shared/utils';
// 样式
import styles from './index.less';
type IGetIcon = {
  icon: string;
};
const getIcon: React.SFC<IGetIcon> = ({ icon = '' }): any => {
  if (icon && typeof icon === 'string') {
    if (isUrl(icon)) {
      return (
        <Icon
          component={() => (
            <img src={icon} alt='icon' className={styles.icon} />
          )}
        />
      );
    }
    return <Icon type={icon} />;
  }
  return icon;
};

export default getIcon;
