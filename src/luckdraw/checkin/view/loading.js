import React from 'react';
import './loading.less';
import loading from 'public/checkin/loading.png'

export default ()=>{
  return(
    <React.Fragment>
      <div className='loadingPage'>
        <div className='loading-img'>
          <img src={loading}></img>
        </div>    
        <p>loading...</p> 
      </div> 
    </React.Fragment> 
    )
}