import { dispatch } from '@@/store';
import Luban from '@souche-f2e/luban-js';

type ILubanEnv = 'development' | 'prepublish' | 'production';

type ILubanPreLoadConfig = {
  usertag: string;
  platform: string;
  // api_host: string;
  env: ILubanEnv;
};

function preloadLubanConfig(iid: string, userId: string) {
  try {
    const lubanPreLoadConfig: ILubanPreLoadConfig = {
      platform: process.env.MUJI_APP_PLATFORM || '',
      usertag: iid || userId || '',
      // api_host: process.env.MUJI_APP_API_LUBAN || ''
      env: (process.env.MUJI_APP_LUBAN_ENV as ILubanEnv) || 'production'
    };
    Luban.load(lubanPreLoadConfig);
  } catch (err) {
    console.log(err);
  }
}

export default async function bootstrap() {
  // 登陆信息
  const loginInfo = await dispatch.auth.fetchAuthInfo();
  if (loginInfo) {
    preloadLubanConfig(loginInfo.iid, loginInfo.userId); // 鲁班埋点读取全局配置
  }
}
