import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import useClickAway from 'react-use/lib/useClickAway';

import LanguageButton from './Button';
import LanguageList from './List';

import { useShell } from '@/context';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';

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
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });

  useEffect(() => {
    onChange(show);
  }, [show]);

  useClickAway(ref, handleRootClose);

  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const onLocaleChange = (locale: string) => {
    shell.getPlugin('i18n').setLocale(locale);
    setShow(false);
    setUserLocale(locale);
  };

  useEffect(() => {
    setCurrentLanguage(
      shell
        .getPlugin('i18n')
        .getAvailableLocales()
        .find(({ key }: { key: string }) => key === userLocale),
    );

    setAvailableLanguages(
      shell
        .getPlugin('i18n')
        .getAvailableLocales()
        .filter(({ key }: { key: string }) => key !== userLocale),
    );
  }, [userLocale]);

  if (!currentLanguage && availableLanguages.length === 0) {
    return <div></div>;
  }

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
      <LanguageButton show={show} onClick={(nextShow) => setShow(nextShow)}>
        {getLanguageLabel()}
      </LanguageButton>
      <LanguageList
        languages={availableLanguages}
        onSelect={onLocaleChange}
      ></LanguageList>
    </div>
  );
}

export default LanguageMenu;
