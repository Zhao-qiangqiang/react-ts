import React from 'react';
import { Modal } from 'antd';

// import SoCascaderMulti from '../SoCascaderMulti';
import SoCascaderMulti from '@souche-ui/so-cascader-multi';
import { getStockMstrInfo } from '@/services';
import { dispatch } from '@@/store';

const headerMap = {
  // 1: [{ title: '品牌', navField: 'initialsLetter' }],
  // 2: ['车系', '车型'],
  // 3: [{ title: '品牌', navField: 'initialsLetter' }, '车系', '车型']
  // 1: ['品牌'],
  // 2: ['品牌', '车系'],
  // 3: ['品牌', '车系', '车款'],
  // 4: ['品牌', '车系', '车款', '车型']
  1: [{ title: '品牌', navField: 'initialsLetter' }],
  2: ['品牌', '车系'],
  3: [{ title: '品牌', navField: 'initialsLetter' }, '车系', '车型'],
  4: [
    { title: '一级目录', navField: 'initialsLetter' },
    '二级目录',
    '三级目录',
    '四级目录',
  ],
};

const requestConfig = [
  {
    url: '//webc.souche.com/car-model/series/getSeriesByBrand.jsonp',
    params: 'brandCode',
    resultField: ['code', 'name'],
  },
  {
    url: '//webc.souche.com/car-model/api/model/get.jsonp',
    params: 'seriesCode',
    resultField: ['code', 'name'],
  },
  {
    url: '//webc.souche.com/car-model/api/model/get.jsonp',
    params: 'categoryCode',
    resultField: ['code', 'name'],
  },
];

let manufacturer_code = '';

export default class SoCarModelsSelect extends React.Component {
  static defaultProps = {
    disabled: false,
    allowClear: false,
    vehicleRange: ['SOUCHE'],
    searchPlaceholder: '',
  };

  state = {
    options: [],
    valueEntities: {},
    tentantId:''
  };

  componentDidMount() {
    this._requestBrand();
    dispatch.auth.fetchAuthInfo().then(res=>{
      this.setState({
        tentantId:res.tentantId
      })
    })
  }

  _requestBrand() {
    let valueEntities = this.props.valueEntities;
    let options = [];
    getStockMstrInfo({
      levelOneCategoryId: '',
      levelSecondCategoryId: '',
      levelThreeCategoryId: '',
    }).then((res) => {
       const {levelOneCategoryList} = res;

      if (Array.isArray(levelOneCategoryList) && levelOneCategoryList.length > 0) {
        levelOneCategoryList.map((obj, index) => {
          // 后台说需要前台过滤下  只要精品 备件
          if (this.props.isFilter) {
            if ((obj.categoryName == '精品' || obj.categoryName == '备件') ) {
              const _obj = {
                label: obj.categoryName,
                value: `${obj.id},${obj.categoryCode}`,
                isLeaf: false,
              };
              options.push(_obj);
            }
          }else{
            const _obj = {
              label: obj.categoryName,
              value: obj.id,
              isLeaf: false,
            };
            options.push(_obj);
          }
        });
        this.setState(
          {
            options,
          },
        );
      }
    });
  }

  loadData = (selectedOptions) => {
    const {tentantId} = this.state;
    const selectedOptionsLen = selectedOptions.length;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    let reqParams = {
      tentantId
    };

    switch (selectedOptionsLen) {
      case 1:
        reqParams.levelOneCategoryId = targetOption.value.split(',')[0];
        break;

      case 2:
        reqParams.levelOneCategoryId = selectedOptions[0].value;
        reqParams.levelSecondCategoryId = targetOption.value.split(',')[0];
        break;

      case 3:
        reqParams.levelOneCategoryId = selectedOptions[0].value;
        reqParams.levelSecondCategoryId = selectedOptions[1].value;
        reqParams.levelThreeCategoryId = targetOption.value.split(',')[0];
        break;

      default:
        break;
    }

    getStockMstrInfo(reqParams)
      .then((res) => {
        targetOption.loading = false;
        targetOption.children = [];
        let tempArr = [];
        switch (selectedOptionsLen) {
          case 1:
            tempArr = res.levelSecondCategoryList;
            break;
          case 2:
            tempArr = res.levelThreeCategoryList;
            break;
          case 3:
            tempArr = res.levelFourCategoryList;
            break;

          default:
            break;
        }
        tempArr.forEach((item) => {
          const obj = {
            value: `${item.id},${item.categoryCode}`,
            label: item.categoryName,
            isLeaf: selectedOptions.length == 3,
          };
          targetOption.children.push(obj);
        });
        this.setState({
          options: [...this.state.options],
        });
      })
      .catch((e) => {
        Modal.error({ title: 'Error', content: e });
      });
  };

  render() {
    const { options } = this.state;
    const { level, searchPlaceholder, ...otherProps } = this.props;
    return (
      <SoCascaderMulti
        // style={{ width: 500, maxHeight: 100, overflow: 'auto' }}
        {...otherProps}
        showCheckedStrategy={'SHOW_PARENT'}
        options={options}
        placeholder='全部'
        maxTagCount={10}
        loadData={this.loadData.bind(this)}
        headers={['一级目录', '二级目录', '三级目录', '四级目录']}
        // headers={headerMap[level] ? headerMap[level] : []}
      />
    );
  }
}
