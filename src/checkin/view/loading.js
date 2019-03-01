import React from 'react';
import './loading.less';

export default ()=>{
  return(
    <React.Fragment>
      <div className='loadingPage'>
        <div className='loading-img'>
        </div>    
        <div className='text'>loading...</div> 
      </div> 
    </React.Fragment> 
    )
}