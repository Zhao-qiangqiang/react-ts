import pathToRegexp from 'path-to-regexp';

export function urlToList(url: string) {
  const urllist = url.split('/').filter((i: string) => i);
  return urllist.map(
    (urlItem: any, index: number) => `/${urllist.slice(0, index + 1).join('/')}`,
  );
}

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
export const getFlatMenuKeys = (menuData: any) => {
  let keys: any[] = [];
  menuData.forEach((item: any) => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

export const getMenuMatches = (flatMenuKeys: any[], path: string) =>
  flatMenuKeys.filter((item: any) => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });
/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = (props: any) => {
  const {
    currentRoute: { path },
    flatMenuKeys,
  } = props;
  return urlToList(path)
    .map((item: any) => getMenuMatches(flatMenuKeys, item)[0])
    .filter((item: any) => item)
    .reduce((acc, curr) => [...acc, curr], ['/']);
};
