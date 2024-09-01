import React from 'react';
import Navigate from './components/Navigation/Navigate';
import {View} from 'react-native';

function App(): React.JSX.Element {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <Navigate />
    </View>
  );
}

export default App;
