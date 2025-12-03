import { ComponentProps, HTMLAttributes, PropsWithChildren, forwardRef } from 'react';

import { Link } from 'react-router-dom';

import clsx from 'clsx';

import { Icon } from '@ovhcloud/ods-react';
import type { ButtonColor, ButtonSize, ButtonVariant } from '@ovhcloud/ods-react';

import './style.scss';

type ButtonLinkProps = {
  to: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: ComponentProps<typeof Icon>['name'];
} & Omit<HTMLAttributes<HTMLElement>, 'onClick'>;

/**
 * Link with button style
 */
// eslint-disable-next-line react/display-name
export const ButtonLink = forwardRef<HTMLAnchorElement, PropsWithChildren<ButtonLinkProps>>(
  (
    {
      to,
      variant = 'default',
      color = 'primary',
      size = 'md',
      icon,
      className,
      children,
      ...htmlProps
    },
    ref,
  ) => {
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
        ref={ref}
        {...htmlProps}
      >
        {!!icon && <Icon name={icon} />}

        {children}
      </Link>
    );
  },
);
