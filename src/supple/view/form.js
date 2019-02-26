import React,{Suspense } from 'react';
import {SearchBar,List,InputItem ,Button, Toast,ImagePicker, Picker} from 'antd-mobile';
import Select from 'react-select';
import './index.less';
import axios from 'axios';




const options = [
  { value: '铂爵大酒店', label: '铂爵大酒店' },
  { value: '嘉悦酒店', label: '嘉悦酒店' },
  { value: '桐乡市美高大酒店', label: '桐乡市美高大酒店' },
  { value: '桐乡璞遇智慧酒店', label: '桐乡璞遇智慧酒店' }
];
export default class FormSubmit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      formData:{},
      files:[],
      selectedOption: null
    }
  }
  componentWillMount(){
    console.log(this.props.location.query,9999999);
    this.state.formData = this.props.location.query || {};
    if(this.props.location.query.idcard){
     this.state.files = [{url:this.props.location.query.idcard}]
    }
  }


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
   handlehotelname = (val)=> {
     console.log(val);
     this.state.formData['hotel_name'] = val[0];
     this.setState({
      selectedOption: val
     })
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


   filesOnchange = (files, type) => {
      const imgformData = new FormData();
      console.log(files,type,333,imgformData);
      if(type == 'remove'){
         this.setState({
          files : []
         })
      }
      if(type == 'add'){
        imgformData.append('idcard',files[files.length-1].file);
        // this.setState({
        //   files : [{url:files[files.length-1].url}]
        // })   
        const that = this;
        axios.post('/api/upload',imgformData)
          .then( res => {
            if(res.status == '201'){
              console.log(res,333);
              this.state.formData['idcard'] = res.data;
              that.setState({
                files : [{url:res.data}]
              })   
            }
          })
          .catch( err => {
            console.log(err);
          })
      }
    }

  onImageClick = (index,files) => {
    console.log(3333,index,files);
  }

   render(){
     const {name,mobile, number, hotel_name,hotel_num, idcard} = this.state.formData;
     let {files,selectedOption } = this.state;

    if(!selectedOption && hotel_name){
      let items = [];
      items.push(hotel_name)
       selectedOption = items;
    }
    return(
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
                <div style={{width:'85px',marginRight:'5px'}}>身份证信息</div> 
                <ImagePicker
                  files={files}
                  // multiple = {true}
                  length={2}
                  selectable={files.length <1}
                  onChange={ (file,type)=>{
                    this.filesOnchange(file, type)
                  }}
                  onImageClick={
                    (index,file)=>{ this.onImageClick(index,file)}
                  }
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  />  
              </List.Item>
                <Button className="submit" type="primary" style={{marginTop:'100px'}} onClick={this.handleSubmit}>提交</Button>
            </List>
          </div>  
      </div>
    )
  }
}
  