import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { SearchBar, List, PullToRefresh, Toast } from 'antd-mobile';
import request from '../../request';
import './index.less';

const Item = List.Item;

class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageList: null,
      searchtext: '',
    }
  }

  componentDidMount() {
    this.handlePost();
  }

  handlePost = () => {
    const that = this;
    request('/api/sign/?category=mobile', {},
      (res) => {
        if (res.status == '200') {
          sessionStorage.setItem('globalData', JSON.stringify(res['data']));
          that.setState({
            pageList: res['data'],
          })
        }
      },
      () => {
        Toast.fail('获取数据失败', 1);
      }
    )
  }

  handleHover = (e) => {
    e.preventDefault();
    const index = parseInt(e.currentTarget.getAttribute('index'));
    this.props.history.push(`/supple/formdata/${index}`);
  }

  handleSearch = (val) => {
    this.state.searchtext = val;
  }

  handleSearchSubmit = () => {
    const { searchtext } = this.state;
    if (!searchtext) return;
    const url = `/api/sign/?category=mobile&filters=name~${searchtext}|mobile~${searchtext}|number~${searchtext}`;
    const that = this;
    request(url, {}, res => {
      if (res.status == '200') {
        that.setState({
          pageList: res['data'],
        })
      }
    }, err => {
      Toast.fail('获取数据失败', 1);
    })
  }

  handleBlur = () => {
    const { searchtext } = this.state;
    if (!searchtext) {
      this.handlePost();
    } else {
      this.handleSearchSubmit();
    }
  }

  makeList = (list) => {
    let items = [];
    for (let i = 0; i < list.length; i += 1) {
      let hotel_name = list[i]['hotel_name'];
      let hotel_num = list[i]['hotel_num'];
      let idcard = list[i]['idcard'];
      let supple = hotel_name && hotel_num && !idcard ? (<span>已补录</span>) : (
        <span index={i} onClick={this.handleHover} className='hover'>点击补录</span>);
      items.push(
        <Item className='items' key={i}>
          <div className='name'>{list[i]['name']}</div>
          <div className='mobile'>{list[i]['mobile']}</div>
          <div className='supple'>{supple}</div>
        </Item>
      );
    }
    return items;
  }


  render() {
    const { pageList } = this.state;
    return (
      <div className='supplePage'>
        <SearchBar
          placeholder="搜索客户姓名/电话/编号"
          cancelText='搜索'
          onChange={this.handleSearch}
          onCancel={this.handleSearchSubmit}
          onBlur={this.handleBlur}
        />
        <List renderHeader={() => '已签到客户'}>
          <PullToRefresh
            className='listview'
            damping={50}
            onRefresh={this.handleSearchSubmit}
          >
            {pageList && this.makeList(pageList)}
          </PullToRefresh>
        </List>
      </div>
    )
  }
}

export default withRouter(CheckIn)