import { ERPFetch } from '@/shared/utils';

const HOST_PB = process.env.MUJI_APP_API_PB;
const HOST_VS = process.env.MUJI_APP_API_VS;
const HOST_CS = process.env.MUJI_APP_API_CS;
const HOST_MD = process.env.MUJI_APP_API_MD;

// 车型四级
export function querySpecialMdmCarModelTreeVoTree(param: any) {
  return ERPFetch(`${HOST_VS}/getCarClassificationDesc.json`, {
    method: 'GET',
    data: param,
  });
}
// 新车四级
export function queryMdmCarModelNew(param: any) {
  return ERPFetch(`${HOST_PB}/mdmcarmodeljson/queryMdmCarModelNew.json`, {
    method: 'GET',
    data: param,
  });
}
// 获取部门
export function getDepartmentByShopCode() {
  return ERPFetch(`${HOST_PB}/mdmdepartmentmstrjson/getDepartmentByShopCode`, {
    method: 'GET',
  });
}
// 获取供应商
  export function querySupplierUnify(param:any) {
    return ERPFetch(`${HOST_CS}/supplierJson/querySupplierUnify.json`, {
      method: 'POST',
      json:param
    });
}
// 商品类别
export function getStockMstrInfo(param: any) {
  return ERPFetch(`${HOST_MD}/catalogjson/queryGoodsBycatagoryAndName.json`, {
    method: 'POST',
    json: param,
  });
}
