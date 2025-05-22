import {
  ComponentProps,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OdsButtonColor, OdsButtonSize, OdsButtonVariant } from 'ods-18';
import { TrackActionParams, useTrackAction } from '@/hooks/useTrackAction';
import { Icon } from '../icon/Icon';
import 'ods-18/dist/collection/components/button/src/components/ods-button/ods-button.css';

type ButtonLinkProps = {
  to: string;
  variant?: OdsButtonVariant;
  color?: OdsButtonColor;
  size?: OdsButtonSize;
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
          'ods-button__button',
          `ods-button__button--${color}`,
          `ods-button__button--${size}`,
          `ods-button__button--${variant}`,
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
