import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserData from '../../globals/Data';
import {purp, screenHeight, styles} from '../../globals/gstyles';
import MainFunctions from '../../globals/MainFunctions';
import FoldersPage from './FoldersPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocus } from '../AuxiliaryComponents/useFocus';

const ProfilePage = ({navigation, route}) => {
  const [currentUser, setCurrentUser] = useState(null); // Пользователь, который будет отображён в профиле
  const [loading, setloading] = useState(false); // Загрузка
  const [stats, setStats] = useState(null); // Статистика (количество карточек, коллекций, папок)
  const {focusCount, isFocused} = useFocus();

  // Подсчёт статистики
  const getStats = async () => {
    setloading(true);
    const result = {};
    const folders = await MainFunctions.request('folders');
    const collections = await MainFunctions.request('collections');
    const cards = await MainFunctions.request('cards');
    result.folders = folders.filter(f => f.creator == currentUser.id).length;
    result.collections = collections.filter(
      c => c.creator == currentUser.id,
    ).length;
    result.cards = cards.filter(c => c.creator == currentUser.id).length;
    setStats(result);
    setloading(false);
  };

  useEffect(() => {
    setloading(true);
    if (route.params) {
      MainFunctions.request(`users/${route.params.userId}`).then(res => {
        setCurrentUser(res);
      });
    } else {
      setCurrentUser(UserData.user);
    }
    setloading(false);
  }, [isFocused]);

  useEffect(() => {
    if (!currentUser) {
      setloading(true);
    } else {
      getStats();
      setloading(false);
    }
  }, [currentUser]);
  
  return (
    <SafeAreaView>
      {loading ? (
        <ActivityIndicator size={40} color={purp} />
      ) : (
        currentUser && (
          <View>
            <View style={styles.profileInfo}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.username}>{currentUser.username}</Text>
                <TouchableOpacity onPress={getStats}>
                  <AntDesign name="reload1" size={30} color="#a3a3a3" />
                </TouchableOpacity>
              </View>
              {stats && (
                <Text style={styles.stats}>
                  Всего папок: {stats.folders}
                  {'\n'}
                  Всего коллекций: {stats.collections}
                  {'\n'}
                  Всего карточек: {stats.cards}
                </Text>
              )}
            </View>
            <View>
              <FoldersPage
                userId={currentUser.id}
                navigation={navigation}
                scrollHeight="63%"
              />
            </View>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default ProfilePage;
