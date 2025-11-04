import {
  ComponentProps,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { ButtonColor, ButtonSize, ButtonVariant } from '@ovhcloud/ods-react';
import './style.scss';
import clsx from 'clsx';
import { TrackActionParams, useTrackAction } from '@/hooks/useTrackAction';
import { Icon } from '../icon/Icon';

type InternalButtonProps = {
  isExternal?: false;
  to: string;
  href?: undefined;
};

type ExternalButtonProps = {
  isExternal: true;
  href: string;
  to?: undefined;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonLinkProps = (InternalButtonProps | ExternalButtonProps) & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: ComponentProps<typeof Icon>['name'];
} & Pick<TrackActionParams, 'actionName' | 'actionValues' | 'location'> &
  Omit<HTMLAttributes<HTMLElement>, 'onClick'>;

/**
 * Link with button style
 */
export const ButtonLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<ButtonLinkProps>
>(
  (
    {
      isExternal,
      to,
      href,
      variant = 'default',
      color = 'primary',
      size = 'md',
      icon,
      className,
      children,
      actionName,
      actionValues,
      location,
      ...htmlProps
    },
    ref,
  ) => {
    const trackingParams = useMemo<TrackActionParams>(
      () => ({
        actionName,
        actionValues,
        location,
        buttonType: 'button',
      }),
      [actionName, actionValues],
    );

    const handleTrackingClick = useTrackAction(trackingParams);

    const classNames = clsx([
      'button-link',
      `button-link--${color}`,
      `button-link--${size}`,
      `button-link--${variant}`,
      'box-border',
      'no-underline',
      className,
    ]);

    return isExternal ? (
      <a
        className={classNames}
        href={href}
        onClick={handleTrackingClick}
        ref={ref}
        {...htmlProps}
      >
        {!!icon && <Icon name={icon} />}

        {children}
      </a>
    ) : (
      <Link
        className={classNames}
        to={to}
        onClick={handleTrackingClick}
        ref={ref}
        {...htmlProps}
      >
        {!!icon && <Icon name={icon} />}

        {children}
      </Link>
    );
  },
);
