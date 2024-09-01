import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {purp} from '../../globals/gstyles';
import {Searchbar} from 'react-native-paper';

const TopBar = ({navigation, reload, onChange, value, barStyle}) => {
  return (
    <View style={[style.topbar, barStyle]}>
      {navigation && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={30} color="white" />
        </TouchableOpacity>
      )}
      {value != null && onChange && (
        <Searchbar
          placeholder="Поиск"
          onChangeText={onChange}
          value={value}
          style={{width: '75%'}}
          inputStyle={{fontSize: 16}}
        />
      )}
      {reload && (
        <TouchableOpacity onPress={reload}>
          <AntDesign name="reload1" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  topbar: {
    backgroundColor: purp,
    marginBottom: 10,
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default TopBar;
