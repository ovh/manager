import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ovh-ux/muk';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';
import { Node } from '../../sidebar/navigation-tree/node';
import { useSidebarUrl } from '../../hooks/useSidebarUrl';

interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  node: Node;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ node, onClick }) => {
  const { t } = useTranslation('sidebar');
  const url = useSidebarUrl(node.routing);

  return (
    <>
      {url ? (
        <Link
          href={url}
          onClick={onClick}
          aria-label={t('sidebar_dashboard')}
          className="p-2 gap-0 text-[var(--ods-color-primary-800)] w-full hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none"
        >
          <>
            <SvgIconWrapper
              name={node.svgIcon}
              height={24}
              width={24}
              className={`p-1 mr-1 fill-[var(--ods-color-primary-800)] shrink-0`}
            />
            {t(node.translation)}
          </>
        </Link>
      ) : (
        <div
          className="w-full p-2 font-semibold text-[var(--ods-color-primary-800)] cursor-pointer hover:text-[var(--ods-color-primary-700)]"
          tabIndex={0}
          onClick={onClick}
        >
          <SvgIconWrapper
            name={node.svgIcon}
            height={24}
            width={24}
            className={`p-1 mr-1 fill-[var(--ods-color-primary-800)] shrink-0`}
          />
          {t(node.translation)}
        </div>
      )}
    </>
  );
};
