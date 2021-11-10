import React, { useEffect, useRef, useState } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

import { useShell } from '@/context';

import LanguageButton from './language/button.jsx';
import LanguageList from './language/list.jsx';

function LanguageMenu({ userLocale, setUserLocale }) {
  const ref = useRef();
  const shell = useShell();
  const [show, setShow] = useState(false);
  const handleRootClose = () => setShow(false);

  useClickAway(ref, handleRootClose);

  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const onLocaleChange = (locale) => {
    shell.i18n().setLocale(locale);
    setShow(false);
    setUserLocale(locale);
  };

  useEffect(() => {
    setCurrentLanguage(
      shell
        .i18n()
        .getAvailableLocales()
        .find(({ key }) => key === userLocale),
    );

    setAvailableLanguages(
      shell
        .i18n()
        .getAvailableLocales()
        .filter(({ key }) => key !== userLocale),
    );
  }, [userLocale]);

  if (!currentLanguage && availableLanguages.length === 0) {
    return <div></div>;
  }

  return (
    <div className="oui-navbar-dropdown" ref={ref}>
      <LanguageButton show={show} onClick={(nextShow) => setShow(nextShow)}>
        {currentLanguage.name}
      </LanguageButton>
      <LanguageList
        languages={availableLanguages}
        onSelect={onLocaleChange}
      ></LanguageList>
    </div>
  );
}

export default LanguageMenu;
