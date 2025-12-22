import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

import useClickAway from 'react-use/lib/useClickAway';

import LanguageButton from './Button';
import LanguageList from './List';

import { useShell } from '@/context';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

export type Props = {
  onChange(show: boolean): void;
};

function LanguageMenu({
  onChange,
}: Props): JSX.Element {
  const { i18n } = useTranslation('language');
  const ref = useRef();
  const shell = useShell();
  const [show, setShow] = useState(false);
  const handleRootClose = () => setShow(false);
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });
  const [userLocale, setUserLocale] = useState<string>(shell.getPlugin('i18n').getLocale());

  useEffect(() => {
    onChange(show);
  }, [show]);

  useClickAway(ref, handleRootClose);

  const currentLanguage = useMemo(() => shell
    .getPlugin('i18n')
    .getAvailableLocales()
    .find(({ key }: { key: string }) => key === userLocale),
  [shell.getPlugin('i18n'), userLocale]);

  const onLocaleChange = (locale: string) => {
    shell.getPlugin('i18n').setLocale(locale);
    setShow(false);
    setUserLocale(locale);
    i18n.changeLanguage(locale);
  };

  const getLanguageLabel = () => {
    if (currentLanguage) {
      return isSmallDevice
        ? currentLanguage.key.slice(-2)
        : currentLanguage.name;
    }
    return '';
  };

  return (
    <div className="oui-navbar-dropdown" ref={ref} data-testid="languageMenu">
      <LanguageButton show={show} onClick={(nextShow) => setShow(nextShow)}>
        {currentLanguage ? getLanguageLabel() : <OsdsSkeleton />}
      </LanguageButton>
      {show && (
        <LanguageList
          userLocale={userLocale}
          onSelect={onLocaleChange}
        ></LanguageList>
      )}
    </div>
  );
}

export default LanguageMenu;
