import { ComponentProps } from 'react';
import clsx from 'clsx';
import { OdsBadge } from '@ovhcloud/ods-components/react';

type BadgeBaseProps = {
  className?: string;
  label?: string;
  // Little trick to have name directly instead of enum
  icon?: ComponentProps<typeof OdsBadge>['icon'];
  size?: 'sm' | 'md' | 'lg';
};

type BadgeMainColorProps = {
  color?:
    | 'alpha'
    | 'beta'
    | 'critical'
    | 'information'
    | 'neutral'
    | 'new'
    | 'promotion'
    | 'success'
    | 'warning';
};

type BadgeCustomColorProps = {
  backgroundColor?: string;
  textColor?: string;
};

export type BadgeColor = BadgeMainColorProps | BadgeCustomColorProps;

export type BadgeProps = BadgeBaseProps & BadgeColor;

export const Badge = ({ size = 'sm', className, ...restProps }: BadgeProps) => {
  const classNames = [className];

  if ('backgroundColor' in restProps)
    classNames.push(`[&::part(badge)]:bg-[${restProps.backgroundColor}]`);
  if ('textColor' in restProps)
    classNames.push(`[&::part(badge)]:text-[${restProps.textColor}]`);

  return <OdsBadge {...restProps} className={clsx(classNames)} size={size} />;
};
