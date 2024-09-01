import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState} from 'react';
import {styles} from '../../globals/gstyles';
import React from 'react';
import UserData from '../../globals/Data';
import MainFunctions from '../../globals/MainFunctions';
import DropDownPicker from 'react-native-dropdown-picker';
import {SegmentedButtons} from 'react-native-paper';

const AddEditCardForm = ({editedItem, collectionId, setSuccess}) => {
  const [term, setTerm] = useState(''); // Термин
  const [definition, setDefinition] = useState(''); // Определение
  const [example, setExample] = useState(''); // Пример
  const [image, setImage] = useState(''); // Изображение
  const [transcription, setTranscription] = useState(''); // Транскрипция
  const [loading, setLoading] = useState(false); // Загрузка
  const [collections, setCollections] = useState([]); // Коллекции
  const [collectionsOpen, setCollectionsOpen] = useState(false); // Открытие выбора коллекции
  const [collectionsValue, setCollectionsValue] = useState(); // Выбранная коллекция
  const [moveCardValue, setMoveCardValue] = useState('move'); // Перемещение/добавление карты в коллекцию при редактировании

  // Загрузка коллекций
  const loadCollections = async () => {
    if (UserData.collections == null) {
      const res = await MainFunctions.request('collections');
      UserData.collections = res.filter(c => c.creator == UserData.user.id);
    }

    const folders = await MainFunctions.request('folders');
    const foldersDict = {};
    folders.map(f => {
      foldersDict[f.id] = f.name;
    });
    foldersDict[null] = 'Другое';

    const temp = [];
    UserData.collections.map(c => {
      temp.push({
        label: `${c.name} (${foldersDict[c.folder]})`,
        value: c.id,
      });
    });
    setCollections(temp);
  };

  // Получение данных при открытии страницы
  useEffect(() => {
    loadCollections();
    if (editedItem) {
      MainFunctions.request('cardcollections').then(res => {
        const resFiltered = res.filter(
          c => c.card == editedItem.id && c.collection == collectionId,
        );
        setCollectionsValue(resFiltered[0].collection);
      });
      setTerm(editedItem.term);
      setDefinition(editedItem.definition);
      setExample(editedItem.example);
      setImage(editedItem.image);
      setTranscription(editedItem.transcription);
    }
    if (collectionId) {
      setCollectionsValue(collectionId);
    }
  }, []);

  // Редактирование карточки
  const editCard = async card => {
    card.id = editedItem.id;
    card.laststudied = editedItem.laststudied;
    card.repeatinterval = editedItem.repeatinterval;
    card.nextrepeat = editedItem.nextrepeat;
    await MainFunctions.request(`cards/${editedItem.id}`, 'PUT', card);
    const res = await MainFunctions.request('cardcollections');
    const allCurrentCardCollections = res.filter(c => c.card == editedItem.id);
    const currentCardcollection = allCurrentCardCollections.filter(
      c => c.collection == collectionId,
    );
    const collectionIds = allCurrentCardCollections.map(c => c.collection);
    if (moveCardValue == 'move') {
      // Перемещение карточки в другую коллекцию
      MainFunctions.request(
        `cardcollections/${currentCardcollection[0].id}`,
        'PUT',
        {
          card: editedItem.id,
          collection: collectionsValue,
          id: currentCardcollection[0].id,
        },
      ).then(setSuccess(true));
    } else if (!collectionIds.includes(collectionsValue)) {
      // Добавление карточки в другую коллекцию
      MainFunctions.request('cardcollections', 'POST', {
        card: editedItem.id,
        collection: collectionsValue,
      }).then(setSuccess(true));
    } else {
      Alert.alert('Ошибка', 'Карточка уже содержится в выбранной коллекции', [
        {text: 'Ок'},
      ]);
    }
  };

  // Добавление новой карточки
  const addCard = async card => {
    const cards = await MainFunctions.request('cards');
    const repeated = cards.filter(
      c => c.creator == UserData.user.id && c.term == card.term,
    );
    if (repeated.length > 0) {
      Alert.alert(
        'Подтверждение добавления',
        `У вас уже есть похожая карточка: ${repeated[0].term} - ${repeated[0].definition}.` +
          ' Вы уверены, что хотите добавить карточку?',
        [
          {
            text: 'Да',
            onPress: async () => {
              const res = await MainFunctions.request('cards', 'POST', card);
              const res2 = await MainFunctions.request(
                'cardcollections',
                'POST',
                {
                  collection: collectionsValue,
                  card: res.id,
                },
              );
              if (res && res2) {
                setSuccess(true);
              }
            },
          },
          {text: 'Отмена'},
        ],
      );
    } else {
      const res = await MainFunctions.request('cards', 'POST', card);
      const res2 = await MainFunctions.request('cardcollections', 'POST', {
        collection: collectionsValue,
        card: res.id,
      });
      if (res && res2) {
        setSuccess(true);
      }
    }
  };

  // Нажатие на кнопку добавить/сохранить
  const addEditClicked = async () => {
    setLoading(true);
    // Сообщение об ошибках ввода
    let errors = '';
    if (collectionsValue == null) {
      errors += 'Выберите коллекцию\n';
    }
    if (term.length == 0) {
      errors += 'Введите термин\n';
    }
    if (definition.length == 0) {
      errors += 'Введите определение';
    }

    if (errors.length > 0) {
      Alert.alert('Не все обязательные поля были заполнены', errors, [
        {text: 'Ок'},
      ]);
      setLoading(false);
      return;
    }

    // Заполнение карточки
    const currentdate = new Date();
    const datetime = MainFunctions.dateToString(currentdate);

    const card = {
      term,
      definition,
      transcription,
      example,
      image,
      nextrepeat: datetime,
      repeatinterval: 1,
      creator: UserData.user.id,
    };
    try {
      if (editedItem) {
        // Редактирование выбранной карточки
        editCard(card);
      } else {
        // Создание новой карточки
        addCard(card);
      }
      setTerm(null);
      setDefinition(null);
      setTranscription(null);
      setExample(null);
      setImage(null);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{alignContent: 'center', flex: 1, width: '100%'}}>
      <Text style={styles.bigLabel}>Карточка</Text>
      {editedItem && (
        <SegmentedButtons
          value={moveCardValue}
          onValueChange={setMoveCardValue}
          buttons={[
            {
              value: 'move',
              label: 'Переместить',
              labelStyle: {
                fontSize: 12,
              },
            },
            {
              value: 'add',
              label: 'Добавить в коллекцию',
              labelStyle: {
                fontSize: 12,
              },
            },
          ]}
          style={{marginBottom: 5}}
        />
      )}
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

      <TextInput
        value={term}
        placeholder="Термин"
        maxLength={300}
        onChangeText={setTerm}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <TextInput
        value={definition}
        placeholder="Определение"
        maxLength={300}
        onChangeText={setDefinition}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <TextInput
        value={transcription}
        placeholder="Транскрипция (необязательно)"
        maxLength={300}
        onChangeText={setTranscription}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <TextInput
        value={example}
        placeholder="Пример (необязательно)"
        maxLength={300}
        onChangeText={setExample}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <TextInput
        value={image}
        placeholder="URL изображения (необязательно)"
        maxLength={300}
        onChangeText={setImage}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
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

export default AddEditCardForm;
