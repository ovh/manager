import { useTranslation } from 'react-i18next';
import { OdsDivider } from '@ovhcloud/ods-components/react';
import { Subtitle } from '@ovh-ux/manager-react-components';

export default function Home() {
  const { t } = useTranslation(['home']);

  return (
    <>
      <Subtitle>{t('quick_access')}</Subtitle>

      <OdsDivider />
    </>
  );
}
