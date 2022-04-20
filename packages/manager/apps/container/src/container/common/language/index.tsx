import React, { useEffect, useRef, useState } from 'react';

import useClickAway from 'react-use/lib/useClickAway';

import LanguageButton from './Button';
import LanguageList from './List';

import { useShell } from '@/context';

type Props = {
  onChange(show: boolean): void;
  setUserLocale(locale: string): void;
  userLocale?: string;
};

function LanguageMenu({
  onChange,
  setUserLocale,
  userLocale = '',
}: Props): JSX.Element {
  const ref = useRef();
  const shell = useShell();
  const [show, setShow] = useState(false);
  const handleRootClose = () => setShow(false);

  useEffect(() => {
    onChange(show);
  }, [show]);

  useClickAway(ref, handleRootClose);

  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const onLocaleChange = (locale) => {
    shell.getPlugin('tracking').trackClick({
      name: `navbar::action::lang::change-lange`,
      type: 'action',
    });
    shell.getPlugin('i18n').setLocale(locale);
    setShow(false);
    setUserLocale(locale);
  };

  useEffect(() => {
    setCurrentLanguage(
      shell
        .getPlugin('i18n')
        .getAvailableLocales()
        .find(({ key }) => key === userLocale),
    );

    setAvailableLanguages(
      shell
        .getPlugin('i18n')
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
