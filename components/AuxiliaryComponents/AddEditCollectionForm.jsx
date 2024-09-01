import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Switch} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {screenHeight, styles} from '../../globals/gstyles';
import React from 'react';
import UserData from '../../globals/Data';
import MainFunctions from '../../globals/MainFunctions';
import DropDownPicker from 'react-native-dropdown-picker';

const AddEditCollectionForm = ({editedItem, setSuccess, folderId}) => {
  const [name, setName] = useState(''); // Название коллекции
  const [description, setDescription] = useState(''); // Описание коллекции
  const [isPrivate, setIsPrivate] = useState(UserData.user.private); // Приватность коллекции
  const [loading, setLoading] = useState(false); // Загрузка
  const [folderOpen, setFolderOpen] = useState(false); // Открытие выбора папки
  const [folderValue, setFolderValue] = useState(); // Выбранная папка
  const [folderItems, setFolderItems] = useState([]); // Папки
  const [termlangOpen, setTermlangOpen] = useState(false); // Открытие выбора языка термина
  const [termlangValue, setTermlangValue] = useState(null); // Выбранный язык термина
  const [termlangItems, setTermlangItems] = useState([]); // Языки (термин)
  const [definitionlangOpen, setDefinitionlangOpen] = useState(false); // Открытие выбора языка определения
  const [definitionlangValue, setDefinitionlangValue] = useState(null); // Выбранный язык определения
  const [definitionlangItems, setDefinitionlangItems] = useState([]); // Языки (определение)
  const [isFolderPrivate, setIsFolderPrivate] = useState();

  // Загрузка папок и языков в выпадающие списки
  const loadFolders = async () => {
    if (UserData.folders == null) {
      const folders = await MainFunctions.request('folders');
      UserData.folders = folders.filter(f => f.creator == UserData.user.id);
    }
    if (UserData.langs == null) {
      const langs = await MainFunctions.request('languages');
      UserData.langs = langs;
    }

    setFolderItems(UserData.folders);
    setTermlangItems(UserData.langs);
    setDefinitionlangItems(UserData.langs);
  };

  // Получение приватности выбранной папки
  const getIsPrivate = () => {
    const folder = folderItems.filter(f => f.id == folderValue)[0];
    if (folder) {
      setIsFolderPrivate(folder.private);
      if (folder.private) {
        setIsPrivate(true);
      }
    }
  };

  // Получение данных при открытии компонента
  useEffect(() => {
    loadFolders();
    if (editedItem) {
      setName(editedItem.name);
      setDescription(editedItem.description);
      setIsPrivate(editedItem.private);
      setFolderValue(editedItem.folder);
      setTermlangValue(editedItem.termLang);
      setDefinitionlangValue(editedItem.definitionLang);
    }
    if (folderId) {
      setFolderValue(folderId);
    }
  }, []);

  // Обновление папок
  useEffect(() => {
    loadFolders();
  }, [UserData.folders]);

  // Получение приватности папки при выборе папки
  useEffect(() => {
    if (folderValue) {
      getIsPrivate();
    }
  }, [folderValue]);

  // Нажатие на кнопку добавить/сохранить
  const addEditClicked = async () => {
    setLoading(false);

    // Сообщение об ошибках ввода
    let errors = '';
    if (name.trim().length == 0) {
      errors += 'Введите название\n';
    }

    if (errors.length > 0) {
      Alert.alert('Не все обязательные поля были заполнены', errors, [
        {text: 'Ок'},
      ]);
      setLoading(false);
      return;
    }

    // Заполнение коллекции
    const collection = {
      name,
      description,
      folder: folderValue,
      creator: UserData.user.id,
      private: isPrivate,
      termLang: termlangValue || null,
      definitionLang: definitionlangValue || null,
    };
    try {
      // Редактирование колекции
      if (editedItem) {
        collection.id = editedItem.id;
        await MainFunctions.request(
          `collections/${editedItem.id}`,
          'PUT',
          collection,
        );
        UserData.collections = await MainFunctions.loadUserCollections();
        setSuccess(true);
      } else {
        // Добавление коллекции
        await MainFunctions.request('collections', 'POST', collection);
        setSuccess(true);
        UserData.collections = await MainFunctions.loadUserCollections();

        setName(null);
        setDescription(null);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{alignContent: 'center', flex: 1, width: '100%'}}>
      <Text style={styles.bigLabel}>Коллекция</Text>
      <TextInput
        value={name}
        placeholder="Название"
        maxLength={50}
        onChangeText={setName}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <TextInput
        value={description}
        placeholder="Описание (необязательно)"
        maxLength={300}
        onChangeText={setDescription}
        style={[styles.outlinedInput, {maxHeight: screenHeight / 9}]}
        multiline={true}
        scrollEnabled={true}
        numberOfLines={3}
        selectionColor="#9a64ba"
      />
      <DropDownPicker
        language="RU"
        placeholder="Выберите папку (необязательно)"
        schema={{
          label: 'name',
          value: 'id',
        }}
        open={folderOpen}
        value={folderValue}
        items={folderItems}
        setOpen={setFolderOpen}
        setValue={setFolderValue}
        setItems={setFolderItems}
        searchable={true}
        onOpen={() => {
          setTermlangOpen(false);
          setDefinitionlangOpen(false);
        }}
        style={[styles.outlinedInput, {width: 'auto'}]}
      />
      {!UserData.user.private && !isFolderPrivate && (
        <View style={{flexDirection: 'row'}}>
          <Text style={{alignSelf: 'center'}}>Сделать коллекцию приватной</Text>
          <Switch value={isPrivate} onValueChange={setIsPrivate} />
        </View>
      )}
      <DropDownPicker
        language="RU"
        placeholder="Выберите язык термина (необязательно)"
        schema={{
          label: 'name',
          value: 'id',
        }}
        open={termlangOpen}
        value={termlangValue}
        items={termlangItems}
        setOpen={setTermlangOpen}
        setValue={setTermlangValue}
        setItems={setTermlangItems}
        searchable={true}
        onOpen={() => {
          setFolderOpen(false);
          setDefinitionlangOpen(false);
        }}
        style={[styles.outlinedInput, {width: 'auto'}]}
      />
      <DropDownPicker
        language="RU"
        placeholder="Выберите язык определения (необязательно)"
        schema={{
          label: 'name',
          value: 'id',
        }}
        open={definitionlangOpen}
        value={definitionlangValue}
        items={definitionlangItems}
        setOpen={setDefinitionlangOpen}
        setValue={setDefinitionlangValue}
        setItems={setDefinitionlangItems}
        searchable={true}
        onOpen={() => {
          setFolderOpen(false);
          setTermlangOpen(false);
        }}
        style={[styles.outlinedInput, {width: 'auto'}]}
      />
      <TouchableOpacity style={styles.button} onPress={addEditClicked}>
        <Text style={styles.buttonText}>
          {editedItem ? 'Сохранить' : 'Добавить'}
        </Text>
        {loading && <ActivityIndicator color="white" size={25} />}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default AddEditCollectionForm;
