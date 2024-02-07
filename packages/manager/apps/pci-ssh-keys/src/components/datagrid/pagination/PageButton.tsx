import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

type PageButtonProps = {
  children: React.ReactNode;
  isCurrent?: boolean;
  onClick: () => void;
};

export default function PageButton({
  children,
  isCurrent,
  onClick,
}: PageButtonProps) {
  return (
    <OsdsButton
      variant={isCurrent ? ODS_BUTTON_VARIANT.flat : ODS_BUTTON_VARIANT.ghost}
      inline
      color={ODS_THEME_COLOR_INTENT.primary}
      size={ODS_BUTTON_SIZE.sm}
      onClick={() => onClick()}
      data-testid="button"
    >
      {children}
    </OsdsButton>
  );
}
