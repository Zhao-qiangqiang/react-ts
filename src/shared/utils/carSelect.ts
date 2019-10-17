// IONSA
export const getChildren = (data: any, index: any, list: any , dataL: any) => {
    type datalist = any;
    const datalist = [
        ['carBrandName', 'carBrandId'],
        ['carSeriesName', 'carSeriesId'],
        ['carCategoryName', 'carCategoryCode'],
        ['carModelName', 'carModelId']
    ];
    // 将本层子集信息写入list
    list[datalist[index][0]] = data.label;
    list[datalist[index][1]] = data.value;
    if (data.children) {
        // 对子集进行循环
        data.children.forEach((item:any) => {
            getChildren(item, index + 1, list, dataL);
        });
    } else {
        dataL.push(list);
    }
    return dataL;
};
export const getChildrenConcat = (extra:any) => {
    const data = extra.valueListTree;
    const list:any = [];
    let datalist:any = [];
    data.forEach((item:any) => {
        list.push(getChildren(item, 0, {}, []));
    });
    list.forEach((item:any) => {
        datalist = datalist.concat(item);
    });
    return datalist;
};

export const collectValue = (options:any, valueCache:any) => {
    // tslint:disable-next-line:no-parameter-reassignment
    valueCache = valueCache || {};
    if (!Array.isArray(options)) {
        return;
    }
    options.map((option) => {
        if (!valueCache[option.value]) {
            valueCache[option.value] = option;
        }

        if (option.children && option.children.length > 0) {
            collectValue(option.children, valueCache);
        }

        option.children &&
            option.children.length &&
            option.children.push({
                value: Math.random(),
                label: Math.random(),
                placeholder: true,
            });
    });
    return valueCache;
};

// export const collectValue = (options, valueCache) => {
//     valueCache = valueCache || {};
//     options.map(option => {
//       if (!valueCache[option.value]) {
//         valueCache[option.value] = option;
//       }

//       if (option.children && option.children.length > 0) {
//         collectValue(option.children, valueCache);
//       }

//       option.children &&
//         option.children.length &&
//         option.children.push({
//           value: Math.random(),
//           label: Math.random(),
//           placeholder: true
//         });
//     });

//     return valueCache;
//   };

export const getSecondLevel = (firstLevel:any, secondLevel:any, carTypeListBack:any) => {
    secondLevel.forEach((item:any, index:any) => {
        if (item.children && item.children.length > 0) {
            getThirdLevel(firstLevel, item, item.children, carTypeListBack);
        } else {
            carTypeListBack.push({
                carBrandId: firstLevel.value.split(',')[0],
                carBrandName: firstLevel.label,
                carSeriesId: item.value.split(',')[1],
                carSeriesName: item.label
            });
        }
    });
    return carTypeListBack;
};

// tslint:disable-next-line:max-line-length
export const getThirdLevel = (firstLevel:any, secondLevel:any, thirdLevel:any, carTypeListBack:any) => {
    thirdLevel.forEach((item:any, index:any) => {
        if (item.children && item.children.length > 0) {
            getForthLevel(firstLevel, secondLevel, item, item.children, carTypeListBack);
        } else {
            carTypeListBack.push({
                carBrandId: firstLevel.value.split(',')[0],
                carBrandName: firstLevel.label,
                carSeriesId: secondLevel.value.split(',')[1],
                carSeriesName: secondLevel.label,
                carCategoryCode: item.value.split(',')[1],
                carCategoryName: item.label
            });
        }
    });
    return carTypeListBack;
};

// tslint:disable-next-line:max-line-length
export const getForthLevel = (firstLevel:any, secondLevel:any, thirdLevel:any, forthLevel:any, carTypeListBack:any) => {
    forthLevel.forEach((item:any, index:any) => {
        carTypeListBack.push({
            carBrandId: firstLevel.value.split(',')[0],
            carBrandName: firstLevel.label,
            carSeriesId: secondLevel.value.split(',')[1],
            carSeriesName: secondLevel.label,
            carCategoryCode: thirdLevel.value.split(',')[1],
            carCategoryName: thirdLevel.label,
            carModelId: item.value.split(',')[1],
            carModelName: item.label
        });
    });
    return carTypeListBack;
};
export const getTwoLevel = (firstLevel:any, secondLevel:any, carTypeListBack:any) => {
    secondLevel.forEach((item:any, index:any) => {
        if (item.children && item.children.length > 0) {
            getThreeLevel(firstLevel, item, item.children, carTypeListBack);
        } else {
            carTypeListBack.push({
                carBrandId: firstLevel.value,
                carBrandName: firstLevel.label,
                carSeriesId: item.value,
                carSeriesName: item.label
            });
        }
    });
    return carTypeListBack;
};

// tslint:disable-next-line:max-line-length
export const getThreeLevel = (firstLevel:any, secondLevel:any, thirdLevel:any, carTypeListBack:any) => {
    thirdLevel.forEach((item:any, index:any) => {
        if (item.children && item.children.length > 0) {
            getFourLevel(firstLevel, secondLevel, item, item.children, carTypeListBack);
        } else {
            carTypeListBack.push({
                carBrandId: firstLevel.value,
                carBrandName: firstLevel.label,
                carSeriesId: secondLevel.value,
                carSeriesName: secondLevel.label,
                carCategoryCode: item.value,
                carCategoryName: item.label
            });
        }
    });
    return carTypeListBack;
};

// tslint:disable-next-line:max-line-length
export const getFourLevel = (firstLevel:any, secondLevel:any, thirdLevel:any, forthLevel:any, carTypeListBack:any) => {
    forthLevel.forEach((item:any, index:any) => {
        carTypeListBack.push({
            carBrandId: firstLevel.value,
            carBrandName: firstLevel.label,
            carSeriesId: secondLevel.value,
            carSeriesName: secondLevel.label,
            carCategoryCode: thirdLevel.value,
            carCategoryName: thirdLevel.label,
            carModelId: item.value,
            carModelName: item.label
        });
    });
    return carTypeListBack;
};
export const getList = (data:any) => {
    const _data:any = [];
    data.forEach((item:any, index:any) => {
        if (item.children && item.children.length > 0) {
            _data.push({
                label: item.name,
                value: item.id,
                children: getList(item.children)
            });
        } else {
            _data.push({
                label: item.name,
                value: item.id
            });
        }
    });
    return _data;
};
export const GetCarJson = (args:any) => {
    const obj = { ...args };
    const valueListTree = obj[1].valueListTree;
    const carTypeListBack: any[] = [];
    const carDataVos: any[] = [];
    if (
        valueListTree &&
        valueListTree.length > 0 &&
        obj[0] &&
        obj[0].length > 0
      ) {
        valueListTree.forEach((item: any, index: number) => {
          if (item.children && item.children.length > 0) {
            getSecondLevel(item, item.children, carTypeListBack);
          } else {
            carDataVos.push({
              carBrandId: item.value,
              carBrandName: item.label,
            });
          }
        });
      }
      return carDataVos.concat(carTypeListBack);
};
