import React, { useMemo } from 'react';
import { Link, Icon, ICON_NAME } from '@ovh-ux/muk';

interface SidebarMenuItemProps {
  icon?: ICON_NAME;
  label: string;
  href?: string;
  onClick?: () => void;
  onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
  variant?: 'light' | 'dark';
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  icon,
  label,
  href,
  onClick,
  onKeyUp,
  variant = 'light',
}) => {
  const classNames = useMemo(() => {
    const isLight = variant === 'light';
    const textColor = isLight
      ? 'text-[var(--ods-color-primary-800)]'
      : 'text-[var(--ods-color-primary-100)]';

    const iconColor = isLight
      ? 'fill-[var(--ods-color-primary-800)]'
      : 'fill-[var(--ods-color-primary-100)]';

    const hoverText = isLight
      ? 'hover:text-[var(--ods-color-primary-700)]'
      : 'hover:text-gray-200';

    const base = `w-full p-2 ${textColor} ${hoverText}`;
    return {
      icon: `shrink-0 p-1 mr-1 ${iconColor}`,
      link: `${base} gap-0 font-semibold hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none`,
      div: `${base} font-semibold cursor-pointer flex items-center`,
    };
  }, [variant]);

  const content = (
    <>
      {icon && <Icon name={icon} className={classNames.icon} />}
      {label}
    </>
  );

  return href ? (
    <Link
      href={href}
      onClick={onClick}
      onKeyUp={onKeyUp}
      className={classNames.link}
    >
      {content}
    </Link>
  ) : (
    <div
      className={classNames.div}
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {content}
    </div>
  );
};
