import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ovh-ux/muk';
import { Node, NodeTag } from '../../data/config/navigation/types/node';
import { useNodeUrl } from '../../hooks/useNodeUrl';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

interface SubmenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  node: Node;
}

const TAG_CLASSES: Record<NodeTag, string> = {
  [NodeTag.NEW]: 'bg-cyan-400',
  [NodeTag.BETA]: 'bg-green-400',
  [NodeTag.ALPHA]: 'bg-yellow-400',
};

export const SubmenuItem: React.FC<SubmenuItemProps> = ({ node }) => {
  const { t } = useTranslation('sidebar');
  const getNodeUrl = useNodeUrl();
  const { currentNavigationNode, selectedPciProjectId } = useProductNavReshuffle();

  const url = useMemo(() => {
    if (!node.routing) return null;

    if (selectedPciProjectId && node.routing.hash?.includes('{projectId}')) {
      const hash = node.routing.hash.replace('{projectId}', selectedPciProjectId);
      return getNodeUrl({ ...node.routing, hash });
    }

    return getNodeUrl(node.routing);
  }, [selectedPciProjectId]);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    setIsHighlighted(currentNavigationNode?.id === node.id);
  }, [currentNavigationNode]);

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <Link
        href={url}
        aria-label={t('sidebar_dashboard')}
        className={`p-2 gap-0 text-[var(--ods-color-primary-800)] font-normal rounded-md flex-1 ${
          isHighlighted ? 'bg-cyan-100' : ''
        } hover:bg-cyan-100 hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none`}
      >
        <>
          {t(node.translation)}
          {node.tag && (
            <span
              className={`px-2 py-0.5 rounded-lg ml-2 text-xs font-semibold text-white ${
                TAG_CLASSES[node.tag]
              }`}
            >
              {t(`sidebar_tag_${node.tag}`)}
            </span>
          )}
        </>
      </Link>
    </div>
  );
};
