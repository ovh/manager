import { useEffect, useState } from 'react';
import { KeyPairName } from '@ovh-ux/manager-config';
import { useShell } from '@/context';
import { SidebarMenuItem } from '../../common/SidebarMenuItem/SidebarMenuItem.component';

interface LanguageSelectorProps {
  onClick: () => void;
}

export const LanguageSelector = ({ onClick }: LanguageSelectorProps) => {
  const shell = useShell();
  const [currentLanguage, setCurrentLanguage] = useState<KeyPairName | null>(null);

  useEffect(() => {
    const userLocale = shell.getPlugin('i18n').getLocale();
    const current = shell
      .getPlugin('i18n')
      .getAvailableLocales()
      .find(({ key }: { key: string }) => key === userLocale);
    setCurrentLanguage(current);
  }, [shell]);

  if (!currentLanguage) {
    return null;
  }

  return (
    <SidebarMenuItem
      label={currentLanguage.name}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter') onClick();
      }}
      variant="dark"
    />
  );
};
