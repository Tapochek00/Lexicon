import {View, ActivityIndicator, Alert, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import CardsList from '../AuxiliaryComponents/CardsList';
import MainFunctions from '../../globals/MainFunctions';
import UserData from '../../globals/Data';
import {purp, styles} from '../../globals/gstyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Octicons from 'react-native-vector-icons/Octicons';
import TopBar from '../AuxiliaryComponents/TopBar';

const CardsPage = ({navigation, route}) => {
  const [cards, setCards] = useState([]); // Карточки
  const [currentCards, setCurrentCards] = useState([]); // Карточки, отображаемые на странице
  const [loading, setLoading] = useState(false); // Загрузка
  const [search, setSearch] = useState(''); // Поисковой запрос

  // Получение карточек
  const getCards = async () => {
    setLoading(true);
    const res = await MainFunctions.loadCollectionCards(
      route.params.collectionId,
    );
    if (res) {
      setCurrentCards(res);
      setCards(res);
    }
    setLoading(false);
  };

  // Удаление карточки из текущей коллекции
  const deleteFromHere = async id => {
    const res = await MainFunctions.request('cardcollections');
    const forCurrentCard = res.filter(c => c.card == id);
    if (forCurrentCard.length > 1) {
      MainFunctions.request(`cardcollections/${cardcollectionId}`, 'DELETE');
    } else {
      await MainFunctions.request(`cards/${id}`, 'DELETE');
    }
    getCards();
  };

  // Удаление карточки
  const handleDelete = async id => {
    setLoading(true);
    Alert.alert(
      'Подтверждение удаления',
      'Откуда вы хотите удалить выбранную карточку?',
      [
        {
          text: 'Отмена',
        },
        {
          text: 'Из этой коллекции',
          onPress: () => {
            deleteFromHere(id);
          },
        },
        {
          text: 'Из всех коллекций',
          onPress: () => {
            MainFunctions.request(`cards/${id}`, 'DELETE').then(() => {
              getCards();
            });
          },
        },
      ],
    );
    getCards();
    setLoading(false);
  };

  // Изменение поискового запроса
  useEffect(() => {
    try {
      if (search) {
        const searchLowered = search.toLowerCase();
        setCurrentCards(
          cards.filter(
            i =>
              i.term.toLowerCase().includes(searchLowered) ||
              i.definition.toLowerCase().includes(searchLowered),
          ),
        );
      } else {
        setCurrentCards(cards);
      }
    } catch (err) {
      console.log(err);
    }
  }, [search]);

  // Получение данных при открытии страницы
  useEffect(() => {
    getCards();
  }, []);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <TopBar
        reload={getCards}
        onChange={setSearch}
        value={search}
        navigation={navigation}
      />
      {loading ? (
        <ActivityIndicator size={40} color={purp} />
      ) : (
        <View style={{paddingBottom: 10, height: '90%'}}>
          <CardsList
            navigation={navigation}
            entity="cards"
            array={currentCards}
            press={() => {}}
            reload={getCards}
            handleDelete={handleDelete}
            collection={route.params.collectionId}
            scrollHeight="auto"
          />
        </View>
      )}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          paddingHorizontal: 5,
          paddingVertical: 3,
          backgroundColor: purp,
          borderRadius: 5,
        }}
        onPress={() => {
          navigation.navigate('AddPage', {
            collectionId: route.params.collectionId,
            value: 'card',
          });
        }}>
        <Octicons name="diff-added" size={40} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CardsPage;
