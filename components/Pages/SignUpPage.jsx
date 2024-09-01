import {
  View,
  Text,
  StyleSheet,
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
import {styles, purp} from '../../globals/gstyles';

const SignUpPage = ({navigation}) => {
  const [login, setLogin] = useState(''); // Логин
  const [password, setPassword] = useState(''); // Пароль
  const [confirmPassword, setConfirmPassword] = useState(''); // Подтверждение пароля
  const [username, setUsername] = useState(''); // Имя пользователя
  const [loading, setLoading] = useState(false); // Загрузка

  const signup = async () => {
    if (password.length > 0 && login.length > 0 && username.length > 0) {
      setLoading(true);
      const users = await MainFunctions.request('users');
      if (users.filter(u => u.login == login).length > 0) {
        Alert.alert(
          'Пользователь с таким логином уже существует',
          'Логин должен быть уникальным',
          [{text: 'ок'}],
        );
      } else if (password != confirmPassword) {
        Alert.alert(
          'Введённые пароли не совпадают',
          'Введённые пароли не совпадают',
          [{text: 'ок'}],
        );
      } else {
        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(password.trim(), salt);
        const user = {
          password: hash,
          private: false,
          login: login.trim(),
          username,
        };
        try {
          const res = await MainFunctions.request('users', 'POST', user);
          if (res) {
            UserData.user = res;
            UserData.folders = null;
            UserData.collections = null;
            setLogin('');
            setPassword('');
            setConfirmPassword('');
            setUsername('');
            navigation.navigate('MainPage');
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      Alert.alert(
        'Заполните все поля',
        'Заполните поля логин, имя пользователя и пароль',
        [{text: 'ок'}],
      );
    }
    setLoading(false);
  };

  const signin = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={styles.header}>Регистрация</Text>
        <TextInput
          value={login}
          placeholder="Логин"
          maxLength={50}
          onChangeText={setLogin}
          style={styles.input}
          selectionColor="#9a64ba"
        />
        <TextInput
          value={username}
          placeholder="Имя пользователя"
          maxLength={50}
          onChangeText={setUsername}
          style={styles.input}
          selectionColor="#9a64ba"
        />
        <TextInput
          value={password}
          placeholder="Пароль"
          secureTextEntry={true}
          onChangeText={setPassword}
          style={styles.input}
          selectionColor="#9a64ba"
        />
        <TextInput
          value={confirmPassword}
          placeholder="Подтвердите пароль"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          style={styles.input}
          selectionColor="#9a64ba"
        />
        {loading && <ActivityIndicator size={40} color={purp} />}
        <Text onPress={signup} style={[styles.button, {marginTop: 25}]}>
          Регистрация
        </Text>
        <Text onPress={signin} style={[styles.buttonText, {color: purp}]}>
          Вход
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPage;
