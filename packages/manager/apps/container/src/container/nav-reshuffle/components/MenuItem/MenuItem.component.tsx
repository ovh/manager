import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Icon, ICON_NAME } from '@ovh-ux/muk';
import { Node } from '../../data/config/navigation/types/node';
import { useNodeUrl } from '../../hooks/useNodeUrl';

interface MenuItemProps {
  node: Node;
  onClick: () => void;
  onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  node,
  onClick,
  onKeyUp,
}) => {
  const { t } = useTranslation('sidebar');
  const url = useNodeUrl()(node.routing);

  return url ? (
    <Link
      href={url}
      onClick={onClick}
      onKeyUp={onKeyUp}
      aria-label={t('sidebar_dashboard')}
      className="p-2 gap-0 text-[var(--ods-color-primary-800)] w-full hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none"
    >
      <>
        <Icon
          name={node.svgIcon as ICON_NAME}
          className="p-1 mr-1 fill-[var(--ods-color-primary-800)] shrink-0"
        />
        {t(node.translation)}
      </>
    </Link>
  ) : (
    <div
      className="w-full p-2 font-semibold text-[var(--ods-color-primary-800)] cursor-pointer hover:text-[var(--ods-color-primary-700)]"
      tabIndex={0}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      <Icon
        name={node.svgIcon as ICON_NAME}
        className="p-1 mr-1 fill-[var(--ods-color-primary-800)] shrink-0"
      />
      {t(node.translation)}
    </div>
  );
};
