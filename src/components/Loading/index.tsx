import * as React from 'react';
import { Loading } from 'so-ui-react';

export const PageLoading: React.SFC<any> = () => {
  return <Loading fullscreen={true} />;
};

const defaultComponentLoadingProps = {
  text: '加载中...',
  isLoading: false,
};

export const ComponentLoading: React.SFC<
  Partial<typeof defaultComponentLoadingProps>
> = ({ text = '加载中...', isLoading, children }) => {
  return (
    <Loading text={text} loading={isLoading}>
      {children}
    </Loading>
  );
};
