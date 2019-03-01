import React, { PureComponent, Fragment } from 'react';
import { Table, Form, Button, Divider, Icon, Modal, Input, Row, Col, Popover, Upload, message } from 'antd';
import lrz from 'lrz';
import request from '../../request';

const FormItem = Form.Item;

class BB extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      initialvalue: {},
      awards: [],
      loading: false,
      imageUrl: undefined,
    };
  }

  componentWillMount() {
    const options = {};
    const _this = this;
    request('/api/award', options, (response) => _this.setState({ awards: response.data }), (error) => console.log(error));
  }

  afterClose = () => {
    const _this = this;
    const { resetFields } = this.props.form;
    _this.setState({ initialvalue: undefined, imageUrl: undefined, loading: false });
    resetFields();
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJPG;
  }

  customRequest = (file) => {
    const _this = this;
    const formData = new FormData();
    formData.append('url', file.file);
    const options = {
      type: 'post',
      params: formData,
    }
    request('/api/upload_award', options, (response) => _this.setState({ imageUrl: response.data, loading: false }), (error) => console.log(error));
  }

  deleted = (id) => {
    const _this = this;
    const { awards } = this.state;
    const options = {
      type: 'delete',
      params: {},
    }
    function deleteA () {
      const midkey = awards.filter(item => item.id !== id);
      _this.setState({ awards: midkey });
    }
    request(`api/award/${id}`, options, deleteA, (error) => console.log(error));
  }

  editAward = (rowData) => {
    const _this = this;
    _this.setState({ initialvalue: rowData, visible: true });
  }

  handleModalVisible = () => {
    this.setState({ visible: false });
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

  handleSubmit = () => {
    const _this = this;
    const { awards, imageUrl } = this.state; 
    const { getFieldsValue } = this.props.form;
    const params = getFieldsValue();
    if (params.id) {
      function editA (res) {
        const midkey = awards.filter(item => item.id !== res.data.id);
        midkey.push(res.data);
        _this.setState({ awards: midkey, visible: false });
      }
      const options = {
        type: 'put',
        params: {
          ...params,
          url: imageUrl,
        },
      }
      request(`api/award/${params.id}`, options, editA, (error) => console.log(error));
    } else {
      function addA (res) {
        const midkey = awards;
        midkey.push(res.data);
        _this.setState({ awards: midkey, visible: false });
      }
      const options = {
        type: 'post',
        params: {
          ...params,
          url: imageUrl,
        },
      }
      request('api/award', options, addA, (error) => console.log(error));
    }

  }

  imageDiminution = (files01, type, index) => {
    console.log(files01, type, index);
    if (type === 'add') {
      lrz(files01[0].url, { quality: 0.1 })
        .then((rst) => {
          // 处理成功会执行
          console.log('压缩成功')
          console.log(rst.base64);
          this.setState({
            imagesrc01: rst.base64.split(',')[1],
          })
        })
    } else {
      this.setState({ imagesrc01: '' })
    }
    this.setState({
      files01,
    });
  }


  makeNew = () => {
    const _this = this;
    _this.setState({ initialvalue: {}, visible: true });
  }

  render() {
    const { visible, initialvalue, imageUrl, awards } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '奖品名称',
        dataIndex: 'name',
      },
      {
        title: '照片',
        dataIndex: 'url',
      },
      {
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.editAward(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.deleted(rowData.id)}>删除</a>
            </Fragment>
          )
        }
      }
    ];
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
    const colSpan = { xs: 24, lg: 16 };
    const colS = { xs: 24, lg: 23 };
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div >Upload</div>
      </div>
    );
    return (
      <Fragment>
        <div>
          <Button
            onClick={() => this.makeNew()}
            type="primary"
            icon='plus-circle'>
            添加奖品
          </Button>
        </div>
        <Table
          dataSource={awards}
          rowKey="id"
          columns={columns}
        />
        <Modal
          afterClose={this.afterClose}
          onCancel={this.handleModalVisible}
          title="奖品"
          visible={visible}
          onOk={this.handleSubmit}
        >
          <Form >
            {getFieldDecorator('id', {
              initialValue: { ...initialvalue }.id || null,
            })(
              <Input type='hidden' />
            )}
            <Row >
              <Col {...colSpan}>
                <FormItem {...formItemLayout} label="奖品名称" required>
                  {getFieldDecorator('name', {
                    initialValue: { ...initialvalue }.name || undefined,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="图片" >
                  {getFieldDecorator('url', {
                    initialValue: { ...initialvalue }.url || undefined,
                  })(
                    <Upload
                      name="url"
                      listType="picture-card"
                      customRequest={(file) => {
                        this.customRequest(file);
                      }}
                      showUploadList={false}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                    >
                    {imageUrl ? <img src={imageUrl} style={{ width: 300 }} alt="url" /> : ({ ...initialvalue }.url? <img src={{ ...initialvalue }.url} style={{ width: 300 }} alt="url" /> : uploadButton)}
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

export default Form.create()(BB)