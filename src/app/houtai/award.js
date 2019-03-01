import React, { PureComponent, Fragment } from 'react';
import { Table, Form, Button, Divider, Icon, Modal, Input, Row, Col, Popover, Upload, message, Drawer } from 'antd';
import lrz from 'lrz';
import Cropper from 'react-cropper';
import '../../../node_modules/cropperjs/dist/cropper.css';
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
      drawervisible: false,
      selectImgSize: '',
      selectImgName: '',
      srcCropper: '',
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      console.log(e, file);
      this.setState({
        srcCropper: e.target.result, //cropper的图片路径
        selectImgName: file.name, //文件名称
        selectImgSize: (file.size / 1024 / 1024), //文件大小
        selectImgSuffix: file.type.split("/")[1], //文件类型
        drawervisible: true,
      })
    }
    return isJPG;
  }

  customRequest = (file) => {
    const _this = this;
    this.showDrawer();
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
    function deleteA() {
      const midkey = awards.filter(item => item.id !== id);
      _this.setState({ awards: midkey });
    }
    request(`/api/award/${id}`, options, deleteA, (error) => console.log(error));
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
    const { awards, imageUrl, initialvalue } = this.state;
    const { getFieldsValue } = this.props.form;
    const params = getFieldsValue();
    const payload = { ...params };
    delete payload.id;
    if (params.id) {
      function editA(res) {
        const midkey = awards.filter(item => item.id !== res.data.id);
        midkey.push(res.data);
        _this.setState({ awards: midkey, visible: false });
      }
      const options = {
        type: 'put',
        params: {
          ...payload,
          url: imageUrl || initialvalue.url,
        },
      }
      request(`/api/award/${params.id}`, options, editA, (error) => console.log(error));
    } else {
      function addA(res) {
        const midkey = awards;
        midkey.push(res.data);
        _this.setState({ awards: midkey, visible: false });
      }
      const options = {
        type: 'post',
        params: {
          ...payload,
          url: imageUrl,
        },
      }
      request('/api/award', options, addA, (error) => console.log(error));
    }
  }

  saveImg() {
    const _this = this;
    // lrz压缩
    // this.refs.cropper.getCroppedCanvas().toDataURL() 为裁剪框的base64的值
    lrz(this.refs.cropper.getCroppedCanvas().toDataURL(), { width: 260 }).then((results) => {
      console.log(results, 'res');
      // results为压缩后的结果
      // _this.props.uploadImgByBase64({ //uploadImgByBase64为连接后台的接口
      //   imgbase: results.base64, //取base64的值传值
      //   imgsize: results.fileLen, //压缩后的图片大下
      //   suffix: _this.state.selectImgSuffix, //文件类型
      //   filename: _this.state.selectImgName, //文件名
      // })
    })
  }
  // imageDiminution = (files01, type, index) => {
  //   console.log(files01, type, index);
  //   if (type === 'add') {
  //     lrz(files01[0].url, { quality: 0.1 })
  //       .then((rst) => {
  //         // 处理成功会执行
  //         console.log('压缩成功')
  //         console.log(rst.base64);
  //         this.setState({
  //           imagesrc01: rst.base64.split(',')[1],
  //         })
  //       })
  //   } else {
  //     this.setState({ imagesrc01: '' })
  //   }
  //   this.setState({
  //     files01,
  //   });
  // }


  makeNew = () => {
    const _this = this;
    _this.setState({ initialvalue: {}, visible: true });
  }

  showDrawer = () => {
    this.setState({ drawervisible: true });
  };

  onClose = () => {
    this.setState({ drawervisible: false });
  };

  render() {
    const { visible, initialvalue, imageUrl, awards, drawervisible, srcCropper } = this.state;
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
                      {imageUrl ? <img src={imageUrl} style={{ width: 300 }} alt="url" /> :
                        ({ ...initialvalue }.url ? <img src={{ ...initialvalue }.url} style={{ width: 300 }} alt="url" /> :
                          uploadButton)}
                    </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Drawer
          title="裁剪图片"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={drawervisible}
          width='1400'
        >
          <Cropper
            src={srcCropper} //图片路径，即是base64的值，在Upload上传的时候获取到的
            ref="cropper"
            style={{ height: 600 }}
            preview='.cropper-preview'
            className="company-logo-cropper"
            viewMode={1} //定义cropper的视图模式
            zoomable={false} //是否允许放大图像
            aspectRatio={1 / 1} //image的纵横比
            guides={true} //显示在裁剪框上方的虚线
            background={true} //是否显示背景的马赛克
            rotatable={false} //是否旋转
          />
          <Button
            onClick={() => this.saveImg()}
            icon='scissor'
          >裁剪</Button>
        </Drawer>
      </Fragment>
    )
  }
}

export default Form.create()(BB)