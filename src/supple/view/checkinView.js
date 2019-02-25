import React,{Suspense } from 'react';
import {SearchBar } from 'antd-mobile';
import axios from 'axios';
import {history} from '../history';
import './index.less';

const minScale = 0.4;
const maxScale = 0.52;
export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
      this.state = {
        pageList:null,
      }
   }

   componentDidMount(){
      axios.get('/api/sign/')
      .then(res =>{
        console.log(res);
        if(res.status == '200'){
          this.setState({
            pageList:res['data'],
          })
        }
      })
      .catch(err=>{
        Toast.fail('提交表单出错',1);
      })
     
   }
 
   handleHover = (e) =>{
    const {pageList} = this.state; 
    const index = parseInt(e.target.getAttribute('index'));
    history.push({pathname:'/formdata',
      query:pageList[index] })
   }
   makeList = (list) => {
      let items = [];
      const {pageList} = this.state;
      console.log(list);
      for(let i = 0; i <list.length; i +=1){//list.length
        console.log(list,list[i]['name'],pageList);
          let hotel_name = list[i]['hotel_name'];
          let hotel_num = list[i]['hotel_num'];
          let idcard = list[i]['idcard'];
          let supple =  hotel_name&&hotel_num&&!idcard?(<span>已补录</span>):(<span index={i} onClick={this.handleHover} className='hover'>点击补录</span>);
          items.push(<div className='items'><div className='name'>{list[i]['name']}</div><div className='mobile'>{list[i]['mobile']}</div><div className='supple'>{supple}</div></div>)
      }
      return items;
   }

  handleOrientation = (e) => {
    console.log(3333);
    e.preventDefault();
    this.setPageheight();
    this.setState({
      screenHeight:this.originalHeight,
    })
  }

   render(){
     const {pageList} = this.state;
    return(
      <div className='supplePage'>
         <div className='search'>
            {/* <SearchBar style={{height:'100%'}}
            placeholder="搜索客户姓名/电话"
            ref={ref => this.manualFocusInst = ref}
          /> */}
          <input placeholder="搜索客户姓名/电话"/>
        </div>
        <div className='listtitle'>已签到客户</div>
        <div className='listname'>
        {pageList&&this.makeList(pageList)}
        </div>
      </div>
    )
  }
}
  