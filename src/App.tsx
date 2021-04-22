import React from 'react';
import Motion from './react-motion2/Motion'
import { spring } from './react-motion2/spring';

function App() {
  return (
    <Motion
      defaultStyle={{x: 0}} 
      style={{x: spring(10)}}
    >
      {number => <p>{number.x}</p>}
    </Motion>
  );
}

export default App;
