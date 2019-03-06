import React, { PureComponent, Fragment } from 'react';
import { Table, Form, Button, Icon, Modal, Input, Row, Col, Popover, Upload, message, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import request from '../../request';

const FormItem = Form.Item;

class AA extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      custom: [],
      visible: false,
      initialvalue: undefined,
      searchText: '',
      loading: false,
      imageUrl: undefined,
    };
  }

  componentWillMount() {
    const _this = this;
    const options = {
      type: 'get',
      params: {},
    }
    request('/api/sign', options, (response) => _this.setState({ custom: response.data }), (error) => this.errors(error));
  }

  customRequest = (file) => {
    const _this = this;
    const formData = new FormData();
    formData.append('idcard', file.file);
    const options = {
      type: 'post',
      params: formData,
    }
    request('/api/upload', options, (response) => _this.setState({
      imageUrl: response.data,
      loading: false
    }), (error) => this.errors(error));
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJPG;
  }

  errors = (error) => {
    if (error.response.status === 500) {
      message.error('服务器错误!');
    } else if (error.response.status === 403 || error.response.status === 400) {
      message.error(error.response.data.message);
    } else if (error.response.status === 422) {
      const miderr = Object.values(error.response.data.errors);
      message.error(miderr);
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.customRequest(info.file.originFileObj);
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            搜索
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
        </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text && text.toString() || ''}
      />
    ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }


  handleSubmit = () => {
    const _this = this;
    const { getFieldsValue } = this.props.form;
    const { custom, imageUrl } = this.state;
    let params = getFieldsValue();
    if (imageUrl) {
      params = {
        ...params,
        idcard: imageUrl,
      };
    }
    const options = {
      type: 'patch',
      params,
    }

    function aass(response) {
      const midkey = [];
      custom.forEach(item => {
        if (item.openid === response.data.openid) {
          midkey.push(response.data);
        } else {
          midkey.push(item);
        }
      })
      _this.setState({ visible: false, custom: midkey });
    }

    request(`/api/sign/${params.openid}`, options, aass, (error) => this.errors(error));
  }

  handleModalVisible = () => {
    this.setState({ visible: false });
  }

  change = (RowData) => {
    const _this = this;
    _this.setState({ initialvalue: RowData, visible: true });
  }

  afterClose = () => {
    const _this = this;
    const { resetFields } = this.props.form;
    _this.setState({ initialvalue: undefined, imageUrl: undefined, loading: false });
    resetFields();
  }

  cleanAllData = () => {
    const _this = this;
    const options = {
      type: 'delete',
      params: {},
    };
    function deleteAlldata() {
      _this.setState({
        custom: [],
        visible: false,
        initialvalue: undefined,
        searchText: '',
        loading: false,
        imageUrl: undefined,
      })
    }
    request('/api/sign_clear ', options, deleteAlldata, (error) => this.errors(error));
  }

  render() {
    const { custom, visible, initialvalue, imageUrl } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '编号',
        dataIndex: 'number',
        ...this.getColumnSearchProps('number'),
      }, {
        title: '头像',
        dataIndex: 'avatar',
        render: key => {
          return (
            <div>
              <img style={{ width: 40 }} src={key} alt={key} />
            </div>
          )
        },
      }, {
        title: '姓名',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
      }, {
        title: '微信昵称',
        dataIndex: 'nickname',
        ...this.getColumnSearchProps('nickname'),

      }, {
        title: '手机号',
        dataIndex: 'mobile',
        ...this.getColumnSearchProps('mobile'),
      }, {
        title: '酒店名称',
        dataIndex: 'hotel_name',
        filters: [
          { value: '铂爵大酒店', text: '铂爵大酒店' },
          { value: '嘉悦酒店', text: '嘉悦酒店' },
          { value: '桐乡市美高大酒店', text: '桐乡市美高大酒店' },
          { value: '桐乡璞遇智慧酒店', text: '桐乡璞遇智慧酒店' },
        ],
      }, {
        title: '酒店房间号',
        dataIndex: 'hotel_num',
        ...this.getColumnSearchProps('hotel_num'),
      }, {
        title: '身份证',
        dataIndex: 'idcard',
        render: key => {
          const IMG = (<img style={{ maxWidth: 400, maxHeight: 600 }} src={key} alt={key} />)
          return !!key && (
            <Popover content={IMG}>
              <div>
                <img style={{ width: 40 }} src={key} alt={key} />
              </div>
            </Popover>
          )
        },
      }, {
        title: '操作',
        render: (RowData) => {
          return (
            <Fragment>
              <a onClick={() => this.change(RowData)}>修改</a>
            </Fragment>
          )

        }
      }];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const longFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const colSpan = { xs: 24, lg: 12 };
    const colS = { xs: 24, lg: 17 };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div>Upload</div>
      </div>
    );
    const clearButton = custom.length ? (
      <Popconfirm placement="top" title='确定要删除所有签到数据吗？' onConfirm={() => this.cleanAllData()} okText="是的，我就要" cancelText="算了算了">
        <Button >一键清除所有签到数据</Button>
      </Popconfirm>
    ) : '';
    return (
      <Fragment>
        {clearButton}
        <Table
          columns={columns}
          rowKey="id"
          dataSource={custom}
        />
        <Modal
          afterClose={this.afterClose}
          onCancel={this.handleModalVisible}
          title="修改信息"
          visible={visible}
          onOk={this.handleSubmit}
        >
          <Form>
            {getFieldDecorator('openid', {
              initialValue: { ...initialvalue }.openid || undefined,
            })(
              <Input type="hidden" />
            )}
            <Row>
              <Col {...colSpan}>
                <FormItem {...formItemLayout} label="姓名">{{ ...initialvalue }.name}</FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem {...formItemLayout} label="手机号">{{ ...initialvalue }.mobile}</FormItem>
              </Col>
            </Row>

            <Row>
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="编号">
                  {getFieldDecorator('number', {
                    initialValue: { ...initialvalue }.number || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="酒店名称">
                  {getFieldDecorator('hotel_name', {
                    initialValue: { ...initialvalue }.hotel_name || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="房间号">
                  {getFieldDecorator('hotel_num', {
                    initialValue: { ...initialvalue }.hotel_num || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="身份证">
                  {getFieldDecorator('idcard', {
                    initialValue: { ...initialvalue }.idcard || '',
                  })(
                    <Upload
                      name="idcard"
                      listType="picture-card"
                      customRequest={(file) => {
                        this.customRequest(file);
                      }}
                      showUploadList={false}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                    >
                      {imageUrl ?
                        <img src={imageUrl} style={{ width: 300 }} alt="idcard" /> : ({ ...initialvalue }.idcard ?
                          <img src={{ ...initialvalue }.idcard} style={{ width: 300 }} alt="idcard" /> : uploadButton)}
                    </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>

          </Form>
        </Modal>
      </Fragment>
    )
  }
}

export default Form.create()(AA)