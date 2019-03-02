import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { List, InputItem, Button, Toast, ImagePicker, Picker } from 'antd-mobile';
import request from '../../request';
import './index.less';


const options = [
  { value: '铂爵大酒店', label: '铂爵大酒店' },
  { value: '嘉悦酒店', label: '嘉悦酒店' },
  { value: '桐乡市美高大酒店', label: '桐乡市美高大酒店' },
  { value: '桐乡璞遇智慧酒店', label: '桐乡璞遇智慧酒店' }
];

class FormSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      files: [],
      selectedOption: null,
    }
  }

  componentWillMount() {
    const id = this.handleGetID();
    const globalData = JSON.parse(sessionStorage.getItem('globalData'));
    if (globalData) {
      this.state.formData = globalData[id];
      if (globalData[id] && globalData[id].idcard) {
        this.state.files = [{ url: globalData[id]['idcard'] }]
      }
    }
  }

  componentWillUnmount() {
    Toast.hide();
  }

  handleGetID = () => {
    const id = this.props.match.params['userId'];
    return id;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { formData } = this.state;
    const url = `/api/sign/${formData['openid']}`
    request(url, { type: 'patch', params: formData },
      res => {
        if (res.status == '201') {
          Toast.success('提交成功', 1, function () {
            window.history.go(-1);
          });
        }
      },
      error => {
        Toast.success('提交失败', 1);
      })
  }

  handleName = (value) => {
    this.state.formData['name'] = value;
  }

  handlePhone = (value) => {
    this.state.formData['mobile'] = value;
  }

  handlehotelname = (val) => {
    this.state.formData['hotel_name'] = val[0];
    this.setState({
      selectedOption: val
    })
  }

  handleNumber = (value) => {
    this.state.formData['number'] = value;
  }

  handleHotelnum = (value) => {
    this.state.formData['hotel_num'] = value;
  }

  filesOnchange = (files, type) => {
    if (type == 'remove') {
      const { formData } = this.state;
      this.setState({
        files: [],
        formData: {
          ...formData,
          idcard: '',
        },
      });
    }
    if (type == 'add') {
      const imgformData = new FormData();
      imgformData.append('idcard', files[files.length - 1].file);
      const that = this;
      Toast.loading('上传中...', 0, null, true);
      request('/api/upload', { type: 'post', params: imgformData },
        res => {
          if (res.status == '201') {
            Toast.hide();
            that.state.formData['idcard'] = res.data;
            that.setState({
              files: [{ url: res.data }],
              fileupload: null,
            });
          }
        },
        err => {
          console.log(err);
          Toast.hide();
          Toast.fail('图片上传失败', 1);
        })
    }
  }


  render() {
    const { name, mobile, number, hotel_name, hotel_num } = this.state.formData;
    let { files, selectedOption } = this.state;
    if (!selectedOption && hotel_name) {
      let items = [];
      items.push(hotel_name)
      selectedOption = items;
    }
    return (
      <div className='formpage'>
        <div className='form'>
          <List>
            <InputItem placeholder='请输入客户姓名' defaultValue={name} onChange={this.handleName}>客户姓名</InputItem>
            <InputItem placeholder='请输入客户电话' defaultValue={mobile} onChange={this.handlePhone}>客户电话</InputItem>
            <InputItem placeholder='请输入邀请函编号' defaultValue={number} onChange={this.handleNumber}>邀请函编号</InputItem>
            <Picker
              extra='请选择入住酒店'
              data={options} cols={1}
              value={selectedOption || hotel_name}
              onChange={this.handlehotelname}>
              <List.Item arrow="horizontal">入住酒店</List.Item>
            </Picker>
            <InputItem placeholder='请输入酒店房间号' defaultValue={hotel_num} onChange={this.handleHotelnum}>酒店房间号</InputItem>
            <List.Item className='idcard'>
              <div style={{ width: '85px', marginRight: '5px' }}>身份证信息</div>
              <ImagePicker
                files={files}
                length={2}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={files.length < 1}
                onChange={(file, type) => {
                  this.filesOnchange(file, type)
                }}
              />
            </List.Item>
            <Button className="submit" type="primary" style={{ marginTop: '100px' }}
                    onClick={this.handleSubmit}>提交</Button>
          </List>
        </div>
      </div>
    )
  }
}


export default withRouter(FormSubmit);