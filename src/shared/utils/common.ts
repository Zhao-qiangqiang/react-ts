export function getUuid() {
  // tslint:disable-next-line:ter-prefer-arrow-callback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getTableOperationDisplay(condition: string[]) {
  return function (value: string | string[]) {
    let result = false;
    if (typeof value === 'string') {
      result = condition.includes(value);
    }
    if (Array.isArray(value)) {
      result = value.every((item: string) => condition.includes(item));
    }
    return result ? 'inline-block' : 'none';
  };
}

export function getValueByPath(data: any, path: string) {
  if (typeof path !== 'string') return null;
  return path.split('.').reduce((pre, cur) => (pre || {})[cur], data);
}
export function genID(length: any) {
  return Number(
    Math.random()
      .toString()
      .substr(3, length) + Date.now()
  ).toString(36);
}
