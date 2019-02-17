import React from 'react';
import './index.less';
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';

export default class DrawView extends React.Component{
  render(){
    return(
      <React.Fragment>
        <div className='prize'>
            <div className="explain">
                <div className='explainimg'></div>
                <div className='explaintext'></div>
            </div>
            <div className='prizedraw'>
              <div className='prizerote'>
                <div className='prizerote-bg'>
                </div>
                <div className='prizeavatar'>
                  <img src={checkin}></img>
                </div>
              </div>
            </div>
        </div>
        <div className='namelist'>
        </div>
      </React.Fragment>
    ) 
  }
}