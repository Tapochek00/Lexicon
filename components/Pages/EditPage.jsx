import {View, ScrollView, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import React, {useEffect, useState} from 'react';
import AddEditFolderForm from '../AuxiliaryComponents/AddEditFolderForm';
import {SafeAreaView} from 'react-native-safe-area-context';
import {purp, styles} from '../../globals/gstyles';
import MainFunctions from '../../globals/MainFunctions';
import AddEditCollectionForm from '../AuxiliaryComponents/AddEditCollectionForm';
import AddEditCardForm from '../AuxiliaryComponents/AddEditCardForm';
import {Banner} from 'react-native-paper';
import TopBar from '../AuxiliaryComponents/TopBar';

const EditPage = ({route, navigation}) => {
  const [edited, setEdited] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getEdited = async () => {
    setLoading(true);
    try {
      const res = await MainFunctions.request(
        `${route.params.entity}/${route.params.editedId}`,
      );
      setEdited(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    getEdited();
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [success]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          position: 'absolute',
          top: '0',
          width: '100%',
          height: '100%',
          paddingHorizontal: 0,
        },
      ]}>
      <TopBar navigation={navigation} barStyle={{marginTop: 24}}/>
      {loading ? (
        <ActivityIndicator size={40} color={purp} />
      ) : (
        <KeyboardAvoidingView style={{width: '100%', height: '100%', padding: 10}}>
          <Banner visible={success} style={styles.bannerSuccess}>
            Изменения успешно сохранены
          </Banner>
          <ScrollView>
          {route.params.entity == 'folders' && edited && (
            <AddEditFolderForm editedItem={edited} setSuccess={setSuccess} />
          )}
          {route.params.entity == 'collections' && edited && (
            <AddEditCollectionForm
              editedItem={edited}
              setSuccess={setSuccess}
            />
          )}
          {route.params.entity == 'cards' && edited && (
            <AddEditCardForm
              editedItem={edited}
              collectionId={route.params.collectionId}
              setSuccess={setSuccess}
            />
          )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default EditPage;
