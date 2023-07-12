import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import useClickAway from 'react-use/lib/useClickAway';
import { LANGUAGES } from '@ovh-ux/manager-config';

import Context from '@/context';

import LanguageMenuButton from './LanguageMenuButton';
import LanguageMenuList from './LanguageMenuList';
import { SMALL_DEVICE_MAX_SIZE } from '@/constants';

const LanguageMenu = (): JSX.Element => {
  const { locale, setLocale } = useContext(Context);
  const { i18n } = useTranslation();
  const ref = useRef();
  const [show, setShow] = useState(false);
  const handleRootClose = () => setShow(false);
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });

  useClickAway(ref, handleRootClose);

  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const onLocaleChange = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
    setLocale(newLocale);
    setShow(false);
  };

  useEffect(() => {
    setCurrentLanguage(LANGUAGES.available.find(({ key }) => key === locale));
    setAvailableLanguages(
      LANGUAGES.available.filter(({ key }) => key !== locale),
    );
  }, [locale]);

  const getLanguageLabel = () => {
    if (currentLanguage) {
      return isSmallDevice
        ? currentLanguage.key.slice(-2)
        : currentLanguage.name;
    }
    return '';
  };

  return (
    <div className="oui-navbar-dropdown" ref={ref}>
      <LanguageMenuButton show={show} onClick={(nextShow) => setShow(nextShow)}>
        {getLanguageLabel()}
      </LanguageMenuButton>
      <LanguageMenuList
        languages={availableLanguages}
        onSelect={onLocaleChange}
      ></LanguageMenuList>
    </div>
  );
};

export default LanguageMenu;
