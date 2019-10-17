import { createStore } from '@souche-f2e/muji';
// 第三方依赖
// 接口
import { ISetting } from '@/shared/types';
// 常量
const inititalState: ISetting = {
  layout: 'sidemenu',
};

export default createStore({
  state: inititalState,
  reducers: {
    SAVE(state: ISetting, payload: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {},
});
