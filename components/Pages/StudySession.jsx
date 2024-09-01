import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Card from '../AuxiliaryComponents/Card';
import MainFunctions from '../../globals/MainFunctions';
import UserData from '../../globals/Data';
import {purp, styles} from '../../globals/gstyles';
import TopBar from '../AuxiliaryComponents/TopBar';
import IonIcons from 'react-native-vector-icons/Ionicons';

const StudySession = ({navigation, route}) => {
  const [cards, setCards] = useState([]); // Карточки
  const [loading, setLoading] = useState(false); // Загрузка
  const [currentCards, setCurrentCards] = useState(cards.slice(0, 2).reverse()); // Текущие карточки
  const cardDupl = useRef(null); // Предыдущая карта
  const curDate = new Date(); // Текущая дата

  // Подтверждение правильного ответа
  const confirmCorrectAnswer = card => {
    cardDupl.current = JSON.stringify(card);
    let multiply;
    if (curDate < new Date(card.nextRepeat)) multiply = 1;
    else multiply = 2;
    if (!card.wrongAnswer) {
      card.nextRepeat = MainFunctions.addDays(curDate, card.repeatInterval);
      card.repeatInterval *= multiply;
      MainFunctions.request(`cards/${card.id}`, 'PUT', {
        ...card,
      });
    }
    setCards(cards.slice(1));
  };

  // Подтверждение неправильного ответа
  const confirmWrongAnswer = async card => {
    cardDupl.current = JSON.stringify(card);
    if (!card.wrongAnswer) {
      card.repeatInterval /= card.repeatInterval != 1 ? 2 : 1;
      card.nextRepeat = MainFunctions.addDays(curDate, card.repeatInterval);
      await MainFunctions.request(`cards/${card.id}`, 'PUT', {
        ...card,
      });
    }
    card.wrongAnswer = true;
    setCards([...cards.slice(1), card]);
  };

  // Кнопка отмены
  const cancel = async () => {
    const duplParsed = JSON.parse(cardDupl.current);
    try {
      if (cardDupl.current) {
        if (duplParsed.id != currentCards[1].id){
        setCards([
          duplParsed,
          ...cards.filter(c => c.id != cardDupl.current.id),
        ]);
        MainFunctions.request(
          `cards/${duplParsed.id}`,
          'PUT',
          duplParsed,
        );}
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Получение карточек
  const getCards = async () => {
    setLoading(true);
    // Карточки по коллекции
    if (route.params.sourceValue == 'collection') {
      let tempCards = await MainFunctions.loadCollectionCards(
        route.params.source,
      );
      // Рекомендованные карточки
      if (route.params.cards == 'recommended') {
        tempCards = tempCards.filter(c => new Date(c.nextRepeat) <= new Date());
      }
      setCards(tempCards);
      // Карточки по папке
    } else if (route.params.sourceValue == 'folder') {
      if (UserData.collections == null) {
        await MainFunctions.loadUserCollections();
      }
      let collections = [];
      if (route.params.source == 0) {
        collections = UserData.collections
          .filter(c => !c.folder)
          .map(c => c.id);
      } else {
        collections = UserData.collections
          .filter(c => c.folder == route.params.source)
          .map(c => c.id);
      }
      const cardCollections = await MainFunctions.request(
        'cardcollections',
      ).then(res =>
        res.filter(c => collections.includes(c.collection)).map(c => c.card),
      );
      let tempCards = await MainFunctions.request('cards').then(
        res => (tempCards = res.filter(c => cardCollections.includes(c.id))),
      );
      // Рекомендованные карточки
      if (route.params.cards == 'recommended') {
        tempCards = tempCards.filter(c => new Date(c.nextRepeat) <= curDate);
        console.log(tempCards);
      }
      setCards(tempCards);
      // Все карточки
    } else {
      let tempCards;
      await MainFunctions.request('cards').then(
        res => (tempCards = res.filter(c => c.creator == UserData.user.id)),
      );
      // Рекомендованные карточки
      if (route.params.cards == 'recommended') {
        tempCards = tempCards.filter(c => new Date(c.nextRepeat) <= curDate);
      }
      setCards(tempCards);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    setCurrentCards(cards.slice(0, 2).reverse());
  }, [cards]);

  return (
    <View style={[styles.container, {padding: 0}]}>
      <TopBar
        navigation={navigation}
        barStyle={{position: 'absolute', top: 0}}
      />
      {loading ? (
        <ActivityIndicator size={40} color={purp} />
      ) : cards.length > 0 ? (
        <View style={{justifyContent: 'center', width: '100%', height: '100%'}}>
          {currentCards.map(card => {
            return (
              <Card
                key={card.id}
                card={card}
                yesFunc={() => confirmCorrectAnswer(card)}
                noFunc={() => confirmWrongAnswer(card)}
                img={card.image}
                example={card.example}
                transcription={card.transcription}
              />
            );
          })}
        </View>
      ) : (
        <Text style={{margin: 20, fontSize: 20}}>
          Слов для повторения недостаточно. Добавьте новые слова или измените
          Параметры повторения
        </Text>
      )}
      <TouchableOpacity
        onPress={cancel}
        activeOpacity={1}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 20,
          borderColor: purp,
          borderWidth: 2,
          borderRadius: 10000,
          padding: 10,
        }}>
        <IonIcons name="return-up-back-outline" color={purp} size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default StudySession;
