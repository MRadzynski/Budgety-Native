import * as Localization from 'expo-localization';
import { useAppSelector } from './redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useUserLocalization = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { i18n } = useTranslation();

  useEffect(() => {
    if (currentUser && 'language' in currentUser) {
      i18n.changeLanguage(currentUser.language.toLowerCase());
    } else {
      const locale = Localization.locale;
      const userLanguage = locale.slice(0, 2);

      i18n.changeLanguage(userLanguage);
    }
  }, [currentUser]);
};
