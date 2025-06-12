import { ComponentProps } from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import './style.scss';

type BadgeBaseProps = {
  className?: string;
  label?: string;
  // Little trick to have name directly instead of enum
  icon?: Lowercase<ODS_ICON_NAME>;
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

export const Badge = ({
  icon,
  label,
  size = 'sm',
  className,
  ...restProps
}: BadgeProps) => {
  const hostColorProps: Partial<ComponentProps<'div'>> = {};

  if ('backgroundColor' in restProps || 'textColor' in restProps) {
    hostColorProps.style = {
      ...hostColorProps.style,
      backgroundColor: restProps.backgroundColor,
      color: restProps.textColor,
    };
  } else if ('color' in restProps) {
    hostColorProps.className = clsx(
      hostColorProps.className,
      `pci-badge--color-${restProps.color}`,
    );
  }

  const iconStyle: ComponentProps<typeof OsdsIcon>['style'] =
    'textColor' in restProps ? { backgroundColor: restProps.textColor } : {};

  return (
    <div
      {...hostColorProps}
      className={clsx(
        className,
        hostColorProps.className,
        `pci-badge pci-badge--size-${size}`,
      )}
    >
      {!!icon && (
        <OsdsIcon
          name={icon as ODS_ICON_NAME}
          className="badge__icon"
          style={iconStyle}
        />
      )}{' '}
      <span style={{ fontFamily: 'var(--ods-font-family)' }}>{label}</span>
    </div>
  );
};
