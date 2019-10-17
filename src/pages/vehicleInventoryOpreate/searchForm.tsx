import React, { ReactNode } from 'react';
import { connect } from '@souche-f2e/muji';
import { getTwoLevel } from '@/shared/utils';
import { SoCarPicker, SearchFormRender } from '@/components';
import { Select, Input } from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import { ASearchForm } from '@/shared/types';

const mapStateToProps = (rootState: IRootState) => {
  return {
    vehicleInventoryOpreate: rootState.vehicleInventoryOpreate,
  };
};
type IProps = {} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: ASearchForm;
  defaultValueList: any[];
};

const iniateForm = {
  page: 1,
  pageSize: 50,
  goodsNo: '',
  costDomainCode: '',
  goodsCategoryList: [],
  stockGoodsTypeCode: '',
};

const { Option } = Select;

@connect(mapStateToProps)
class SearchForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchForm: iniateForm,
      defaultValueList: [],
    };
  }
  componentDidMount = () => {
    this.queryData();
  }
  onCarChange = (...args: any) => {
    const { searchForm } = this.state;
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
          getTwoLevel(item, item.children, carTypeListBack);
        } else {
          carDataVos.push({
            goodsL1CategoryCode: item.value,
          });
        }
      });
      const tempArr: any[] = [];
      if (carTypeListBack.length > 0) {
        carTypeListBack.forEach((item: any) => {
          const tempObj = {
            goodsL1CategoryCode: item.carBrandId,
            goodsL2CategoryCode: item.carSeriesId,
            goodsL3CategoryCode: item.carCategoryCode,
            goodsL4CategoryCode: item.carModelId,
          };
          tempArr.push(tempObj);
        });
      }

      const data = {
        ...searchForm,
        goodsCategoryList: carDataVos.concat(tempArr),
      };
      this.setState({
        searchForm: data,
        defaultValueList: obj[0],
      });
    } else {
      const data = {
        ...searchForm,
        goodsCategoryList:[],
      };
      this.setState({
        searchForm: data,
        defaultValueList: [],
      });
    }
  }
  queryData = () => {
    const { searchForm } = this.state;
    const newForm = {
      ...searchForm,
      stockGoodsTypeCode: '10800000',
    };
    this.setState({
      searchForm: newForm,
    });
    dispatch.vehicleInventoryOpreate.queryDataList({
      ...newForm,
      page: 1,
    });
  }
  selectChange = (value: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    obj.costDomainCode = value;
    const newForm = {
      ...searchForm,
      ...obj,
    };
    this.setState({
      searchForm: newForm,
    });
  }
  inputChange = (value: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    obj.goodsNo = value;
    const newForm = {
      ...searchForm,
      ...obj,
    };
    this.setState({
      searchForm: newForm,
    });
  }
  reset = () => {
    this.setState(
      {
        searchForm: iniateForm,
        defaultValueList:[],
      },
      () => {
        this.queryData();
      }
    );
  }
  render() {
    const {
      vehicleInventoryOpreate: { isQueryLoading, wareHouseList },
    } = this.props;
    const {
      searchForm: { goodsNo, costDomainCode },
      defaultValueList,
    } = this.state;
    const wareHouse = Array.isArray(wareHouseList) && wareHouseList.length > 0 ? wareHouseList.map((item: any, index: number) => {
      return (
        <Option
          key={item.id}
          label={item.basText}
          value={item.basCode}
        />
      );
    }) : null;
    const renderSearchForm: ReactNode = SearchFormRender([
      {
        span: '车架号',
        component: (
          <Input
            style={{ width: '100%' }}
            value={goodsNo}
            onChange={this.inputChange}
          />
        ),
      },
      {
        span: '车型',
        component: (
          <SoCarPicker
            allowClear
            multiple
            showCheckedStrategy={'SHOW_PARENT'}
            level={4}
            onChange={this.onCarChange}
            showAll={false}
            style={{ width: '100%', maxHeight:'80px', overflow: 'auto' }}
            value={defaultValueList}
          />
        ),
      },
      {
        span: '成本域',
        component: (
          <Select
            style={{ width: '100%' }}
            onChange={this.selectChange}
            value={costDomainCode}
            clearable={true}
          >
            {wareHouse}
          </Select>
        ),
      },
    ])(this.reset)(this.queryData)(isQueryLoading)([]);
    return (
      <div>
        <div>{renderSearchForm}</div>
      </div>
    );
  }
}
export default SearchForm;
