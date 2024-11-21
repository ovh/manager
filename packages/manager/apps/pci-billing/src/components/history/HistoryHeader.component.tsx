import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isSameDay, startOfMonth } from 'date-fns';
import { useComputeDate } from './useComputeDate.hook';

export default function HistoryHeader() {
  const { t } = useTranslation('history');

  const {
    billingDate,
    prevMonthDate,
    nextMonthDate,
    translationValues,
  } = useComputeDate();

  const isLimitReached = isSameDay(billingDate, startOfMonth(new Date()));

  const navigate = useNavigate();
  const navigateToMonth = (date: Date) => {
    navigate(`../history/${date.getFullYear()}/${date.getMonth() + 1}`);
  };

  return (
    <div className="mb-5 flex justify-between items-center">
      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => navigateToMonth(prevMonthDate)}
        className="flex"
      >
        <OsdsIcon
          name={ODS_ICON_NAME.CHEVRON_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="mr-4"
        />
        {t('cpbh_previous_month')}
      </OsdsButton>

      <OsdsText
        size={ODS_TEXT_SIZE._500}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
        slot="summary"
      >
        {t('cpbh_current_month', { ...translationValues })}
      </OsdsText>

      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => navigateToMonth(nextMonthDate)}
        disabled={isLimitReached || undefined}
        className="flex"
      >
        {t('cpbh_next_month')}
        <OsdsIcon
          name={ODS_ICON_NAME.CHEVRON_RIGHT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="ml-4"
        />
      </OsdsButton>
    </div>
  );
}
