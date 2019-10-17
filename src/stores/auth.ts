import { createStore } from '@souche-f2e/muji';
// 第三方依赖
// 后端接口
import { fetchAuthInfo } from '@/services';
// 接口
import { IAuth } from '@/shared/types';
// 常量
const inititalState: IAuth = {};

const getStringifiedRoleInfo = (data: any[]) => (key: string) => (separator: string = '，') => {
  if (!Array.isArray(data)) return;

  return data
    .reduce((list: string[], item: any) => {
      if (item[key]) list.push(item[key]);
      return list;
    },      [])
    .join(separator);
};

export default createStore({
  state: inititalState,
  reducers: {
    SAVE(state: IAuth, payload: any) {
      return {
        ...state,
        ...payload
      };
    },
    UPDATE_AUTH(state: IAuth, payload: any) {
      // 如果要做缓存
    }
  },
  effects: {
    async fetchAuthInfo() {
      try {
        const result = await fetchAuthInfo();
        const { roles = null } = result;
        const roleName = getStringifiedRoleInfo(JSON.parse(roles))('name')() || '';
        this.SAVE({ ...result, roleName });
        localStorage.setItem('loginInfo', JSON.stringify(result));
        return result;
      } catch (e) {
        console.log(e);
        return;
      }
    }
  }
});
