import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export const GoBack: FC = () => {
  const { t } = useTranslation('common');
  const backHref = useHref('..');
  return (
    <OsdsLink
      className="mt-12 mb-3"
      color={ODS_THEME_COLOR_INTENT.primary}
      href={backHref}
    >
      <OsdsIcon
        className="mr-2"
        name={ODS_ICON_NAME.ARROW_LEFT}
        size={ODS_ICON_SIZE.xs}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot="start"
      />
      {t('pci_instances_common_go_back')}
    </OsdsLink>
  );
};
