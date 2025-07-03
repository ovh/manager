import React from 'react';
import {
  DashboardTile,
  DashboardTileBlockItem,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsClipboard } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Secret } from '@secret-manager/types/secret.type';
import { useFormatDate } from '@/common/hooks/useFormatDate';

type InformationTileProps = {
  secret: Secret;
};

export const InformationsTile = ({ secret }: InformationTileProps) => {
  const { t } = useTranslation([
    'secret-manager/common',
    'secret-manager/dashboard',
    NAMESPACES.DASHBOARD,
  ]);
  const { formatDate } = useFormatDate();

  const items: DashboardTileBlockItem[] = [
    {
      id: 'path',
      label: t('path'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{secret.path}</OdsText>
      ),
    },
    {
      id: 'urn',
      label: t('urn'),
      value: <OdsClipboard className="w-full" value={secret.iam.urn} />,
    },
    {
      id: 'created_at',
      label: t('creation_date', { ns: NAMESPACES.DASHBOARD }),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {formatDate(secret.metadata.createdAt)}
        </OdsText>
      ),
    },
    {
      id: 'updated_at',
      label: t('secret-manager/dashboard:last_update'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {formatDate(secret.metadata.updatedAt)}
        </OdsText>
      ),
    },
  ];

  return (
    <DashboardTile
      title={t('secret-manager/dashboard:general_information')}
      items={items}
    />
  );
};
