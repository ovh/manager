import { FC } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

type BackButtonProps = {
  onClick?: () => void;
};

const BackButton: FC<BackButtonProps> = ({ onClick }) => {
  const { t } = useTranslation('common');
  const backHref = useHref('..');

  return (
    <OsdsLink
      data-testid="back-btn"
      color={ODS_THEME_COLOR_INTENT.primary}
      className="mt-10"
      href={backHref}
      onClick={onClick}
    >
      <OsdsIcon
        slot="start"
        name={ODS_ICON_NAME.ARROW_LEFT}
        size={ODS_ICON_SIZE.xs}
        color={ODS_THEME_COLOR_INTENT.primary}
      />
      <span className="ml-4">
        {t('common_back_button_back_to_previous_page')}
      </span>
    </OsdsLink>
  );
};

export default BackButton;
