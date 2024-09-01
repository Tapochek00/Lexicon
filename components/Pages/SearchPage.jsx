import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import TopBar from '../AuxiliaryComponents/TopBar';
import MainFunctions from '../../globals/MainFunctions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../../globals/gstyles';
import SearchPageItem from '../AuxiliaryComponents/SearchPageItem';

const SearchPage = ({navigation}) => {
  const [searchText, setSearch] = useState(''); // Поисковой запрос
  const [folders, setFolders] = useState([]); // Папки
  const [foundFolders, setFoundFolders] = useState([]); // Найденные папки
  const [collections, setCollections] = useState([]); // Коллекции
  const [foundCollections, setFoundCollections] = useState([]); // Найденные коллекции
  const [users, setUsers] = useState([]); // Пользователи
  const [foundUsers, setFoundUsers] = useState([]); // Найденные пользователи

  // Получение данных
  const getData = async () => {
    const folders_res = await MainFunctions.request('folders');
    const collections_res = await MainFunctions.request('collections');
    const users_res = await MainFunctions.request('users');
    setFolders(
      folders_res.filter(
        f => !f.private && !users_res.find(i => i.id == f.creator).private,
      ),
    );
    setCollections(
      collections_res.filter(
        c => !c.private && !users_res.find(i => i.id == c.creator).private,
      ),
    );
    setUsers(users_res.filter(u => !u.private));
  };

  // Нажатие на найденную папку
  const foldersPress = id => {
    navigation.push('Collections', {folderId: id});
  };

  // Нажатие на найденную коллекцию
  const collectionsPress = id => {
    navigation.push('Cards', {collectionId: id});
  };

  // Нажатие на найденного пользователя
  const usersPress = id => {
    navigation.push('Profile', {userId: id});
  };

  // Поиск
  const search = async () => {
    if (searchText.length > 2) {
      const searchLowered = searchText.toLowerCase();
      try {
        setFoundFolders(
          folders.filter(
            f =>
              f.name.toLowerCase().includes(searchLowered) ||
              f.description?.toLowerCase().includes(searchLowered),
          ),
        );
      } catch {}
      try {
        setFoundCollections(
          collections.filter(
            c =>
              c.name.toLowerCase().includes(searchLowered) ||
              c.description?.toLowerCase().includes(searchLowered),
          ),
        );
      } catch {}
      try {
        setFoundUsers(
          users.filter(u => u.username.toLowerCase().includes(searchLowered)),
        );
      } catch {}
    } else {
      setFoundFolders([]);
      setFoundCollections([]);
      setFoundUsers([]);
    }
  };

  // Удаление папки
  const deleteFolder = id => {
    Alert.alert(
      'Подтверждение удаления',
      'Вы уверены, что хотите удалить выбранную папку?',
      [
        {
          text: 'Да',
          onPress: () => {
            MainFunctions.request(`folders/${id}`, 'DELETE').then(() => {
              getData();
              search();
            });
          },
        },
        {
          text: 'Нет',
        },
      ],
    );
  };

  // Удаление коллекции
  const deleteCollection = id => {
    Alert.alert(
      'Подтверждение удаления',
      'Вы уверены, что хотите удалить выбранную коллекцию?',
      [
        {
          text: 'Да',
          onPress: () => {
            MainFunctions.request(`collections/${id}`, 'DELETE').then(() => {
              getData();
              search();
            });
          },
        },
        {
          text: 'Нет',
        },
      ],
    );
  };

  // Получение данных при загрузке компонента
  useEffect(() => {
    getData();
  }, []);

  // Поиск при изменении поискового запроса
  useEffect(() => {
    search();
  }, [searchText]);

  return (
    <SafeAreaView>
      <TopBar
        value={searchText}
        onChange={setSearch}
        reload={() => {
          getData();
          search();
        }}
      />
      {searchText.length > 2 ? (
        <ScrollView style={{height: '88%'}}>
          <SearchPageItem
            label="Папки"
            array={foundFolders}
            press={foldersPress}
            entity="folders"
            handleDelete={deleteFolder}
          />
          <SearchPageItem
            label="Коллекции"
            array={foundCollections}
            press={collectionsPress}
            entity="collections"
            handleDelete={deleteCollection}
          />
          <SearchPageItem
            label="Пользователи"
            array={foundUsers}
            press={usersPress}
            entity="users"
          />
        </ScrollView>
      ) : (
        <Text style={styles.notFound}>Введите запрос</Text>
      )}
    </SafeAreaView>
  );
};

export default SearchPage;
