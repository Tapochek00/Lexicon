import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {styles} from '../../globals/gstyles';
import CardsList from './CardsList';

const SearchPageItem = ({label, array, press, entity, handleDelete}) => {
  return (
    <View style={{height: 'auto'}}>
      <Text style={[styles.bigLabel, styles.biggerLabel]}>{label}</Text>
      <ScrollView horizontal>
        {array.length > 0 ? (
          <CardsList
            array={array}
            hideTopbar={true}
            press={press}
            entity={entity}
            scrollHeight="auto"
            handleDelete={handleDelete}
          />
        ) : (
          <Text style={styles.notFound}>Ничего не найдено</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchPageItem;
