import { ERPFetch } from '@/shared/utils';
const HOST_VS = process.env.MUJI_APP_API_VS;

export function fetchAuthInfo() {
  return ERPFetch(`${HOST_VS}/saas/sso/httpApi/getAuth.json`, {
    method: 'get',
  });
}
