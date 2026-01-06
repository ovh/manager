import { useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

const McaStep2 = ({
  microsoftUrl,
  onClick,
  isLoading,
}: {
  microsoftUrl: string;
  onClick: () => void;
  isLoading: boolean;
}) => {
  const { t } = useTranslation('dashboard/microsoft-customer-agreement');

  return (
    <div className="flex flex-col place-items-center gap-y-5">
      <Text preset={TEXT_PRESET.paragraph}>{t('signatory_step2_description')}</Text>
      <Link href={microsoftUrl} target="_blank">
        {t('signatory_step2_link')}
        <Icon name={ICON_NAME.externalLink} />
      </Link>
      <Button onClick={onClick} loading={isLoading}>
        {t('signatory_step2_button')}
      </Button>
    </div>
  );
};

export default McaStep2;
