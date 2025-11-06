import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { LANGUAGES } from '@ovh-ux/manager-config';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { SMALL_DEVICE_MAX_SIZE } from '../../constants/constants';

interface KeyPairName {
  name: string;
  key: string;
}

export type Props = {
  onLocalUpdate(locale: string): void;
  initialLocal?: string;
};

export const LanguageMenu = ({ onLocalUpdate, initialLocal = '' }: Props) => {
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });

  const [currentLocale, setCurrentLocale] = useState<string>(initialLocal);
  const [availableLanguages, setAvailableLanguages] = useState<KeyPairName[]>(
    [],
  );

  useEffect(() => {
    setAvailableLanguages(
      LANGUAGES.available.filter(({ key }) => key !== currentLocale),
    );
  }, [currentLocale]);

  const onLocaleChange = useCallback(
    (newLocale: string) => {
      onLocalUpdate(newLocale);
      setCurrentLocale(newLocale);
    },
    [onLocalUpdate],
  );

  const currentLanguageLabel = () => {
    if (!currentLocale) return '';
    const availableLanguage = LANGUAGES.available.find(
      (language) => language.key === currentLocale,
    );
    if (!availableLanguage?.key) return '';
    return isSmallDevice
      ? availableLanguage.key.slice(-2)
      : availableLanguage.name;
  };

  const items = useMemo(
    () =>
      availableLanguages.map((language, index) => ({
        label: language.name,
        onClick: () => onLocaleChange(language.key),
        id: index,
      })),
    [availableLanguages],
  );

  return (
    <ActionMenu
      id="language-menu"
      items={items}
      label={currentLanguageLabel()}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};
