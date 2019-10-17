declare module '*.less';
declare module 'lodash';
declare module 'so-ui-react';
declare module 'so-utils';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
