import React, { useEffect, useRef, useState } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

import { LANGUAGES } from '@ovh-ux/manager-config';
import { emit } from '@ovh-ux/ufrontend/communication';
import { MESSAGES } from './constants';

import { useEnvironment } from './environment';

import LanguageButton from './language/button.jsx';
import LanguageList from './language/list.jsx';

function LanguageMenu() {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const handleRootClose = () => setShow(false);

  useClickAway(ref, handleRootClose);

  const userLocale = useEnvironment().getUserLocale();
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  useEffect(() => {
    setCurrentLanguage(
      LANGUAGES.available.find(({ key }) => key === userLocale),
    );

    setAvailableLanguages(
      LANGUAGES.available.filter(({ key }) => key !== userLocale),
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
        onSelect={(locale) =>
          emit({
            id: MESSAGES.localeChange,
            locale,
          })
        }
      ></LanguageList>
    </div>
  );
}

export default LanguageMenu;
