import React from 'react';
import { Modal } from 'antd';

import SoCascaderMulti from '@souche-ui/so-cascader-multi';
import { querySpecialMdmCarModelTreeVoTree, queryMdmCarModelNew } from '@/services';

const headerMap = ['车系','车款','车型']

const requestConfig = [
    // {
    //   url: '//webc.souche.com/car-model/series/getSeriesByBrand.jsonp',
    //   params: 'brandCode',
    //   resultField: ['code', 'name']
    // },
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

  export default class SoCarNoBrand extends React.Component {
    static defaultProps = {
        disabled: false,
        allowClear: false,
        vehicleRange: ['SOUCHE'],
        searchPlaceholder: '',
        data:{
            brandCode: "brand-15",
            brandName: "奥迪"
        }
      };
      state = {
        options: [],
        valueEntities: {}
      };
      componentDidMount() {
        this._requestBrand();
      }
      _requestBrand() {
        let valueEntities = {}
        if (this.props.showAll) {
            valueEntities = this.state.valueEntities;
          } else {
            valueEntities = this.props.valueEntities;
          }
        let axiso = this.props.showAll ? queryMdmCarModelNew : querySpecialMdmCarModelTreeVoTree
        axiso({brandCode:this.props.data.brandCode,seriesCode: '', categoryCode: '' }).then(res=>{
            if(res.length > 0 ) {
                let options = res.map((obj, index) => {
                    const _obj = {
                      ...obj,
                      label: obj.name,
                      value: obj.code,
                      isLeaf: false
                    };
                    if (
                      valueEntities &&
                      valueEntities[obj.code] && valueEntities[obj.code].children) {
                      _obj.children = valueEntities[obj.code].children;
                      _obj.tempPlace = true;
                    }
                    return _obj;
                  });
                  this.setState({
                    options
                  });
            }
        })
      }
      loadData = selectedOptions => {
        const selectedOptionsLen = selectedOptions.length;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const { valueEntities } = this.state;
        const nowRequest = requestConfig[selectedOptionsLen - 1];
        let reqParams = {};
        requestConfig.map((item, index) => {
          if (selectedOptions[index]) {
            reqParams[item.params] = selectedOptions[index].value;
          } else {
            reqParams[item.params] = '';
          }
        });
        reqParams.brandCode = this.props.data.brandCode
        let axiso = this.props.showAll ? queryMdmCarModelNew : querySpecialMdmCarModelTreeVoTree
        axiso(reqParams).then(res=>{
            if (res.length <= 0) {
                return
            }
            targetOption.loading = false;
            let child = [];
            res.map((obj,index)=>{
                child[index] = {}
                child[index].label = obj[nowRequest.resultField[1]];
                child[index].value = obj[nowRequest.resultField[0]];
            if (selectedOptionsLen + 1 === 3) {
                // 是否需要加载第三级数据
                child[index].isLeaf = true;
              } else {
                child[index].isLeaf = false;
              }
            })
            
              console.log(child)
              targetOption.children = child;
              delete targetOption.tempPlace;
        
              this.setState({ options: [...this.state.options] });
        }).catch(e=>{
            Modal.error({ title: 'Error', content: e });
      
          });
      }
      // 深拷贝
      deepCopy = (obj) => {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {  // eslint-disable-line
                if (typeof obj[key] === 'object') {
                    result[key] = this.deepCopy(obj[key]); //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }
      onChange = (...res) => {
        let valueListTree = this.deepCopy(res[1].valueListTree)
        let data = [{
            label:this.props.data.brandName,
            value:this.props.data.brandCode,
            children:valueListTree
        }]
        res[1].valueListTree = data
        this.props.onChange(...res)
      }
      render() {
        const { options } = this.state;
        const { searchPlaceholder, ...otherProps } = this.props;
          return (
              <SoCascaderMulti
              {...otherProps}
                options={options}
                onChange={this.onChange}
                placeholder={searchPlaceholder}
                loadData={this.loadData}
                headers={headerMap
                }
                maxTagCount={10}
              />
          )
      }
  }