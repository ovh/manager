import { ComponentProps, PropsWithChildren, forwardRef, useMemo } from 'react';
import clsx from 'clsx';
import { OdsButtonColor, OdsButtonSize, OdsButtonVariant } from 'ods-18';
import { TrackActionParams, useTrackAction } from '@/hooks/useTrackAction';
import { Icon } from '../icon/Icon';
import 'ods-18/dist/collection/components/button/src/components/ods-button/ods-button.css';

type ButtonProps = {
  // This trick allows us to use the string value instead of the enum, will be useful for migration
  variant?: OdsButtonVariant;
  color?: OdsButtonColor;
  size?: OdsButtonSize;
  icon?: ComponentProps<typeof Icon>['name'];
} & Pick<TrackActionParams, 'actionName' | 'actionValues' | 'location'> &
  ComponentProps<'button'>;

/**
 * Link with button style
 */
export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      variant = 'default',
      color = 'primary',
      size = 'md',
      icon,
      className,
      children,
      actionName,
      actionValues,
      onClick,
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

    const onTrackingClick = useTrackAction(trackingParams, onClick);

    return (
      <button
        className={clsx([
          'ods-button__button',
          `ods-button__button--${color}`,
          `ods-button__button--${size}`,
          `ods-button__button--${variant}`,
          className,
        ])}
        onClick={onTrackingClick}
        ref={ref}
        {...htmlProps}
      >
        {!!icon && <Icon name={icon} />}

        {children}
      </button>
    );
  },
);
