import React, { ReactNode } from 'react';
import { connect } from '@souche-f2e/muji';
import { SearchFormRender } from '@/components';
import { Select, Input } from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import { BSearchForm } from '@/shared/types';

const mapStateToProps = (rootState: IRootState) => {
  return {
    commodityInventoryCost: rootState.commodityInventoryCost,
    auth: rootState.auth,
  };
};
type IProps = {} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: BSearchForm;
  goodsFilter: any;
  goodsChoose:any;
  isTwo: boolean;
  isThree: boolean;
};

const iniateForm = {
  page: 1,
  pageSize: 50,
  goodsNo: '',
  goodsName: '',
  costDomainCode: '',
  goodsCategoryList: [],
  stockGoodsTypeCode: '',
};

const iniateFilter = {
  levelOneCategoryId: '',
  levelSecondCategoryId: '',
  levelThreeCategoryId: '',
  tentantId: '',
};

const { Option } = Select;

@connect(mapStateToProps)
class SearchForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchForm: iniateForm,
      goodsFilter: iniateFilter,
      isTwo: true,
      isThree: true,
      goodsChoose:{
        goodsL1CategoryCode:'',
        goodsL2CategoryCode:'',
        goodsL3CategoryCode:'',
      }
    };
  }
  componentDidMount = () => {
    const { auth } = this.props;
    const { goodsFilter } = this.state;
    const obj = {
      ...goodsFilter,
      tentantId: auth.tentantId,
    };
    this.setState(
      {
        goodsFilter: obj,
      },
      () => {
        dispatch.commodityInventoryCost.getStockMstrInfo(obj);
      }
    );
    this.queryData();
  }
  queryData = () => {
    const { searchForm } = this.state;
    const newForm = {
      ...searchForm,
      stockGoodsTypeCode: '10800005',
    };
    this.setState({
      searchForm: newForm,
    });
    dispatch.commodityInventoryCost.queryDataList({
      ...newForm,
      page: 1,
    });
  }
  selectChange = (type: string, value: any, Option:any) => {
    const { searchForm, goodsFilter, goodsChoose } = this.state;
    const obj: any = {};
    const jbo: any = {};
    let tempObj: any = {};
    const arr: any[] = [];
    console.log(Option);
    switch (type) {
      case 'levelOneCategoryId':
        obj.levelOneCategoryId = value;
        obj.levelSecondCategoryId = '';
        obj.levelThreeCategoryId = '';
        jbo.goodsL1CategoryCode = Option ? Option.props.data : '';
        jbo.goodsL2CategoryCode = '';
        jbo.goodsL3CategoryCode = '';
        if (value) {
          this.setState({
            isTwo: false,
          });
        } else {
          this.setState({
            isTwo: true,
            isThree: true,
          });
        }
        break;
      case 'levelSecondCategoryId':
        obj.levelSecondCategoryId = value;
        obj.levelThreeCategoryId = '';
        jbo.goodsL2CategoryCode = Option ? Option.props.data : '';
        jbo.goodsL3CategoryCode = '';
        if (value) {
          this.setState({
            isThree: false,
          });
        } else {
          this.setState({
            isThree: true,
          });
        }
        break;
      case 'levelThreeCategoryId':
        obj.levelThreeCategoryId = value;
        jbo.goodsL3CategoryCode = Option ? Option.props.data : '';
        break;
      default:
        break;
    }
    tempObj = {
      ...goodsFilter,
      ...obj,
    };
    const newObj = {
      ...goodsChoose,
      ...jbo
    };
    arr.push(newObj);
    if (value) {
      dispatch.commodityInventoryCost.getStockMstrInfo(tempObj);
    }
    this.setState({
      goodsFilter: tempObj,
      searchForm: {
        ...searchForm,
        goodsCategoryList: arr,
      },
      goodsChoose:newObj
    });
  }
  select = (value: string) => {
    const { searchForm } = this.state;
    const temp = {
      ...searchForm,
      costDomainCode: value,
    };
    this.setState({
      searchForm: temp,
    });
  }
  inputChange = (type: string, value: any) => {
    const { searchForm } = this.state;
    const obj: any = {};
    switch (type) {
      case 'goodsNo':
        obj.goodsNo = value;
        break;
      case 'goodsName':
        obj.goodsName = value;
        break;
      default:
        break;
    }
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
        goodsFilter: iniateFilter,
        isTwo: true,
        isThree: true,
      },
      () => {
        this.queryData();
        dispatch.commodityInventoryCost.SAVE({
          goodsL2List: [],
          goodsL3List: [],
        });
      }
    );
  }
  render() {
    const {
      commodityInventoryCost: {
        isQueryLoading,
        wareHouseLists,
        goodsL1List,
        goodsL2List,
        goodsL3List,
      },
    } = this.props;
    const {
      searchForm: { goodsNo, goodsName, costDomainCode },
      goodsFilter: {
        levelOneCategoryId,
        levelSecondCategoryId,
        levelThreeCategoryId,
      },
      isTwo,
      isThree,
    } = this.state;
    const wareHouse =
      Array.isArray(wareHouseLists) && wareHouseLists.length > 0
        ? wareHouseLists.map((item: any, index: number) => {
            return (
              <Option key={item.id} label={item.basText} value={item.basCode} />
            );
          })
        : null;
    const goodsL1s =
      Array.isArray(goodsL1List) && goodsL1List.length > 0
        ? goodsL1List.map((item: any, index:number) => {
            return (
              <Option key={index} data={item.categoryCode} label={item.categoryName} value={item.id} />
            );
          })
        : null;
    const goodsL2s =
      Array.isArray(goodsL2List) && goodsL2List.length > 0
        ? goodsL2List.map((item: any, index:number) => {
            return (
              <Option key={index} data={item.categoryCode} label={item.categoryName} value={item.id} />
            );
          })
        : null;
    const goodsL3s =
      Array.isArray(goodsL3List) && goodsL3List.length > 0
        ? goodsL3List.map((item: any, index:number) => {
            return (
              <Option key={index} data={item.categoryCode} label={item.categoryName} value={item.id} />
            );
          })
        : null;
    const renderSearchForm: ReactNode = SearchFormRender([
      {
        span: '商品编码',
        component: (
          <Input
            style={{ width: '100%' }}
            value={goodsNo}
            onChange={this.inputChange.bind(this, 'goodsNo')}
          />
        ),
      },
      {
        span: '商品名称',
        component: (
          <Input
            style={{ width: '100%' }}
            value={goodsName}
            onChange={this.inputChange.bind(this, 'goodsName')}
          />
        ),
      },
      {
        span: '商品一级类别',
        component: (
          <Select
            style={{ width: '100%' }}
            value={levelOneCategoryId}
            clearable={true}
            onChange={this.selectChange.bind(this, 'levelOneCategoryId')}
          >
            {goodsL1s}
          </Select>
        ),
      },
      {
        span: '商品二级类别',
        component: (
          <Select
            style={{ width: '100%' }}
            value={levelSecondCategoryId}
            disabled={isTwo}
            clearable={true}
            onChange={this.selectChange.bind(this, 'levelSecondCategoryId')}
          >
            {goodsL2s}
          </Select>
        ),
      },
      {
        span: '商品三级类别',
        component: (
          <Select
            style={{ width: '100%' }}
            value={levelThreeCategoryId}
            disabled={isThree}
            clearable={true}
            onChange={this.selectChange.bind(this, 'levelThreeCategoryId')}
          >
            {goodsL3s}
          </Select>
        ),
      },
      {
        span: '成本域',
        component: (
          <Select
            style={{ width: '100%' }}
            onChange={this.select}
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
