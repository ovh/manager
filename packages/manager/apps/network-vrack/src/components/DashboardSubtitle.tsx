import { useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Text } from '@ovhcloud/ods-react';

import { Vrack } from '@/data/api/get/vrack-details';
import { useWebPageLink } from '@/hooks/useWebPageLink';
import { useUpdateVrackDetails } from '@/hooks/vrack/useUpdateVrackDetails';

import { EditableText } from './editableText/EditableText';

interface DashboardHeaderTitleProps {
  vrack: Vrack;
}

export const DashboardSubtitle = (props: DashboardHeaderTitleProps) => {
  const { t } = useTranslation('dashboard');
  const webPageLink = useWebPageLink();
  const vrack = props.vrack;

  const { mutate: updateVrackDetails } = useUpdateVrackDetails(vrack.serviceName);

  const onDescriptionUpdate = (updatedDescription: string) => {
    updateVrackDetails({
      name: vrack.name,
      description: updatedDescription,
    });
  };

  const subTitleTextWithLink = webPageLink ? (
    <>
      {t('dashboard_subtitle_hints')}{' '}
      <a target="_blank" href={webPageLink} rel="noreferrer">
        {t('dashboard_subtitleLink')} <Icon name={ICON_NAME.externalLink} />
      </a>
    </>
  ) : (
    ''
  );
  return (
    <div>
      <p className="mb-4 flex flex-col gap-2">
        <span className="flex gap-4">
          <Text className="font-semibold" preset="span">
            {t('dashboard_serviceId')}:{' '}
          </Text>
          <Text preset="span">{vrack.serviceName}</Text>
        </span>
        <span className="flex gap-4">
          <Text className="font-semibold" preset="span">
            {t('dashboard_vrackDescription')}:{' '}
          </Text>
          <EditableText preset="span" value={vrack.description} onUpdate={onDescriptionUpdate} />
        </span>
      </p>
      <p className="flex flex-col gap-2">
        <Text preset="span">{t('dashboard_subtitle1')}</Text>
        <Text preset="span">
          {t('dashboard_subtitle2')} {subTitleTextWithLink}
        </Text>
      </p>
    </div>
  );
};
