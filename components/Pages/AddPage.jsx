import {Text, KeyboardAvoidingView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {screenHeight, screenWidth, styles} from '../../globals/gstyles';
import {Banner, SegmentedButtons} from 'react-native-paper';
import AddEditFolderForm from '../AuxiliaryComponents/AddEditFolderForm';
import AddEditCollectionForm from '../AuxiliaryComponents/AddEditCollectionForm';
import AddEditCardForm from '../AuxiliaryComponents/AddEditCardForm';

const AddPage = ({route}) => {
  const [value, setValue] = useState('');
  const [success, setSuccess] = useState(false);
  const [refreshCollection, setRefreshCollection] = useState(false);
  const [refreshCard, setRefreshCard] = useState(false);

  useEffect(() => {
    if (route.params) {
      setValue(route.params.value);
    }
  }, [route.params]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [success]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, {alignItems: 'center', marginTop: 10}]}>
      <Banner style={styles.bannerSuccess} visible={success}>
        Успешно добавлено
      </Banner>
      <ScrollView contentContainerStyle={{width: screenWidth/1.15, flexGrow: 1}}>
      <Text style={styles.bigLabel}>Добавить</Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        style={
          {fontSize: 14}}
        buttons={[
          {
            value: 'folder',
            label: 'Папку',
          },
          {
            value: 'collection',
            label: 'Коллекцию',
          },
          {
            value: 'card',
            label: 'Карточку',
          },
        ]}
      />
      {value == 'folder' && <AddEditFolderForm setSuccess={setSuccess} />}
      {value == 'collection' && (
        <AddEditCollectionForm
          setSuccess={setSuccess}
          refresh={refreshCollection}
          setRefresh={setRefreshCollection}
          folderId={route.params ? route.params.folderId : null}
        />
      )}
      {value == 'card' && (
        <AddEditCardForm
          setSuccess={setSuccess}
          refresh={refreshCard}
          setRefresh={setRefreshCard}
          collectionId={route.params ? route.params.collectionId : null}
        />
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddPage;
