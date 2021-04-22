import React from 'react';
import Motion from './react-motion2/Motion'
import { spring } from './react-motion2/spring';

function App() {

  const [state, setState] = React.useState(10)

  React.useEffect(() => {
    setTimeout(
      () => setState(-100), 6000
    )
  }, [])

  return (
    <Motion
      defaultStyle={{x: 0}} 
      style={{x: spring(state)}}
      onRest={() => console.log('haha')}
    >
      {number => {
        // console.log(number.x)
        return <p>{number.x}</p>
      }}
    </Motion>
  );
}

export default App;
