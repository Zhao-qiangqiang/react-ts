import React from 'react';
import { Modal } from 'antd';

import SoCarNoBrand from '../SoCarNoBrand';
import SoCascaderMulti from '@souche-ui/so-cascader-multi';
import { querySpecialMdmCarModelTreeVoTree, queryMdmCarModelNew } from '@/services';

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
  4: [{ title: '品牌', navField: 'initialsLetter' }, '车系', '车款', '车型']
};

const requestConfig = [
  {
    url: '//webc.souche.com/car-model/series/getSeriesByBrand.jsonp',
    params: 'brandCode',
    resultField: ['code', 'name']
  },
  {
    url: '//webc.souche.com/car-model/api/model/get.jsonp',
    params: 'seriesCode',
    resultField: ['code', 'name']
  },
  {
    url: '//webc.souche.com/car-model/api/model/get.jsonp',
    params: 'categoryCode',
    resultField: ['code', 'name']
  }
];

let manufacturer_code = '';

export default class SoCarModelsSelect extends React.Component {
  static defaultProps = {
    disabled: false,
    allowClear: false,
    vehicleRange: ['SOUCHE'],
    searchPlaceholder: '',
    BrandNoShow:true,//单品牌只显示车系
  };

  state = {
    options: [],
    valueEntities: {},
    showThree:false
  };

  componentDidMount() {
    if(!this.props.showAll){
      this._requestBrand();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.valueEntities && !nextProps.qubie && nextProps.showAll) {
      this.setState({
        valueEntities: nextProps.valueEntities || {}
      }, () => {
        this._requestBrand()
      })
    }
  }

  _requestBrand() {
    let valueEntities = {}
    if (this.props.showAll) {
      valueEntities = this.state.valueEntities;
    } else {
      valueEntities = this.props.valueEntities;
    }

    // let initialRequestURL = '//webc.souche.com/car-model/brand/brands.jsonp';
    // let requestParams = queryString.stringify({
    //   sites: vehicleRange.join(',')
    //   // code: carBrandId,
    // });
    let axiso = this.props.showAll ? queryMdmCarModelNew : querySpecialMdmCarModelTreeVoTree

    axiso({ brandCode: '', seriesCode: '', categoryCode: '' }).then(res => {
      if (res.length > 1&&this.props.BrandNoShow || res.length>0&&!this.props.BrandNoShow) {
        let options = res.map((obj, index) => {
          const _obj = {
            ...obj,
            label: obj.name,
            value: obj.code,
            isLeaf: false
            // disabled: true,
            // disableCheckbox: true,
          };
          // if (valueEntities && valueEntities.length > 0) {
          if (
            valueEntities &&
            valueEntities[obj.code] && valueEntities[obj.code].children) {
            _obj.children = valueEntities[obj.code].children;
            _obj.tempPlace = true;
          }
          // }
          return _obj;
        });

        this.setState({
          options
        });
      }else if (res.length === 1&&this.props.BrandNoShow) {
        this.setState({
          showThree:true,
          brand:{
            brandCode:res[0].code,
            brandName:res[0].name
          }
        })
      }
    });
    // jsonp(`${initialRequestURL}?${requestParams}`, (err, resp) => {
    //   if (err) {
    //     Modal.error({ title: 'Error', content: err });
    //     console.log(err);
    //   }
    // });
  }

  loadData = selectedOptions => {
    const selectedOptionsLen = selectedOptions.length;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // const { vehicleRange, valueEntities } = this.props;
    const { valueEntities } = this.state;

    const nowRequest = requestConfig[selectedOptionsLen - 1];
    /**
     * brandCode 品牌
     * seriesCode 车系
     * categoryCode 车款
     */
    let reqParams = {};
    requestConfig.map((item, index) => {
      if (selectedOptions[index]) {
        reqParams[item.params] = selectedOptions[index].value;
      } else {
        reqParams[item.params] = '';
      }
    });

    // let requestURL = nowRequest.url;
    // let requestParams = queryString.stringify({
    //   [nowRequest.params]: targetOption.value,
    //   sites: vehicleRange.join(','),
    //   manufacturer_code: manufacturer_code
    // });

    // if (selectedOptionsLen.tempPlace) {
    //   delete selectedOptionsLen.children;
    // }

    // this.setState({ options: [...this.state.options] });

    // setTimeout(() => {
    let axiso = this.props.showAll ? queryMdmCarModelNew : querySpecialMdmCarModelTreeVoTree

    axiso(reqParams).then(res => {
      if (res.length <=0) {
        // Modal.error({ title: 'Error', content: "出错了" });
        // console.log(err);
        return;
      }

      targetOption.loading = false;

      let child = [];
      res.map((obj, index) => {
        child[index] = {};
        child[index].label = obj[nowRequest.resultField[1]];
        child[index].value = obj[nowRequest.resultField[0]];

        // 车系的禁止选项
        if (this.props.disabledCarSeriesCodes && this.props.level === 2) {
          this.props.disabledCarSeriesCodes.forEach(item => {
            if (item === obj[nowRequest.resultField[0]]) {
              child[index].disabled = true;
            }
          });
        }

        // // 车型的禁止选项
        // if (this.props.disabledCarModelCodes && this.props.level === 3) {
        //   this.props.disabledCarModelCodes.map(item => {
        //     if (item === obj[nowRequest.resultField[0]]) {
        //       child[index].disabled = true;
        //     }
        //   });
        // }
        // 车型的禁止选项，原来是3级，现在变为4级
        if (this.props.disabledCarModelCodes && this.props.level === 4) {
          this.props.disabledCarModelCodes.map(item => {
            if (item === obj[nowRequest.resultField[0]]) {
              child[index].disabled = true;
            }
          });
        }
        // if (valueEntities && valueEntities.length > 0) {
        if (
          valueEntities &&
          valueEntities[obj[nowRequest.resultField[0]]] &&
          valueEntities[obj[nowRequest.resultField[0]]].children
        ) {
          child[index].children = valueEntities[obj[nowRequest.resultField[0]]].children;
          child[index].tempPlace = true;
        }
        // }

        if (selectedOptionsLen + 1 === this.props.level) {
          // 是否需要加载第三级数据
          child[index].isLeaf = true;
        } else {
          child[index].isLeaf = false;
        }
      });

      targetOption.children = child;
      delete targetOption.tempPlace;

      this.setState({ options: [...this.state.options] });
    }).catch(e=>{
      Modal.error({ title: 'Error', content: e });

    });
    // }, 2000);
  };

  render() {
    const { options } = this.state;
    const { level, searchPlaceholder, ...otherProps } = this.props;
    // console.log(options);
    return (
      // <SoCascaderMulti
      //   // style={{ width: 500, maxHeight: 100, overflow: 'auto' }}
      //   {...otherProps}
      //   options={options}
      //   placeholder={searchPlaceholder}
      //   loadData={this.loadData}
      //   headers={headerMap[level] ? headerMap[level] : []}
      // />
      <div style={this.props.style}>
        {this.state.showThree?(
          <SoCarNoBrand
          {...otherProps}
          style={{width:'100%'}}
          data={this.state.brand}
          />
        ):(
          <SoCascaderMulti
          // style={{ width: 500, maxHeight: 100, overflow: 'auto' }}
          {...otherProps}
          style={{width:'100%'}}
          options={options}
          placeholder={searchPlaceholder}
          loadData={this.loadData}
          headers={headerMap[level] ? headerMap[level] : []}
          maxTagCount={10}
        />
        )}
      </div>
    );
  }
}
