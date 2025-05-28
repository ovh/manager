import {
  HTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
} from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { useHref, useNavigate } from 'react-router-dom';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

type ButtonLinkProps = {
  to: string;
  // This trick allows us to use the string value instead of the enum, will be useful for migration
  variant?: keyof typeof ODS_BUTTON_VARIANT;
  color?: keyof typeof ODS_THEME_COLOR_INTENT;
  size?: keyof typeof ODS_BUTTON_SIZE;
  className?: string;

  trackingName?: string;
  trackingParams?: string[];
} & HTMLAttributes<HTMLElement>;

export const ButtonLink = ({
  to,
  variant,
  color,
  size,
  className,
  trackingName,
  trackingParams,
  children,
  rel,
  ...htmlProps
}: PropsWithChildren<ButtonLinkProps>) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const href = useHref(to);

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (trackingName || trackingParams) {
        const trackingActions = [];
        if (trackingName) trackingActions.push(trackingName);
        if (trackingParams) trackingActions.push(trackingParams.join('_'));

        trackClick({
          buttonType: ButtonType.button,
          actions: trackingActions,
        });
      }

      navigate(to);
    },
    [navigate, to, trackingName, trackingParams],
  );

  return (
    <OsdsButton
      size={size as ODS_BUTTON_SIZE}
      variant={variant as ODS_BUTTON_VARIANT}
      color={color as ODS_THEME_COLOR_INTENT}
      className={className}
      href={href}
      onClick={onClick}
      // ODS doesn't like HTML
      rel={rel as OdsHTMLAnchorElementRel}
      {...htmlProps}
    >
      {children}
    </OsdsButton>
  );
};
