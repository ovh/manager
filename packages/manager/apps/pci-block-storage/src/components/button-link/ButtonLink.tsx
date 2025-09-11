import {
  ComponentProps,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { ButtonColor, ButtonVariant, ButtonSize } from '@ovhcloud/ods-react';
import './style.scss';
import clsx from 'clsx';
import { TrackActionParams, useTrackAction } from '@/hooks/useTrackAction';
import { Icon } from '../icon/Icon';

type ButtonLinkProps = {
  to: string;
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
      to,
      variant = 'default',
      color = 'primary',
      size = 'md',
      icon,
      className,
      children,
      actionName,
      actionValues,
      ...htmlProps
    },
    ref,
  ) => {
    const trackingParams = useMemo<TrackActionParams>(
      () => ({
        actionName,
        actionValues,
        buttonType: 'button',
      }),
      [actionName, actionValues],
    );

    const onTrackingClick = useTrackAction(trackingParams);

    return (
      <Link
        className={clsx([
          'button-link',
          `button-link--${color}`,
          `button-link--${size}`,
          `button-link--${variant}`,
          'box-border',
          'no-underline',
          className,
        ])}
        to={to}
        onClick={onTrackingClick}
        ref={ref}
        {...htmlProps}
      >
        {!!icon && <Icon name={icon} />}

        {children}
      </Link>
    );
  },
);
