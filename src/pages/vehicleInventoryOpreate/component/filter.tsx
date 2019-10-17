import React from 'react';
import { connect } from '@souche-f2e/muji';
import {
  Select,
  Input,
  DatePicker,
  Form,
  Row,
  Col,
} from 'so-ui-react';
import { IRootState, dispatch } from '@@/store';
import styled from 'styled-components';
import moment from 'moment';
const Root = styled.div`
  span.so-date-editor {
    width: 100%;
  }
  .so-date-editor.so-input {
    width: 100%;
  }
`;

const mapStateToProps = (rootState: IRootState) => {
  return {
    vehicleInventoryOpreate: rootState.vehicleInventoryOpreate,
    auth: rootState.auth,
  };
};
type IProps = {
  onForm:(any:any) => void;
  type:string;
} & ReturnType<typeof mapStateToProps>;
type IState = {
  searchForm: any;
  defaultValueList: any[];
  orgId: string | undefined;
  tentantId: string | undefined;
  stockOutDate: any;
  cusNo:string;
};

const iniateForm = {
  bizOrderTypeId: '',
  bizOrderTypeCode: '',
  bizOrderTypeName: '',
  deptId: '',
  deptName: '',
  dets: [],
  stockGoodsTypeCode: '',
};

const { Option } = Select;
const FormItem = Form.Item;

@connect(mapStateToProps)
class SearchForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchForm: iniateForm,
      defaultValueList: [],
      tentantId: '',
      orgId: '',
      stockOutDate: null,
      cusNo:''
    };
  }
  componentDidMount = () => {
    const { auth, onForm } = this.props;
    const { searchForm } = this.state;
    const form: any = this.refs.form;
    const obj:any = {};
    onForm(form);
    const date = moment(new Date()).format('YYYY-MM-DD');
    obj.stockGoodsTypeCode = '10800000';
    obj.stockDate = date;
    const newForm = {
      ...searchForm,
      ...obj
    };
    this.setState({
      tentantId: auth.tentantId,
      orgId: auth.orgId,
      searchForm: newForm,
      stockOutDate: new Date(date),
    });
    dispatch.vehicleInventoryOpreate.SAVE({
      opreateSearchForm: newForm,
    });
  }
  disabledDate = (time?: any) => {
    return time.getTime() > Date.now();
  }
  selectChange = (types: string, value: any, Option: any) => {
    const { searchForm } = this.state;
    const { type } = this.props;
    const obj: any = {};
    switch (types) {
      case 'bizOrderTypeCode':
        obj.bizOrderTypeId = Option ? Option.props.data : '';
        obj.bizOrderTypeCode = value;
        obj.bizOrderTypeName = Option ? Option.props.label : '';
        break;
      case 'cusNo':
        if (type === 'vehicleOut') {
          obj.cusNo = Option ? Option.props.data : '';
          obj.cusId = value;
          obj.cusName = Option ? Option.props.label : '';
        }else {
          obj.supplierId = Option ? Option.props.data : '';
          obj.supplierNo = value;
          obj.supplierName = Option ? Option.props.label : '';
        }
        this.setState({
          cusNo: value
        });
        break;
      case 'deptId':
        obj.deptName = Option ? Option.props.label : '';
        obj.deptId = value;
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
    dispatch.vehicleInventoryOpreate.SAVE({
      opreateSearchForm: newForm,
    });
  }
  dateChange = (date?: any) => {
    const { searchForm } = this.state;
    const { type } = this.props;
    const obj:any = {};
    if (type === 'vehicleOut') {
      obj.stockDate = date ? moment(date).format('YYYY-MM-DD') : '';
    }else {
      obj.stockDate = date ? moment(date).format('YYYY-MM-DD') : '';
    }
    const newForm = {
      ...searchForm,
      ...obj
    };
    this.setState({
      searchForm: newForm,
      stockOutDate: date,
    });
    dispatch.vehicleInventoryOpreate.SAVE({
      opreateSearchForm: newForm,
    });
  }
  typeChange = (types: string, value: any) => {
    const { orgId, tentantId } = this.state;
    const { type } = this.props;
    const obj: any = {};
    switch (types) {
      case 'cusNo':
        obj.tentantId = tentantId;
        obj.orgId = orgId;
        if (type === 'vehicleOut') {
          obj.groupInterCustomer = '1',
          obj.keyWord = value;
          dispatch.vehicleInventoryOpreate.getcusNoList(obj);
        } else {
          obj.tentAndOrg = '1';
          dispatch.vehicleInventoryOpreate.getsupplierList(obj);
        }
        break;
      case 'deptId':
        dispatch.vehicleInventoryOpreate.getDepartmentList();
        break;
      default:
        break;
    }
  }
  render() {
    const {
      vehicleInventoryOpreate: {
        businessAjustmentList,
        cusNoList,
        departmentList,
        totalAmount,
        supplierList,
      },
      type
    } = this.props;
    const {
      searchForm: { bizOrderTypeCode, deptId },
      stockOutDate,
      cusNo
    } = this.state;
    const form = {
      bizOrderTypeCode,
      cusNo,
      deptId,
    };
    const rules = {
      bizOrderTypeCode: [
        { required: true, message: '请选择业务类型！', trigger: 'change' },
      ],
      cusNo: [
        { required: true, message: type === 'vehicleOut' ? '请选择客户姓名' : '请选择供应商', trigger: 'change' },
      ],
      deptId: [{ required: true, message: '请选择部门！', trigger: 'change' }],
    };
    const businessAjustment = Array.isArray(businessAjustmentList) && businessAjustmentList.length > 0 ? businessAjustmentList.map(
      (item: any, index: number) => {
        return (
          <Option
            key={index}
            label={item.dicValue}
            value={item.dicCode}
            data={item.id}
          />
        );
      }
    ) : null;
    const cusNos = Array.isArray(cusNoList) && cusNoList.length > 0 ? cusNoList.map((item: any, index: number) => {
      return (
        <Option
          key={index}
          label={item.cusName}
          value={item.cusId}
          data={item.cusNo}
        />
      );
    }) : null;
    const suppliers = Array.isArray(supplierList) && supplierList.length > 0 ? supplierList.map((item: any, index: number) => {
      return (
        <Option
          key={index}
          label={item.supplierName}
          value={item.supplierCode}
          data={item.supplierId}
        />
      );
    }) : null;
    const departments = Array.isArray(departmentList) && departmentList.length > 0 ? departmentList.map((item: any, index: number) => {
      return <Option key={index} label={item.deptName} value={item.id} />;
    }) : null;
    return (
      <div>
        <Form
          labelWidth={'150px'}
          // tslint:disable-next-line:jsx-no-string-ref
          ref='form'
          model={form}
          rules={rules}
        >
          <Row gutter={12}>
            <Col span={8}>
              <FormItem label='成本调整单号'>
                <Input style={{ width: '100%' }} value={''} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='调整类型'>
                <Input
                  style={{ width: '100%' }}
                  value={type === 'vehicleOut' ? '出库成本调整' : '入库成本调整'}
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='业务调整分类' prop='bizOrderTypeCode'>
                <Select
                  style={{ width: '100%' }}
                  value={bizOrderTypeCode}
                  clearable={true}
                  onChange={this.selectChange.bind(this, 'bizOrderTypeCode')}
                >
                  {businessAjustment}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <FormItem label={type === 'vehicleOut' ? '客户' : '供应商'} prop='cusNo'>
                <Select
                  style={{ width: '100%' }}
                  value={cusNo}
                  filterable={true}
                  onChange={this.selectChange.bind(this, 'cusNo')}
                  onType={this.typeChange.bind(this, 'cusNo')}
                  clearable={true}
                >
                  {type === 'vehicleOut' ? cusNos : suppliers}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='调整总金额'>
                <Input style={{ width: '100%' }} value={totalAmount} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='调整时间'>
                <Root>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={stockOutDate}
                    disabledDate={this.disabledDate}
                    onChange={this.dateChange}
                    clearable={false}
                  />
                </Root>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12} type='flex' justify='space-between'>
            <Col span={8}>
              <FormItem label='调整部门' prop='deptId'>
                <Select
                  style={{ width: '100%' }}
                  value={deptId}
                  filterable={true}
                  clearable={true}
                  onChange={this.selectChange.bind(this, 'deptId')}
                  onType={this.typeChange.bind(this, 'deptId')}
                >
                  {departments}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default SearchForm;
