import {View, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import CardsList from '../AuxiliaryComponents/CardsList';
import MainFunctions from '../../globals/MainFunctions';
import UserData from '../../globals/Data';
import {purp} from '../../globals/gstyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Octicons from 'react-native-vector-icons/Octicons';
import TopBar from '../AuxiliaryComponents/TopBar';
import {useFocus} from '../AuxiliaryComponents/useFocus';

const CollectionsPage = ({navigation, route}) => {
  const [collections, setCollections] = useState([]); // Коллекции
  const [currentCollections, setCurrentCollections] = useState([]); // Коллекции, отображаемые на странице
  const [loading, setLoading] = useState(false); // Загрузка
  const [search, setSearch] = useState(''); // Поисковой запрос
  const {focusCount, isFocused} = useFocus();

  // Получение колекций
  const load = async () => {
    setLoading(true);
    let folderCollections;
    UserData.collections = await MainFunctions.loadUserCollections();
    if (route.params.folderId) {
      folderCollections = await MainFunctions.loadFolderCollections(
        route.params.folderId,
      );
    } else {
      folderCollections = UserData.collections.filter(c => !c.folder);
    }
    setCollections(folderCollections);
    setCurrentCollections(folderCollections);
    setLoading(false);
  };

  // Удаление коллекции
  const handleDelete = async id => {
    Alert.alert(
      'Подтверждение удаления',
      'Вы уверены, что хотите удалить выбранную коллекцию?',
      [
        {
          text: 'Да',
          onPress: () => {
            setLoading(true);
            MainFunctions.request(`collections/${id}`, 'DELETE')
              .then(() => {
                UserData.collections = UserData.collections.filter(
                  c => c.id != id,
                );
                load();
                setLoading(false);
              })
              .catch(ex => console.log(ex));
          },
        },
        {
          text: 'Нет',
        },
      ],
    );
  };

  // Нажатие на коллекцию
  const press = id => {
    navigation.navigate('Cards', {collectionId: id});
  };

  // Изменение поискового запроса
  useEffect(() => {
    try {
      if (search) {
        const searchLowered = search.toLowerCase();
        setCurrentCollections(
          collections.filter(
            i =>
              i.name.toLowerCase().includes(searchLowered) ||
              i.description?.toLowerCase().includes(searchLowered),
          ),
        );
      } else {
        setCurrentCollections(collections);
      }
    } catch (err) {
      console.log(err);
    }
  }, [search]);

  useEffect(() => {
    if (isFocused) {
      load();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <TopBar
        reload={load}
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
            entity="collections"
            array={currentCollections}
            press={press}
            handleDelete={handleDelete}
            reload={load}
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
            folderId: route.params.folderId,
            value: 'collection',
          });
        }}>
        <Octicons name="diff-added" size={40} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CollectionsPage;
