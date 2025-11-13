import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ovh-ux/muk';
import { Node } from '../../sidebar/navigation-tree/node';
import { useNodeUrl } from '../../hooks/useNodeUrl';

interface SubmenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  node: Node;
  onClick: () => void;
}

export const SubmenuItem: React.FC<SubmenuItemProps> = ({ node, onClick }) => {
  const { t } = useTranslation('sidebar');
  const url = useNodeUrl()(node.routing);

  return (
    <Link
      href={url}
      onClick={onClick}
      aria-label={t('sidebar_dashboard')}
      className="p-2 gap-0 text-[var(--ods-color-primary-800)] font-normal rounded-md w-full hover:bg-cyan-100 hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none"
    >
      {t(node.translation)}
    </Link>
  );
};
