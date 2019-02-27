import React,{Suspense } from 'react';
import {SearchBar , List, PullToRefresh,Toast} from 'antd-mobile';
import axios from 'axios';
import {history} from '../history';
import './index.less';

const Item = List.Item;
export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
      this.state = {
        pageList:null,
        searchtext:'',
      }
   }

   componentDidMount(){
      this.handlePost();
   }
 
   handlePost = () =>{
     axios.get('/api/sign/?category=mobile')//?category=mobile
      .then(res =>{
        if(res.status == '200'){
          this.setState({
            pageList:res['data'],
          })
        }
      })
      .catch(err=>{
        Toast.fail('获取数据失败',1);
      })
   } 

   handleHover = (e) =>{
    const {pageList} = this.state; 
    const index = parseInt(e.target.getAttribute('index'));
    history.push({pathname:'/formdata',
      query:pageList[index] })
   }

   handleSearch = (val) =>{
     this.state.searchtext = val;
   }

   handleSearchSubmit = () => {
    const {searchtext} = this.state;
    if(!searchtext) return;
    axios.get(`/api/sign/?category=mobile&filters=name~${searchtext}|mobile~${searchtext}`)
      .then(res =>{
        if(res.status == '200'){
          this.setState({
            pageList:res['data'],
          })
        }
      })
    .catch(err=>{
      Toast.fail('获取数据失败',1);
    })
   }

   handleBlur = () =>{
    const {searchtext} = this.state;
    if(!searchtext){
       this.handlePost();
    }else{
      this.handleSearchSubmit();
    }
   }

   makeList = (list) => {
      let items = [];
      const {pageList} = this.state;
      for(let i = 0; i <list.length; i +=1){//list.length
          let hotel_name = list[i]['hotel_name'];
          let hotel_num = list[i]['hotel_num'];
          let idcard = list[i]['idcard'];
          let supple =  hotel_name&&hotel_num&&!idcard?(<span>已补录</span>):(<span index={i} onClick={this.handleHover} className='hover'>点击补录</span>);
          items.push(<Item className='items' key={i}><div className='name'>{list[i]['name']}</div><div className='mobile'>{list[i]['mobile']}</div><div className='supple'>{supple}</div></Item>)
      }
      return items;
   }


   render(){
     const {pageList,searchtext} = this.state;
    return(
      <div className='supplePage'>
        <SearchBar 
        placeholder="搜索客户姓名/电话"
        cancelText='搜索'
        onChange={this.handleSearch}
        onCancel={this.handleSearchSubmit}
        onBlur={this.handleBlur}
        ref={ref => this.manualFocusInst = ref}
      />
      <List renderHeader={() => '已签到客户'}>
        <PullToRefresh className='listview'
          onRefresh={this.handleSearchSubmit}
        >
          {pageList&&this.makeList(pageList)}  
        </PullToRefresh>
      </List>
      </div>
    )
  }
}
  