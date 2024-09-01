import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainFunctions from '../../globals/MainFunctions.js';
import CardsList from '../AuxiliaryComponents/CardsList.jsx';
import UserData from '../../globals/Data.js';
import {purp, styles} from '../../globals/gstyles.js';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopBar from '../AuxiliaryComponents/TopBar.jsx';
import Octicons from 'react-native-vector-icons/Octicons.js';
import {useFocus} from '../AuxiliaryComponents/useFocus.jsx';

const FoldersPage = ({navigation, scrollHeight, userId}) => {
  const [folders, setFolders] = useState([]); // Папки
  const [currentFolders, setCurrentFolders] = useState([]); // Папки, отображаемые на странице
  const [loading, setLoading] = useState(false); // Загрузка
  const [search, setSearch] = useState(''); // Поисковой запрос
  const {focusCount, isFocused} = useFocus();

  // Получение папок
  const load = async () => {
    setLoading(true);
    let userFolders;
    const etc = {
      id: 0,
      name: 'Другое',
      description: 'Эта папка для коллекций, не распределённых в другие папки',
      readOnly: true,
    };
    if (!UserData.folders || userId) {
      userFolders = await MainFunctions.loadFolders(userId);
      userFolders = [...userFolders, etc];
    } else {
      userFolders = [...UserData.folders, etc];
    }
    setFolders(userFolders);
    setCurrentFolders(userFolders);
    setLoading(false);
  };

  // Удаление папки
  const handleDelete = async id => {
    Alert.alert(
      'Подтверждение удаления',
      'Вы уверены, что хотите удалить выбранную папку?',
      [
        {
          text: 'Да',
          onPress: () => {
            setLoading(true);
            MainFunctions.request(`folders/${id}`, 'DELETE').then(() => {
              UserData.folders = UserData.folders.filter(f => f.id != id);
              load();
              setLoading(false);
            });
          },
        },
        {
          text: 'Нет',
        },
      ],
    );
  };

  // Нажатие на папку
  const press = id => {
    navigation.navigate('Collections', {folderId: id, userId});
  };

  // Изменение поискового запроса
  useEffect(() => {
    try {
      if (search) {
        const searchLowered = search.toLowerCase();
        setCurrentFolders(
          folders.filter(
            i =>
              i.name.toLowerCase().includes(searchLowered) ||
              i.description?.toLowerCase().includes(searchLowered),
          ),
        );
      } else {
        setCurrentFolders(folders);
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

  useEffect(() => {
    load();
  }, [])

  return (
    <SafeAreaView style={{height: '100%'}}>
      <TopBar
        reload={() => {
          UserData.folders = null;
          load();
        }}
        onChange={setSearch}
        value={search}
      />
      {loading ? (
        <ActivityIndicator size={40} color={purp} />
      ) : (
        <View>
          <CardsList
            navigation={navigation}
            entity="folders"
            array={currentFolders}
            press={press}
            reload={() => {
              UserData.folders = null;
              load();
            }}
            handleDelete={id => handleDelete(id)}
            scrollHeight={scrollHeight || '94%'}
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
            value: 'folder',
          });
        }}>
        <Octicons name="diff-added" size={40} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FoldersPage;
