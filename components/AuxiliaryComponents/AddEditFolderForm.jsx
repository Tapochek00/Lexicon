import {
  Text,
  KeyboardAvoidingView,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {screenHeight, screenWidth, styles} from '../../globals/gstyles';
import {Switch} from 'react-native-paper';
import UserData from '../../globals/Data';
import MainFunctions from '../../globals/MainFunctions';

const AddEditFolderForm = ({editedItem, setSuccess}) => {
  const [name, setName] = useState(''); // Название папки
  const [description, setDescription] = useState(''); // Описание папки
  const [isPrivate, setIsPrivate] = useState(UserData.user.private); // Приватность
  const [loading, setLoading] = useState(false); // Загрузка

  // Загрузка данных при открытии страницы
  useEffect(() => {
    if (editedItem) {
      setName(editedItem.name);
      setDescription(editedItem.description);
      setIsPrivate(editedItem.private);
    }
  }, []);

  // Нажатие на кнопку добавить/сохранить
  const addEditClicked = async () => {
    setLoading(true);
    if (name.trim().length > 0) {
      // Заполнение папки
      const folder = {
        name,
        description,
        private: isPrivate,
        creator: UserData.user.id,
      };
      try {
        if (editedItem) {
          // Редактирование папки
          folder.id = editedItem.id;
          await MainFunctions.request(
            `folders/${editedItem.id}`,
            'PUT',
            folder,
          );
          UserData.folders = await MainFunctions.loadFolders();
          setSuccess(true);
        } else {
          // Создание папки
          await MainFunctions.request('folders', 'POST', folder);
          UserData.folders = await MainFunctions.loadFolders();
          setName('');
          setDescription('');
          setSuccess(true);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      Alert.alert(
        'Не все обязательные поля были заполнены',
        'Введите название',
        [{text: 'ок'}],
      );
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{alignContent: 'center', flex: 1, width: '100%'}}>
      <Text style={styles.bigLabel}>Папка</Text>
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
        style={[styles.outlinedInput, {maxHeight: screenHeight/9}]}
        multiline={true}
        numberOfLines={3}
        scrollEnabled={true}
        selectionColor="#9a64ba"
      />
      {!UserData.user.private && (
        <View style={{flexDirection: 'row'}}>
          <Text style={{alignSelf: 'center'}}>Сделать папку приватной</Text>
          <Switch value={isPrivate} onValueChange={setIsPrivate} />
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={addEditClicked}>
        <Text
          style={styles.buttonText}>
          {editedItem ? 'Сохранить' : 'Добавить'}
        </Text>
        {loading && <ActivityIndicator color="white" size={25} />}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default AddEditFolderForm;
