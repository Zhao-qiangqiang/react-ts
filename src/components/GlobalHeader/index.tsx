import React, { Component } from 'react';
import { MujiLink } from '@souche-f2e/muji';
import { Icon } from 'antd';
import styles from './index.less';
import _ from 'lodash';

type IGlobalHeaderProps = {
  logo: string
  title: string
  collapsed?: boolean,
};

export default class GlobalHeader extends Component<IGlobalHeaderProps, any> {
  static defaultProps = {
    collapsed: false,
  };

  toggle = () => {};
  render() {
    const { collapsed, logo, title } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <MujiLink to='/'>
            {logo && <img src={logo} alt='logo' />}
            <h1>{title}</h1>
          </MujiLink>
        </div>
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
      </div>
    );
  }
}
