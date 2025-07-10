import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { IamTagListItem } from '@/data/api/get-iam-tags';

export default function TagTypeCell(item: IamTagListItem) {
  const { t } = useTranslation('tag-manager');

  return (
    <>
      <DataGridTextCell>{t(`tagType_${item.type}`)}</DataGridTextCell>
      <OdsIcon
        className="ml-4"
        name={ODS_ICON_NAME.circleInfo}
        id={`tag-type-tooltip-${item.name}`}
      ></OdsIcon>
      <OdsTooltip triggerId={`tag-type-tooltip-${item.name}`} position="bottom">
        {t(`tagType_${item.type}_tooltip`)}
      </OdsTooltip>
    </>
  );
}
