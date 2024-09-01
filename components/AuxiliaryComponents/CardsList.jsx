import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CardStatic from './CardStatic';
import TopBar from './TopBar';
import {styles} from '../../globals/gstyles';
import UserData from '../../globals/Data';
import MainFunctions from '../../globals/MainFunctions';
import {purp} from '../../globals/gstyles';
import Octicons from 'react-native-vector-icons/Octicons';

const CardsList = ({
  navigation,
  array,
  press,
  handleDelete,
  entity,
  collection,
  scrollHeight = '88%',
}) => {
  const copy = async (item, entity) => {
    if (entity == 'collections') MainFunctions.copyCollection(item);
    if (entity == 'folders') MainFunctions.copyFolder(item);
  };

  return (
    <View style={{width: '100%', height: 'auto', alignItems: 'center'}}>
      <ScrollView style={{height: scrollHeight}}>
        <View style={style.container}>
          {array.length > 0 ? (
            array.map(
              item =>
                !(item.creator != UserData.user.id && item.private) && (
                  <View key={item.id} style={style.card}>
                    <CardStatic
                      handlePress={() => press(item.id)}
                      handleDelete={() => handleDelete(item.id)}
                      handleEdit={() => {
                        navigation.navigate('EditPage', {
                          entity,
                          editedId: item.id,
                          collectionId: collection,
                        });
                      }}
                      copy={
                        item.creator != UserData.user.id && item.id != 0
                          ? () => copy(item, entity)
                          : null
                      }
                      img={item.image}
                      boldText={
                        item.name || item.term || item.username || 'Пусто'
                      }
                      lightText={item.description || item.definition}
                      transcription={item.transcription}
                      entity={entity}
                      readOnly={
                        item.creator != UserData.user.id || item.readOnly
                      }
                      isPrivate={item.private}/>
                  </View>
                ),
            )
          ) : (
            <Text>Здесь пока ничего нет</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    margin: 15,
  },
  biggerContainer: {
    height: 'auto',
  },
});

export default CardsList;
