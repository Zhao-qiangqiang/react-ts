import { ERPFetch } from '@/shared/utils';
const HOST_STOCK = process.env.MUJI_APP_API_STOCK;
const HOST_PB = process.env.MUJI_APP_API_PB;
const HOST_CS = process.env.MUJI_APP_API_CS;

export function queryStockList(param:any) {
  return ERPFetch(`${HOST_STOCK}/costAdjustJson/queryStockList.json`, {
    method: 'POST',
    json: param,
  });
}
export function getBasValueByBasCategoryNo(param:any) {
  return ERPFetch(`${HOST_PB}/sysBaseValueJson/getBasValueByBasCategoryNo.json`, {
    method: 'get',
    data: param,
  });
}
export function getDicDataByCategoryCode(param:any) {
  return ERPFetch(`${HOST_PB}/sysDataDicJson/getDicDataByCategoryCode.json`, {
    method: 'get',
    data: param,
  });
}
export function listCustomerNonsortByCondition(param:any) {
  return ERPFetch(`${HOST_CS}/listCustomerNonsortByCondition`, {
    method: 'POST',
    json: param,
  });
}
export function queryStockListWhenAdd(param:any) {
  return ERPFetch(`${HOST_STOCK}/costAdjustJson/queryStockListWhenAdd.json`, {
    method: 'POST',
    json: param,
  });
}
export function stockOutCostAdjust(param:any) {
  return ERPFetch(`${HOST_STOCK}/costAdjustJson/stockOutCostAdjust.json`, {
    method: 'POST',
    json: param,
  });
}
export function stockInCostAdjust(param:any) {
  return ERPFetch(`${HOST_STOCK}/costAdjustJson/stockInCostAdjust.json`, {
    method: 'POST',
    json: param,
  });
}
