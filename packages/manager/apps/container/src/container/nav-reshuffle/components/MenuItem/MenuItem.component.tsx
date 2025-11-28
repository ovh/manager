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

  const content = (
    <>
      <Icon
        name={node.icon}
        className="shrink-0 p-1 mr-1 fill-[var(--ods-color-primary-800)]"
      />
      {t(node.translation)}
    </>
  );

  return url ? (
    <Link
      href={url}
      onClick={onClick}
      onKeyUp={onKeyUp}
      aria-label={t('sidebar_dashboard')}
      className="w-full gap-0 p-2 text-[var(--ods-color-primary-800)] hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none"
    >
      {content}
    </Link>
  ) : (
    <div
      className="w-full p-2 font-semibold cursor-pointer text-[var(--ods-color-primary-800)] hover:text-[var(--ods-color-primary-700)]"
      tabIndex={0}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {content}
    </div>
  );
};
