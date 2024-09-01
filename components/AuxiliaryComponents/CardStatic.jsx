import {View, StyleSheet, Image, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {screenWidth, screenHeight, styles} from '../../globals/gstyles';
import {
  ScrollView,
  TouchableWithoutFeedback,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const CardStatic = ({
  handlePress,
  handleDelete,
  handleEdit,
  readOnly,
  isPrivate,
  copy,
  entity,
  boldText,
  lightText,
  img,
  transcription,
}) => {
  const [saved, setSaved] = useState(false); // Копирование карты
  const [imageAvailable, setImageAvailable] = useState(false); // Доступность изображения

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaved(false);
      }, 800);
    }
  }, [saved]);

  // Проверка доступности изображения
  const getImage = () => {
    if (img != null && img != '') {
      fetch(img)
        .then(res => {
          if (res.ok || res.status == 403) {
            setImageAvailable(true);
          } else {
            console.log(res.status);
          }
        })
        .catch();
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback
        style={[style.container, {justifyContent: readOnly && 'center'}]}
        onPress={handlePress}>
        <View
          style={[
            {
              justifyContent: isPrivate ? 'space-between' : 'flex-end',
              flexDirection: 'row',
            },
          ]}>
          {isPrivate && (
            <FontAwesome
              name="lock"
              size={20}
              color="#a3a3a3"
              style={{alignSelf: 'center', marginHorizontal: 5}}
            />
          )}
          {!readOnly && (
            <View style={[style.btns]}>
              <TouchableWithoutFeedback
                onPress={handleDelete}
                onStartShouldSetResponder={true}>
                <MaterialCommunityIcons
                  name="delete-circle"
                  size={35}
                  color="#a3a3a3"
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={handleEdit}
                onStartShouldSetResponder={true}>
                <MaterialCommunityIcons
                  name="pencil-circle"
                  size={35}
                  color="#a3a3a3"
                />
              </TouchableWithoutFeedback>
            </View>
          )}
          {copy && entity != 'users' && entity != 'cards' && (
            <TouchableWithoutFeedback
              onPress={() => {
                copy();
                setSaved(true);
              }}
              onStartShouldSetResponder={true}>
              <MaterialCommunityIcons
                name={saved ? 'check-circle' : 'plus-circle'}
                size={35}
                color={saved ? '#40c9a2' : '#a3a3a3'}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
        <View>
          <ScrollView
            style={{height: '80%'}}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            onStartShouldSetResponder={true}>
            <View style={style.innerContainer}>
              {imageAvailable && (
                <Image style={styles.img} source={{uri: img}} />
              )}
              <Text style={styles.term}>{boldText}</Text>
              {transcription && (
                <Text
                  style={[styles.definition, {textAlign: 'center', margin: 2}]}>
                  {transcription}
                </Text>
              )}
              <Text style={styles.definition}>{lightText}</Text>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const style = StyleSheet.create({
  container: {
    height: screenHeight / 3.5,
    width: screenWidth / 2.5,
    backgroundColor: '#fff',
    elevation: 12,
    borderRadius: 8,
    padding: 7,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  btns: {
    margin: 5,
    flexDirection: 'row',
  },
});

export default CardStatic;
