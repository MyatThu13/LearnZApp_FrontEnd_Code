import React from 'react';
import LAView from './LAView';
import { Rings } from 'react-loader-spinner';
import LAText from './LAText';
import { STRINGS } from '../constant';

function Loader(props){
    return (
        <>
        <LAView type="full-screen-center" flex="col" background="regular">
        <Rings
          height="80"
          width="80"
          color="#007054"
          radius="6"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="rings-loading"
        />
        <LAText
          className="mt-3"
          size="small"
          font="400"
          color={"black"}
          title={STRINGS.prepare_message}
        ></LAText>
      </LAView>
        </>
    );
}
export default Loader;