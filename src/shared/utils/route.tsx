import { MessageBox } from 'so-ui-react';
import { dispatch } from '@@/store';

type needConfirmBeforeLeaveRouterFunc = (...args: any) => boolean;

/**
 * 路由守卫
 * @param needConfirmBeforeLeaveRouter 是否执行路由守卫
 */
export function beforeRouteLeaveWithOutSave(
  needConfirmBeforeLeaveRouter?: boolean | needConfirmBeforeLeaveRouterFunc
) {
  return function (router: string) {
    return function () {
      const flag =
        typeof needConfirmBeforeLeaveRouter === 'function'
          ? needConfirmBeforeLeaveRouter()
          : needConfirmBeforeLeaveRouter;
      if (flag) {
        return MessageBox.confirm('确定不保存已填写的内容?', '提示', {
          type: 'warning',
        })
          .then(() => {
            dispatch.router.push(router);
          })
          .catch(() => {});
      }
      return dispatch.router.push(router);
    };
  };
}
