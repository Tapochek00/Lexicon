import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles, purp} from '../../globals/gstyles';
import UserData from '../../globals/Data';
import MainFunctions from '../../globals/MainFunctions';
import {Switch, Banner} from 'react-native-paper';
import bcrypt from 'bcryptjs';

const SettingsPage = ({navigation}) => {
  const [login, setLogin] = useState(UserData.user.login); // Логин
  const [username, setUsername] = useState(UserData.user.username); // Имя пользователя
  const [changePassword, setChangePassword] = useState(false); // Изменение пароля
  const [oldPassword, setOldPassword] = useState(''); // Старый пароль
  const [password, setPassword] = useState(''); // Новый пароль
  const [confirmPassword, setConfirmPassword] = useState(''); // Подтверждение пароля
  const [isPrivate, setIsPrivate] = useState(UserData.user.private); // Приватность профиля
  const [loading, setLoading] = useState(false); // Загрузка
  const [success, setSuccess] = useState(false); // Переменная для вывода сообщения об успешном изменении

  // Нажатие на кнопку "Сохранить изменения"
  const save = async () => {
    setLoading(true);
    // Проверка введённых данных
    let errors = '';
    try {
      if (changePassword && password.trim().length == 0) {
        errors += 'Введите пароль\n';
      } else if (changePassword && password != confirmPassword) {
        errors += 'Введённые пароли не совпадают\n';
      } else if (changePassword) {
        const isPasswordCorrect = await bcrypt.compare(
          oldPassword,
          UserData.user.password,
        );
        if (!isPasswordCorrect) {
          errors += 'Старый пароль введён неверно';
        }
      }
      if (login.trim().length == 0) {
        errors += 'Введите логин';
      } else {
        const res = await MainFunctions.request('users');
        const usersWithLogin = res.filter(u => u.login == login);
        if (usersWithLogin.length > 0 && login != UserData.user.login) {
          errors += 'Пользователь с таким логином уже существует\n';
        }
      }
      if (username.trim().length == 0) {
        errors += 'Введите имя пользователя';
      }

      // Вывод ошибок
      if (errors.length > 0) {
        Alert.alert('Ошибка', errors, [{text: 'ок'}]);
        setLoading(false);
        return;
      }

      // Заполнение пользователя
      let hash;
      if (changePassword) {
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password.trim(), salt);
      }
      const user = {
        id: UserData.user.id,
        password: changePassword ? hash : UserData.user.password,
        private: isPrivate,
        login,
        username,
      };

      // Сохранение изменений в БД
      MainFunctions.request(`users/${user.id}`, 'PUT', user);
      UserData.user = user;
      Keyboard.dismiss();
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Удаление пользователя
  const deleteUser = () => {
    Alert.alert(
      'Подтверждение удаления аккаунта',
      'Вы уверены, что хотите удалить аккаунт?',
      [
        {
          text: 'Да',
          onPress: () => {
            MainFunctions.request(`users/${UserData.user.id}`, 'DELETE');
            navigation.navigate('LoginPage');
          },
        },
        {
          text: 'Отмена',
        },
      ],
    );
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [success]);

  return (
    <KeyboardAvoidingView style={[styles.container, {alignItems: 'stretch'}]}>
      <Banner
        style={[
          styles.bannerSuccess,
          {position: 'absolute', top: 0, alignSelf: 'center', marginTop: 10},
        ]}
        visible={success}>
        Изменения успешно сохранены
      </Banner>
      <Text>Логин</Text>
      <TextInput
        value={login}
        placeholder="Логин"
        maxLength={50}
        onChangeText={setLogin}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <Text>Имя пользователя</Text>
      <TextInput
        value={username}
        placeholder="Имя пользователя"
        maxLength={50}
        onChangeText={setUsername}
        style={styles.outlinedInput}
        selectionColor="#9a64ba"
      />
      <Text
        onPress={() => setChangePassword(!changePassword)}
        style={[styles.button, {backgroundColor: '#a3a3a3'}]}>
        Сменить пароль
      </Text>
      {changePassword && (
        <View>
          <TextInput
            value={oldPassword}
            placeholder="Старый пароль"
            secureTextEntry={true}
            onChangeText={setOldPassword}
            style={styles.outlinedInput}
            selectionColor="#9a64ba"
          />
          <TextInput
            value={password}
            placeholder="Новый пароль"
            secureTextEntry={true}
            onChangeText={setPassword}
            style={styles.outlinedInput}
            selectionColor="#9a64ba"
          />
          <TextInput
            value={confirmPassword}
            placeholder="Подтвердите пароль"
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
            style={styles.outlinedInput}
            selectionColor="#9a64ba"
          />
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        <Text style={{alignSelf: 'center'}}>Сделать профиль приватным</Text>
        <Switch value={isPrivate} onValueChange={setIsPrivate} />
      </View>
      {loading && <ActivityIndicator size={40} color={purp} />}
      <Text onPress={save} style={[styles.button]}>
        Сохранить изменения
      </Text>
      <Text
        onPress={deleteUser}
        style={[styles.button, {backgroundColor: '#fe654f'}]}>
        Удалить профиль
      </Text>
    </KeyboardAvoidingView>
  );
};

export default SettingsPage;
