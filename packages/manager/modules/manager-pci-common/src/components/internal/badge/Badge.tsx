import { ComponentProps } from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import './style.scss';

type CommonProps = {
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

export type BadgeProps = CommonProps & BadgeColor;

export const Badge = ({
  icon,
  label,
  size = 'md',
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

  let iconStyle: ComponentProps<typeof OsdsIcon>['style'] = {};

  if ('textColor' in restProps) {
    iconStyle = { backgroundColor: restProps.textColor };
  }

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
