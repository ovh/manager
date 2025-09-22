import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { saveUserLocale } from '@ovh-ux/manager-config';
import { LanguageMenu } from '@ovh-ux/manager-gcj-module';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';

export default function HeaderComponent() {
  const { i18n } = useTranslation();

  const onLocalUpdate = useCallback(
    (newLocale: string) => {
      i18n.changeLanguage(newLocale);
      saveUserLocale(newLocale);
    },
    [i18n],
  );

  return (
    <div
      className="p-4 flex flex-row items-center justify-between gap-4"
      data-testid="header"
    >
      <img src={ovhCloudLogo} alt="ovh-cloud-logo" className="app-logo ml-3" />
      <LanguageMenu
        onLocalUpdate={onLocalUpdate}
        initialLocal={i18n.language || 'en_GB'}
      />
    </div>
  );
}
