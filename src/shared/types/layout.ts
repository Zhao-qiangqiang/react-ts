import { IGlobal } from './global';
export type SiderTheme = 'light' | 'dark';
export type IMenuItem = {
  children?: IMenuItem[]
  path: string
  redirect: string
  name?: string
  icon?: string
  hideInMenu?: boolean,
};
export type IMenu = {
  menuData: IMenuItem[]
  theme: SiderTheme,
};
export type ILayoutProps = IGlobal & IMenu;
