import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyPairName } from '@ovh-ux/manager-config';
import { useShell } from '@/context';
import { SubMenu } from '../../common/Submenu/Submenu.component';
import { SubmenuItem } from '../../common/SubmenuItem/SubmenuItem.component';

interface LanguageSubmenuProps {
  close: () => void;
}

export const LanguageSubmenu = ({ close }: LanguageSubmenuProps) => {
  const { t, i18n } = useTranslation('language');
  const shell = useShell();
  const [availableLanguages, setAvailableLanguages] = useState<KeyPairName[]>([]);

  useEffect(() => {
    const userLocale = shell.getPlugin('i18n').getLocale();
    const languages = shell
      .getPlugin('i18n')
      .getAvailableLocales()
      .filter(({ key }: { key: string }) => key !== userLocale);
    setAvailableLanguages(languages);
  }, [shell]);

  const onLocaleChange = (locale: string, name: string) => {
    shell.getPlugin('i18n').setLocale(locale);
    i18n.changeLanguage(locale);
    close();
  };

  const languageItems = useMemo(
    () =>
      availableLanguages.map(({ name, key }) => (
        <div key={key} onClick={() => onLocaleChange(key, name)}>
          <SubmenuItem
            href={null}
            label={name}
          />
        </div>
      )),
    [availableLanguages],
  );

  return (
    <SubMenu title={t('language_change')} close={close}>
      <div className="px-2">{languageItems}</div>
    </SubMenu>
  );
};
