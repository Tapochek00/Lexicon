import {useNavigation} from '@react-navigation/native';
import {useState, useEffect} from 'react';

export const useFocus = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [focusCount, setFocusCount] = useState(0);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setIsFocused(true);
      setFocusCount(focusCount + 1);
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsFocused(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  });

  return {isFocused, focusCount};
};