import { ManagerButton } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

export type DatagridItemsCounterProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
};

export default function DatagridItemsCounter({
  currentPage,
  pageSize,
  totalItems,
}: DatagridItemsCounterProps) {
  const { t } = useTranslation('tag-manager');
  const numberOfDisplayedItems =
    currentPage * pageSize > totalItems ? totalItems : currentPage * pageSize;

  return (
    <OdsText className="w-full text-right">
      {t('itemsCounter', { numberOfDisplayedItems, totalItems })}
    </OdsText>
  );
}
