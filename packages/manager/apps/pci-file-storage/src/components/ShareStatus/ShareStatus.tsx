import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

const color: Record<string, ODS_THEME_COLOR_INTENT> = {
  available: ODS_THEME_COLOR_INTENT.success,
};

const ShareStatus = ({ status }: { status: string }) => {
  const { t } = useTranslation('pci-file-storage/share_status');
  return (
    <OsdsChip color={color[status]} inline>
      {t(status)}
    </OsdsChip>
  );
};

export default ShareStatus;
