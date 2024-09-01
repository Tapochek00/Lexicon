import {
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MainFunctions from '../../globals/MainFunctions';
import UserData from '../../globals/Data';
import bcrypt from 'bcryptjs';
import {purp, styles} from '../../globals/gstyles';

const LoginPage = ({navigation}) => {
  const [login, setLogin] = useState(''); // Логин
  const [password, setPassword] = useState(''); // Пароль
  const [loading, setLoading] = useState(false); // Загрузка

  // Авторизация
  const signin = async () => {
    setLoading(true);
    try {
      // Поиск пользователя с введённым логином
      const users = await MainFunctions.request('users');
      const user = users.find(u => u.login == login);

      if (!user) {
        setLoading(false);
        Alert.alert(
          'Пользователь не найден',
          'Пользователь с таким логином не найден',
          [{text: 'Ок'}],
        );
      } else {
        // Проверка пароля
        await bcrypt.compare(password, user.password).then(res => {
          if (res) {
            UserData.user = user;
            UserData.folders = null;
            UserData.collections = null;
            setLogin('');
            setPassword('');
            navigation.navigate('MainPage');
          } else {
            Alert.alert(
              'Пароль неверен',
              'Проверьте корректность введённых данных',
              [{text: 'Ок'}],
            );
          }
        });
      }
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  const signup = async () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={[styles.header, {color: 'black'}]}>Авторизация</Text>
        <TextInput
          value={login}
          placeholder="Логин"
          onChangeText={setLogin}
          style={styles.input}
          selectionColor="#9a64ba"
          placeholderTextColor="#a3a3a3"
        />
        <TextInput
          value={password}
          placeholder="Пароль"
          secureTextEntry={true}
          onChangeText={setPassword}
          style={styles.input}
          selectionColor="#9a64ba"
          placeholderTextColor="#a3a3a3"
        />
        {loading && <ActivityIndicator size={40} color={purp} />}
        <Text onPress={signin} style={[styles.button, {marginTop: 25}]}>
          Вход
        </Text>
        <Text onPress={signup} style={[styles.buttonText, {color: purp}]}>
          Регистрация
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;
