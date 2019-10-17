import React, { Component } from 'react';
import GlobalHeader from '@/components/GlobalHeader';

type HeaderProps = {
  logo: string
  title: string,
};
type HeaderState = {
  visiable: Boolean,
};

class HeaderView extends Component<HeaderProps, HeaderState> {
  render() {
    const { logo, title } = this.props;
    return <GlobalHeader logo={logo} title={title} />;
  }
}
export default HeaderView;
