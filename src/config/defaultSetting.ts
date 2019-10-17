import { SiderTheme } from '@/shared/types/layout';
type IStyleConfig = {
  tableMaxHeight: number;
};
type IComponentConfig = {
  closeOnClickModal: boolean;
  closeOnPressEscape: boolean;
};
type IDefaultSetting = {
  title: string;
  titleIconUrl: string;
  theme: SiderTheme;
  styleConfig: IStyleConfig;
  componentConfig: IComponentConfig;
};
export default <IDefaultSetting>{
  title: '经销商智能运营平台',
  // titleIconUrl: 'https://assets.souche.com/assets/sccimg/ERP 4.0/srp-icon.ico',
  theme: 'light', // 开发环境：菜单背景用
  styleConfig: {
    tableMaxHeight: 500,
  },
  componentConfig: {
    closeOnClickModal: false,
    closeOnPressEscape: false,
  },
};
