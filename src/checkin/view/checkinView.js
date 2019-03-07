import React, { Suspense } from 'react';
import Loading from './loading';
import LookoverPage from './lookoverpage/index';
import CheckinPage from './checkinpage/index';
import axios from 'axios';

const minScale = 0.4;
const maxScale = 0.52;
export default class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHeight: null,
      pageWidth: null,
      pageMargin: null,
      screenHeight: null,
      isLoading: true,
      isCheck: null,
    }
  }

  componentWillMount() {
    this.setPageheight();
    this.state.screenHeight = this.originalHeight;
  }

  componentDidMount() {
    document.addEventListener("touchmove", this.handleMove);
    const name = localStorage.getItem('check_name');
    if (name) {
      this.setState({
        isCheck: true,
        isLoading: null,
      })
    } else {
      const that = this;
      axios.get(`/api/check/${this.handleGetOenId()}`)
        .then(res => {
          if (res.status == '200') {
            if (res.data.openid && res.data.name) {
              localStorage.setItem('check_name', res.data['name']);
              that.setState({
                isLoading: null,
                isCheck: true,
              })
            } else {
              that.setState({
                isLoading: null,
              })
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  componentWillUnmount() {
    document.removeEventListener("touchmove", this.handleMove);
  }

  handleGetOenId = () => {
    let query = window.location.search;
    if(query.indexOf('?') !== -1){
      query = query.substr(1);
    }
    const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
    const obj = {};
    while(reg.exec(query)){
      obj[RegExp.$1] = RegExp.$2;
    }
    const openId = obj.openid;


    // const currentUrl = window.location.href;
    // let openId = null;
    // try {
    //   openId = currentUrl.split('?')['1'].split('=')['1']
    // } catch (err) {
    //   console.log(err);
    // }
    //
    return openId;
  }

  setPageheight = () => {
    this.originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    this.originalWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const scale = this.originalWidth / this.originalHeight;
    if (scale > minScale && scale < maxScale) {
      this.state.pageHeight = this.originalHeight;
      this.state.pageWidth = this.originalWidth * .9;
    } else if (scale > maxScale) {
      this.state.pageHeight = this.originalHeight;
      this.state.pageWidth = this.originalHeight * maxScale * .9;
    } else if (scale < minScale) {
      this.state.pageWidth = this.originalWidth * .9;
      this.state.pageHeight = this.originalWidth / minScale;
      this.state.pageMargin = this.originalHeight - this.originalWidth / minScale;
    }
  }

  handleMove = (e) => {
    e.preventDefault();
    return;
  }

  render() {
    const { isCheck, isLoading } = this.state;
    if (isLoading) {
      return <Loading />
    }
    return (
      <React.Fragment>
        <Suspense fallback={<Loading />}>
          {isCheck ? (
            <LookoverPage Move={this.handleMove} height={this.state.screenHeight} {...this.state} />
          ) : (
            <CheckinPage Move={this.handleMove} {...this.state} height={this.state.screenHeight} />
          )}
        </Suspense>
      </React.Fragment>
    );
  }
}
  