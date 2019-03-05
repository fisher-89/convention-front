import React from 'react';
import './checkform.less';
import logo from 'public/checkin/logo.png';
import xj from 'public/checkin/xj.png';
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';

export default class CheckForm extends React.PureComponent {
  componentWillMount() {
    if (location.search.indexOf('clear-cache') !== -1) {
      localStorage.clear();
    }
  }

  render() {
    const { pageTranslate, pageHeight, pageWidth } = this.props;
    const pageStyle = pageWidth ? {
      height: `${pageHeight}px`,
      width: `${pageWidth}px`,
      marginLeft: `-${pageWidth / 2}px`,
      marginTop: `-${pageHeight / 2}px`
    } : null;
    return (
      <React.Fragment>
        <div
          className='checkinPage'
          style={{ transition: 'top 1s ease', top: pageTranslate ? `-${50 * pageTranslate}%` : null, ...pageStyle }}
        >
          <div className='logo'><img src={logo} /></div>
          <div className='xj'><img src={xj} /></div>
          <div className='triangle'><img src={triangle} /></div>
          <div className='checkin'>
            <div className='checkin-container'>
              <img className='checkinbtn' src={checkin} onClick={this.props.handleClick} />
              <div className='smline'><img src={smline} /></div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
  