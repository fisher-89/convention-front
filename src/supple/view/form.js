import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import ImageCompressor from 'image-compressor.js';
import { List, InputItem, Button, Toast, ImagePicker, Picker, DatePicker } from 'antd-mobile';
import request from '../../request';
import './index.less';


const options = [
  { value: '铂爵大酒店', label: '铂爵大酒店' },
  { value: '嘉悦酒店', label: '嘉悦酒店' },
  { value: '桐乡市美高大酒店', label: '桐乡市美高大酒店' },
  { value: '桐乡璞遇智慧酒店', label: '桐乡璞遇智慧酒店' }
];
const now = new Date(Date.now());

class FormSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      files: [],
      selectedOption: null,
      startTime: now,
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
      const startTime = globalData[id].start_time;
      if (globalData[id] && startTime) {
        this.setState({
          startTime: new Date(Date.parse(startTime))
        })
      } else {
        this.setState({
          startTime: now,
        })
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
    const { formData, startTime } = this.state;
    const dateObj = new Date(startTime);
    const newStartTime = `${dateObj.getFullYear()}-${this.prefixZero((dateObj.getMonth() + 1), 2)}-${this.prefixZero(dateObj.getDate(), 2)}`;
    formData.start_time = newStartTime;
    const url = `/api/sign/${formData['openid']}`
    request(url, { type: 'patch', params: formData },
      (res) => {
        if (res.status == '201') {
          Toast.success('提交成功', 1, function () {
            window.history.go(-1);
          });
        }
      },
      (err) => {
        if (err.response && err.response.data.message) {
          Toast.fail(err.response.data.message, 1);
        } else {
          Toast.fail('提交失败', 1);
        }
      });
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
  handleStartTime = (value) => {
    this.setState({
      startTime: value,
    })
  }

  prefixZero = (num, n) => {
    return (Array(n).join(0) + num).slice(-n);
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
      Toast.loading('上传中...', 0, null, true);
      const imgformData = new FormData();
      const uploadFile = files[files.length - 1].file;
      const compressor = new ImageCompressor();
      compressor.compress(
        uploadFile,
        { quality: 0.6 },
      ).then(
        (blob) => {
          const type = /.\w+$/.exec(blob.name)[0];
          imgformData.append('idcard', blob, `idcard${type}`);
          request('/api/upload', { type: 'post', params: imgformData },
            (res) => {
              if (res.status == '201') {
                Toast.hide();
                this.state.formData['idcard'] = res.data;
                this.setState({
                  files: [{ url: res.data }],
                  fileupload: null,
                });
              }
            },
            () => {
              Toast.hide();
              Toast.fail('图片上传失败', 1);
            }
          );
        }
      );
    }
  };


  render() {
    const { name, mobile, number, hotel_name, hotel_num } = this.state.formData;
    let { files, selectedOption, startTime } = this.state;
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
            <DatePicker
              mode="date"
              title="选择日期"
              extra="Optional"
              value={startTime}
              onChange={this.handleStartTime}
            >
              <List.Item arrow="horizontal">入住日期</List.Item>
            </DatePicker>
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