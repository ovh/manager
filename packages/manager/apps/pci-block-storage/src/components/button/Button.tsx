import { ComponentProps, PropsWithChildren, forwardRef, useMemo } from 'react';
import {
  Button as OdsButton,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '@ovhcloud/ods-react';
import { TrackActionParams, useTrackAction } from '@/hooks/useTrackAction';
import { Icon } from '../icon/Icon';

type ButtonProps = {
  // This trick allows us to use the string value instead of the enum, will be useful for migration
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
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
      <OdsButton
        variant={variant}
        color={color}
        size={size}
        onClick={onTrackingClick}
        ref={ref}
        {...htmlProps}
      >
        {!!icon && <Icon name={icon} />}

        {children}
      </OdsButton>
    );
  },
);
