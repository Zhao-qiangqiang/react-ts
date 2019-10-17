import { createStore, EffectContext } from '@souche-f2e/muji';
// 第三方库
// 接口
import { IMenuItem } from '@/shared/types/layout';
// 常量
const inVaildPathNameList = ['*'];
// 工具函数
function formatter(originData: IMenuItem[], parentPathName?: string): any[] {
  return originData
    .map((item: IMenuItem) => {
      if (!item || item.hideInMenu) {
        return null;
      }
      // 过滤404路由
      if (inVaildPathNameList.includes(item.path)) {
        return null;
      }

      // 拼接path/redirect
      if (parentPathName && item) {
        item.path = `${parentPathName === '/' ? '' : parentPathName}/${
          item.path
        }`;
        if (item.redirect) {
          item.redirect = `${parentPathName === '/' ? '' : parentPathName}/${
            item.redirect
          }`;
        }
      }
      if (item.children && item.path) {
        const children = formatter(item.children, item.path);
        item.children = children;
      }
      return item;
    })
    .filter(item => item);
}
// 接口
type IMenuModelState = {
  menuData: any[]
  routerData: any[]
  breadcrumbNameMap: any,
};

const state: IMenuModelState = {
  menuData: [],
  routerData: [],
  breadcrumbNameMap: {},
};

const store = createStore({
  state,
  reducers: {
    SAVE(state: IMenuModelState, payload: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async getMenuData(
      { routes = [] }: any,
      { update, state, rootState }: EffectContext<IMenuModelState>,
    ) {
      const menuData = formatter(routes);
      this.SAVE({ menuData: menuData || [] });
    },
  },
});

export default store;
