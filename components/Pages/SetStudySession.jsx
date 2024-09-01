import {View, Text, StyleSheet} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../../globals/gstyles';
import {RadioButton} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import UserData from '../../globals/Data';
import MainFunctions from '../../globals/MainFunctions';

const SetStudySession = ({navigation}) => {
  const [sourceValue, setSourceValue] = useState(''); // Источник карточек
  const [collections, setCollections] = useState([]); // Коллекции
  const [collectionsOpen, setCollectionsOpen] = useState(false); // Открытие выбора коллекции
  const [collectionsValue, setCollectionsValue] = useState(null); // Выбранная коллекция
  const [folderOpen, setFolderOpen] = useState(false); // Открытие выбора папки
  const [folderValue, setFolderValue] = useState(null); // Выбранная папка
  const [folderItems, setFolderItems] = useState([]); // Папки
  const [cards, setCards] = useState(''); // Карточки для повторения (рекомендованные/все)
  const [chosen, setChosen] = useState(false); // Выбрана ли коллекция/папка

  // Загрузка коллекций
  const loadCollections = async () => {
    if (UserData.collections == null) {
      const res = await MainFunctions.request('collections');
      UserData.collections = res.filter(c => c.creator == UserData.user.id);
    }

    const folders = await MainFunctions.request("folders");
    const foldersDict = {};
    folders.map(f => {
      foldersDict[f.id] = f.name;
    })
    foldersDict[null] = "Другое"
    
    const temp = [];
    UserData.collections.map(c => {
      temp.push({
        label: `${c.name} (${foldersDict[c.folder]})`,
        value: c.id,
      });
    });
    setCollections(temp);
  };

  // Загрузка папок
  const loadFolders = async () => {
    if (UserData.folders == null) {
      await MainFunctions.loadFolders();
    }
    if (UserData.collections == null) {
      await MainFunctions.loadUserCollections();
    }

    const cardCollections = await MainFunctions.request('cardcollections').then(
      res => res.map(c => c.collection),
    );
    const emptyCollections = UserData.collections.filter(
      c => !cardCollections.includes(c.id),
    );
    const folderCollections = UserData.folders.map(f => {
      return {
        id: f.id,
        collections: UserData.collections
          .filter(c => c.folder == f.id)
          .map(c => c.id),
      };
    });
    const emptyFolders = folderCollections
      .filter(
        f =>
          emptyCollections.filter(c => c.folder == f.id).length ==
          f.collections.length,
      )
      .map(f => f.id);

    const temp = [];
    UserData.folders.map(f => {
      if (!emptyFolders.includes(f.id)) {
        temp.push({
          label: f.name,
          value: f.id,
        });
      }
    });
    const emptyOrphanCollections = UserData.collections.filter(
      c => !c.folder && !cardCollections.includes(c.id),
    );
    if (emptyOrphanCollections.length > 0) {
      temp.push({
        label: 'Другое',
        value: 0,
      });
    }
    setFolderItems(temp);
  };

  // Нажатие на кнопку "Начать"
  const startPressed = () => {
    navigation.navigate('StudySession', {
      sourceValue,
      source:
        sourceValue == 'collection'
          ? collectionsValue
          : sourceValue == 'folder'
          ? folderValue
          : null,
      cards,
    });
  };

  useEffect(() => {
    if (sourceValue == 'collection') {
      loadCollections();
    } else if (sourceValue == 'folder') {
      loadFolders();
    }
  }, [sourceValue]);

  useEffect(() => {
    setChosen(collectionsValue != null || folderValue != null);
  }, [collectionsValue, folderValue]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {justifyContent: 'flex-start', alignItems: 'flex-start'},
      ]}>
      <Text style={[styles.biggerLabel, {alignSelf: 'center'}]}>
        Параметры повторения
      </Text>
      <Text style={styles.bigLabel}>Источник карточек</Text>
      <RadioButton.Group
        value={sourceValue}
        onValueChange={val => {
          setSourceValue(val);
          setChosen(val == 'all');
        }}>
        <View style={style.radiobutton}>
          <RadioButton value="collection" />
          <Text>Коллекция</Text>
        </View>
        <View style={style.radiobutton}>
          <RadioButton value="folder" />
          <Text>Папка</Text>
        </View>
        <View style={style.radiobutton}>
          <RadioButton value="all" />
          <Text>Все карточки</Text>
        </View>
      </RadioButton.Group>
      {sourceValue == 'collection' && (
        <DropDownPicker
          language="RU"
          placeholder="Выберите коллекцию"
          open={collectionsOpen}
          value={collectionsValue}
          items={collections}
          setOpen={setCollectionsOpen}
          setValue={setCollectionsValue}
          setItems={setCollections}
          searchable={true}
          style={[styles.outlinedInput, {width: 'auto'}]}
        />
      )}
      {sourceValue == 'folder' && (
        <DropDownPicker
          language="RU"
          placeholder="Выберите папку"
          open={folderOpen}
          value={folderValue}
          items={folderItems}
          setOpen={setFolderOpen}
          setValue={setFolderValue}
          setItems={setFolderItems}
          searchable={true}
          style={[styles.outlinedInput, {width: 'auto'}]}
        />
      )}
      <Text style={styles.bigLabel}>Карточки для повторения</Text>
      <RadioButton.Group value={cards} onValueChange={setCards}>
        <View style={style.radiobutton}>
          <RadioButton value="recommended" />
          <Text>Рекомендованные карточки</Text>
        </View>
        <View style={style.radiobutton}>
          <RadioButton value="all" />
          <Text>Все карточки</Text>
        </View>
      </RadioButton.Group>
      {sourceValue && chosen && cards && (
        <Text
          onPress={startPressed}
          style={[
            styles.button,
            {marginTop: 25, width: '95%', alignSelf: 'center'},
          ]}>
          Начать
        </Text>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  radiobutton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SetStudySession;
