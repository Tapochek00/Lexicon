import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useEffect, useRef, useState} from 'react';
import {screenHeight, screenWidth, styles} from '../../globals/gstyles';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';

const Card = ({card, yesFunc, noFunc}) => {
  const flip = useRef(new Animated.Value(0)); // Поворот карты
  const [flipped, setFlipped] = useState(false); // Карта повёрнута
  const offset = useRef(new Animated.Value(0)); // Перемещение карты
  const offsetFront = useRef(new Animated.Value(0)); // Перемещение карты
  const [disableButtons, setDisableButtons] = useState(false); // Отключение кнопок
  const [canSpin, setCanSpin] = useState(true); // Возможность поворота
  const [imageAvailable, setImageAvailable] = useState(false); // Доступность изображения

  // Поворот карты
  const handleFlip = () => {
    setDisableButtons(true);
    if (canSpin) {
      Animated.timing(flip.current, {
        duration: 300,
        toValue: flipped ? 0 : 1,
        useNativeDriver: false,
      }).start(() => {
        setFlipped(!flipped);
        setDisableButtons(false);
      });
    }
  };

  // Поворот передней стороны
  const interpolateFront = flip.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Поворот задней стороны
  const interpolateBack = flip.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Подтверждение правильного ответа
  const confirmCorrectAnswer = () => {
    setDisableButtons(true);
    setCanSpin(false);
    Animated.timing(offset.current, {
      duration: 300,
      toValue: -screenWidth,
      useNativeDriver: false,
    }).start(() => {
      setDisableButtons(false);
      yesFunc();
    });
    Animated.timing(offsetFront.current, {
      duration: 295,
      toValue: flipped ? screenWidth : -screenWidth,
      useNativeDriver: false,
    }).start(() => {
      setDisableButtons(false);
      yesFunc();
    });
  };

  // Подтверждение неправильного ответа
  const confirmWrongAnswer = () => {
    setDisableButtons(true);
    setCanSpin(false);
    Animated.timing(offset.current, {
      duration: 300,
      toValue: screenWidth,
      useNativeDriver: false,
    }).start(() => {
      setDisableButtons(false);
      noFunc();
    });
    Animated.timing(offsetFront.current, {
      duration: 300,
      toValue: flipped ? -screenWidth : screenWidth,
      useNativeDriver: false,
    }).start(() => {
      setDisableButtons(false);
      yesFunc();
    });
  };

  // Проверка доступности изображения
  const getImage = async () => {
    if (card.image != null && card.image != '') {
      await fetch(card.image)
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
    <View style={style.container}>
      <GestureHandlerRootView>
        <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
          <Animated.View
            style={[
              style.card,
              style.front,
              {
                transform: [
                  {rotateY: interpolateFront},
                  {
                    translateX: offsetFront.current,
                  },
                ],
              },
            ]}>
            <ScrollView
              onStartShouldSetResponder={true}
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
              <Text style={style.cardText}>{card.term}</Text>
            </ScrollView>
          </Animated.View>
          <Animated.View
            style={[
              style.card,
              style.back,
              {
                transform: [
                  {rotateY: interpolateBack},
                  {translateX: offset.current},
                ],
              },
            ]}>
            <ScrollView
              onStartShouldSetResponder={true}
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
              {imageAvailable && (
                <Image style={style.img} source={{uri: card.image}}/>
              )}

              <Text style={style.cardText}>{card.definition}</Text>
              <Text
                style={{fontSize: 18, color: '#4E4653', textAlign: 'center'}}>
                {card.term}
              </Text>
              {card.transcription && (
                <Text
                  style={[
                    styles.definition,
                    {
                      marginHorizontal: 10,
                      marginVertical: 5,
                      fontSize: 16,
                      textAlign: 'center',
                    },
                  ]}>
                  {card.transcription}
                </Text>
              )}
              {card.example && (
                <Text
                  style={[
                    styles.definition,
                    {marginHorizontal: 10, marginVertical: 5, fontSize: 16},
                  ]}>
                  {card.example}
                </Text>
              )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={confirmCorrectAnswer}
            disabled={disableButtons}>
            <AntDesign
              name="checkcircle"
              size={50}
              color="#40c9a2"
              style={style.checkClose}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmWrongAnswer}
            disabled={disableButtons}>
            <AntDesign
              name="closecircle"
              size={50}
              color="#fe654f"
              style={style.checkClose}
            />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

const style = StyleSheet.create({
  checkClose: {
    marginVertical: 10,
    marginHorizontal: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  card: {
    height: screenHeight / 1.4,
    width: screenWidth / 1.3,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: '#664147',
    padding: 20,
  },
  front: {
    position: 'absolute',
  },
  back: {
    backfaceVisibility: 'hidden',
  },
  img: {
    width: screenWidth / 2,
    height: screenHeight / 4,
    alignSelf: 'center',
    marginBottom: 8,
    borderRadius: 13,
    resizeMode: 'contain'
  },
  cardText: {
    fontSize: 22,
    textAlign: 'center',
  },
});

export default Card;
