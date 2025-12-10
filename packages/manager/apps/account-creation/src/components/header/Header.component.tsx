import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { saveUserLocale } from '@ovh-ux/manager-config';
import { LanguageMenu } from '@ovh-ux/manager-gcj-module';
import {
  ButtonType,
  PageLocation,
  usePageTracking,
} from '@ovh-ux/manager-react-shell-client';

import ovhCloudLogo from '@/assets/logo-ovhcloud.png';
import { useTrackingContext } from '@/context/tracking/useTracking';

export default function HeaderComponent() {
  const { i18n } = useTranslation();
  const pageTracking = usePageTracking();
  const { trackClick } = useTrackingContext();

  const onLocalUpdate = useCallback(
    (newLocale: string) => {
      if (pageTracking) {
        trackClick(pageTracking, {
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actions: [
            'change_language_interface',
            `${i18n.language}_to_${newLocale}`,
          ],
        });
      }
      i18n.changeLanguage(newLocale);
      saveUserLocale(newLocale);
    },
    [i18n, pageTracking],
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
