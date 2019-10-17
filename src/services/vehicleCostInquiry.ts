import { ERPFetch } from '@/shared/utils';
const HOST_STOCK = process.env.MUJI_APP_API_STOCK;

export function listStockCostAdjust(param: any) {
  return ERPFetch(`${HOST_STOCK}/costAdjustJson/listStockCostAdjust.json`, {
    method: 'POST',
    json: param,
  });
}
