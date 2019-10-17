// 第三方依赖
import { Toast } from 'so-ui-react';
import CacheUtils from 'so-utils';
import isEmpty from 'lodash/isEmpty';
// 常量
const HOST_LOGIN = process.env.MUJI_APP_HOST_LOGIN;
const codeMessage = {
  403: '403用户得到授权，但是访问是被禁止的。',
  404: '404服务器没有进行操作。',
  500: '500服务器发生错误，请检查服务器。',
  502: '500网关错误。',
  503: '500服务不可用，服务器暂时过载或维护。',
  504: '500网关超时。',
};
// 接口

// 用户传过来的header
type IHeaders = Partial<IFetchHeaders>;

// 传过来的请求options
type IOptions<T> = {
  timeout?: number; // default:10000
  headers?: IHeaders;
  method: 'post' | 'get' | 'POST' | 'GET';
  data?: T; // get请求/post请求：content-type=application/x-www-form-urlencoded
  json?: T; // post请求：content-type=application/json
  body?: string;
};

// 实际传给fetch的请求options
type IFetchOptions = {
  headers: IFetchHeaders;
  method: 'post' | 'get' | 'POST' | 'GET';
  body?: string;
};

// 实际传给fetch的请求options
type IFetchHeaders = {
  'Content-Type': string;
};

type IStatusCode = number | string;

type IPendingState = {
  hasResolved: boolean;
  hasRejected: boolean;
};

// 常量
const defaultReqOptions: IOptions<any> = {
  timeout: 100000,
  headers: {},
  method: 'get',
  data: {},
  json: {},
  body: '',
};
/**
 * ERP4.0用 http拦截器
 * 1. 超时处理
 * 2. post请求两种content-type处理
 * 3. 自动给url添加token
 * @param {string} url
 * @param {IOptions<T>} options
 * @returns {Promise<any>}
 */
function ERPFetch<T>(url: string, options: IOptions<T>): Promise<any> {
  const newOptions: IOptions<any> = { ...defaultReqOptions, ...options };
  const { timeout } = newOptions;
  const method = newOptions.method ? newOptions.method.toUpperCase() : 'GET';
  const token = CacheUtils.getCookie('_security_token') || '';

  let newUrl: string;
  return new Promise((resolve, reject) => {
    let hasResolved: boolean = false;
    let hasRejected: boolean = false;
    let fetchStatus: IStatusCode;
    // 处理请求头
    const formatedHeader: IFetchHeaders = getNewHeaders(newOptions, method);
    // 处理各种方法
    switch (method) {
      case 'POST':
        const postMethodResult = getHandlePostMethodResult(
          url,
          newOptions,
          token,
        );
        newOptions.body = postMethodResult.body;
        newUrl = postMethodResult.formatedUrl;
        break;
      case 'GET':
        const getMethodResult = getHandleGetMethodResult(
          url,
          newOptions,
          token,
        );
        newUrl = getMethodResult.formatedUrl;
        break;
      default:
        break;
    }
    // 处理过了超时后没有响应的情况
    if (timeout) {
      setTimeout(() => {
        const handleTimeoutResult = handleTimeout(
          hasResolved,
          hasRejected,
          reject,
        );
        hasRejected = handleTimeoutResult.hasRejected;
        hasResolved = handleTimeoutResult.hasResolved;
      },         timeout);
    }

    const reqOptions: IFetchOptions =
      method === 'POST'
        ? {
          headers: formatedHeader,
          body: newOptions.body || '',
          method: newOptions.method,
        }
        : {
          headers: formatedHeader,
          method: newOptions.method,
        };
    // 请求接口并且处理返回数据
    fetch(newUrl, reqOptions)
      .then((res: any) => {
        fetchStatus = res.status;
        return res.json();
      })
      .then((res: any) => {
        const handleResposeResult = handleRespose(
          fetchStatus,
          res,
          {
            hasResolved,
            hasRejected,
          },
          resolve,
          reject,
        );
        hasRejected = handleResposeResult.hasRejected;
        hasResolved = handleResposeResult.hasResolved;
      })
      .catch((e: any) => {
        const handleResposeErrorResult = handleResponseError(
          fetchStatus,
          e,
          reject,
          {
            hasResolved,
            hasRejected,
          },
        );
        hasRejected = handleResposeErrorResult.hasRejected;
        hasResolved = handleResposeErrorResult.hasResolved;
      });
  });
}

function getNewHeaders(options: IOptions<any>, method: string): IFetchHeaders {
  const { headers = {}, json } = options;
  switch (method) {
    case 'POST':
      if (!headers['Content-Type']) {
        headers['Content-Type'] = !isEmpty(json)
          ? 'application/json'
          : 'application/x-www-form-urlencoded';
        break;
      }

    case 'GET':
      /** @todo */
      break;
    default:
      break;
  }
  return { ...getDefaultHeaders(), ...headers };
}

function getHandlePostMethodResult(
  url: string,
  options: IOptions<any>,
  token: string,
) {
  const { json, data } = options;
  const body = !isEmpty(json)
    ? JSON.stringify(json, undefined, 0) // application/json
    : parseParam(data); // application/x-www-form-urlencoded
  const formatedUrl = `${url}?_security_token=${token}`;
  return { body, formatedUrl };
}

function getHandleGetMethodResult(
  url: string,
  options: IOptions<any>,
  token: string,
) {
  const { data, json } = options;
  const newRequestBody = {
    ...data,
    ...json,
    _security_token: token,
  };
  const formatedUrl =
    url + (url.indexOf('?') === -1 ? '?' : '&') + parseParam(newRequestBody);

  return { formatedUrl };
}

function handleTimeout(
  hasResolved: boolean,
  hasRejected: boolean,
  reject: (reason: any) => void,
): IPendingState {
  if (!hasResolved && !hasRejected) {
    /** @todo 全局提示 */
    Toast['error']({ message: '请求超时' });
    const e = new Error('timeout');
    reject(e);
    return { hasResolved: false, hasRejected: true };
  }
  return { hasResolved: false, hasRejected: false };
}

function handleRespose(
  status: IStatusCode,
  res: any,
  pendingState: IPendingState,
  resolve: (value?: any | PromiseLike<any>) => void,
  reject: (reason: any) => void,
): IPendingState {
  const { hasRejected, hasResolved } = pendingState;
  // 如果没有超时，则处理后台返回结果
  if (!hasResolved && !hasRejected) {
    // tslint:disable-next-line:triple-equals
    if (status != 200) {
      const e = new Error('系统错误，请稍后重试');
      reject(e);
      return { hasResolved: false, hasRejected: true };
    }
    // 兼容一些不标准的返回结构，直接抛出整个res
    if (typeof res.code === 'undefined' && typeof res.success === 'undefined') {
      resolve(res);
      return { hasResolved: true, hasRejected: false };
    }
    const resCode = parseInt(res.code, 10);

    switch (resCode) {
      // 调用接口成功，返回res.data
      case 200:
        {
          if (res.success) {
            {
              resolve(res.data);
              return { hasResolved: true, hasRejected: false };
            }
          }
        }
        break;
      // 登陆信息失效,跳转登陆界面
      case 10001: {
        if (!res.success) {
          const errMessage = res.msg;
          Toast['error']({
            message: errMessage,
            duration: 500,
            onClose() {
              HOST_LOGIN && (window.top.location.href = HOST_LOGIN);
            },
          });
          const e = new Error(errMessage);
          reject(e);
          return { hasResolved: false, hasRejected: true };
        }
      }
      // 其他后台返回错误的处理
      default:
        if (!res.success) {
          const errMessage = res.msg;
          Toast['error']({ message: errMessage });
          const error = new Error(errMessage);
          reject(error);
          return { hasResolved: false, hasRejected: true };
        }
        break;
    }
  }

  return { hasResolved: false, hasRejected: false };
}

function handleResponseError(
  stateCode: IStatusCode,
  e: any,
  reject: (reason: any) => void,
  pendingState: IPendingState,
): IPendingState {
  const { hasRejected, hasResolved } = pendingState;
  if (!hasResolved && !hasRejected) {
    switch (stateCode) {
      case 404: {
        /** @todo 跳转到404页面  */
        Toast['error']({ message: codeMessage[stateCode] });
        const error = new Error(codeMessage[stateCode]);
        reject(error);
        return { hasResolved: false, hasRejected: true };
      }
      case 502: {
        /** @todo 跳转到50X页面  */
        Toast['error']({ message: codeMessage[stateCode] });
        const error = new Error(codeMessage[stateCode]);
        reject(error);
        return { hasResolved: false, hasRejected: true };
      }
      default:
        Toast['error']({ message: '服务器内部错误' });
        reject(e);
        return { hasResolved: false, hasRejected: true };
    }
  }

  return { hasResolved: false, hasRejected: false };
}

function getDefaultHeaders(): IFetchHeaders {
  return {
    'Content-Type': '',
  };
}
function parseParam(obj: any): string {
  return Object.keys(obj)
    .map((k: string) => {
      return `${k}=${encodeURIComponent(obj[k])}`;
    })
    .join('&');
}

export default ERPFetch;
