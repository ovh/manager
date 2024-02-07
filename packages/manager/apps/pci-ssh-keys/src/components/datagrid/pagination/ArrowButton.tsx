import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type ArrowButtonProps = {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
};

export default function ArrowButton({
  direction,
  onClick,
  disabled,
}: ArrowButtonProps) {
  const { t } = useTranslation('common');
  const icon =
    direction === 'left'
      ? ODS_ICON_NAME.CHEVRON_LEFT
      : ODS_ICON_NAME.CHEVRON_RIGHT;

  const tooltipLabel = t(
    `common_pagination_${direction === 'left' ? 'previous' : 'next'}_page`,
  );

  return (
    <OsdsTooltip>
      <OsdsTooltipContent slot="tooltip-content">
        {tooltipLabel}
      </OsdsTooltipContent>

      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        inline
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        onClick={() => (!disabled ? onClick() : null)}
        {...(disabled ? { disabled: true } : {})}
        data-testid="button"
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          name={icon}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="icon"
        ></OsdsIcon>
      </OsdsButton>
    </OsdsTooltip>
  );
}
