import React,{Suspense } from 'react';
import {SearchBar,List,InputItem ,Button, Toast,ImagePicker} from 'antd-mobile';
import axios from 'axios';

import './index.less';


const data = [{url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
id: '2121',
}];
export default class FormSubmit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      formData:{},
      files:data
    }
  }
  componentWillMount(){
    console.log(this.props.location.query,9999999);
    this.state.formData = this.props.location.query || {};
  }

  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  };
  onAddImageClick = (e) => {
    e.preventDefault();
    this.setState({
      files: this.state.files.concat({
        url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
        id: '3',
      }),
    });
  };

   handleSubmit = (e)=>{
     e.preventDefault();
     const {formData} = this.state;
    axios.patch( `/api/sign/${formData['openid']}`,formData)
      .then(res => {
        console.log(res)
        if(res.status == '201'){
          Toast.success('提交成功',1);
        }
      })
      .catch(error => {
        Toast.success('提交失败',1); 
      })
   }
   handleName = (e)=>{
     e.preventDefault();
      this.state.formData['name'] = e.target.value;
      console.log(this.state.formData);
   }
   handlePhone = (e)=> {
    e.preventDefault();
      this.state.formData['mobile'] = e.target.value;
      console.log(this.state.formData);
   }
   handleNumber = (e) =>{
    e.preventDefault();
    this.state.formData['number'] = e.target.value;
    console.log(this.state.formData);
   }
   handleHotelnum = (e)=>{
    e.preventDefault();
    this.state.formData['hotel_num'] = e.target.value;
   }
   render(){
     const {name,mobile, number,hotel_num, idcard} = this.state.formData;
     const {files } = this.state;
    return(
      <div className='formpage'>
         <div className='form'>
            <div className='name'>
               <div className='lable'>客户姓名</div>
               <div className='input'>
                <input className='inputtext' defaultValue={name} onChange={this.handleName}/>
                </div>
            </div>
            <div className='phone'>
               <div className='lable'>客户电话</div>
               <div className='input'>
                <input className='inputtext' defaultValue={mobile} onChange={this.handlePhone}/>
                </div>
            </div>
            <div className='number'>
               <div className='lable'>邀请函编号</div>
               <div className='input'>
                <input className='inputtext' defaultValue={number} onChange={this.handleNumber}/>
                </div>
            </div>
            <div className='hotel_num'>
               <div className='lable'>入住信息</div>
               <div className='input'>
                <input className='inputtext' defaultValue={hotel_num} placeholder='请输入客户入住房间编号' onChange={this.handleHotelnum}/>
                </div>
            </div>
            <div className='idcard'>
              <div className='lable'>身份证信息</div>
              <div className='input'>
                  <ImagePicker
                files={files}
                onChange={this.onChange}
                multiple = {false}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={files.lenght <7}
                onAddImageClick={this.onAddImageClick}
                />
              </div>
            </div>
          </div>  
          <div className='submit'>
            <Button type="ghost" onClick={this.handleSubmit}  inline style={{ width:'100%',height:'.3rem',border:'1px solid red',fontSize:'.2rem',lineHeight:'.3rem',padding:'0' }} >提交</Button>
          </div>
      </div>
    )
  }
}
  