import React, { useEffect, useState, useRef } from 'react';
import { ColorRing } from  'react-loader-spinner'
function SpinnerLoader() {
  return (
    <>
      <div className='parentDisable' width="100%">
          <div className='overlay-box'>
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={['#e5097f', '#e5097f', '#e5097f', '#e5097f', '#e5097f']}
            />
          </div>
        </div>
    </>
  );
}
export default SpinnerLoader;
