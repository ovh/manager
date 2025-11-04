import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, NodeTag } from '@/types/node';
import { SubmenuItem } from '../../common/SubmenuItem/SubmenuItem.component';
import { useNodeUrl } from '../../../hooks/useNodeUrl';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

interface NodeSubmenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  node: Node;
}

const TAG_CLASSES: Record<NodeTag, string> = {
  [NodeTag.NEW]: 'bg-cyan-400',
  [NodeTag.BETA]: 'bg-green-400',
  [NodeTag.ALPHA]: 'bg-yellow-400',
};

export const NodeSubmenuItem: React.FC<NodeSubmenuItemProps> = ({ node }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const { t } = useTranslation('sidebar');
  const getNodeUrl = useNodeUrl();
  const {
    currentNavigationNode,
    selectedPciProjectId,
  } = useProductNavReshuffle();

  const url = useMemo(() => {
    if (!node.routing) return null;

    if (selectedPciProjectId && node.routing.hash?.includes('{projectId}')) {
      const hash = node.routing.hash.replace(
        '{projectId}',
        selectedPciProjectId,
      );
      return getNodeUrl({ ...node.routing, hash });
    }

    return getNodeUrl(node.routing);
  }, [selectedPciProjectId, node.routing, getNodeUrl]);

  useEffect(() => {
    setIsHighlighted(currentNavigationNode?.id === node.id);
  }, [currentNavigationNode, node.id]);

  const badge = node.tag ? (
    <span
      className={`px-2 py-0.5 rounded-lg ml-2 text-xs font-semibold text-white ${
        TAG_CLASSES[node.tag]
      }`}
    >
      {t(`sidebar_tag_${node.tag}`)}
    </span>
  ) : undefined;

  return (
    <SubmenuItem
      href={url}
      isHighlighted={isHighlighted}
      label={t(node.translation)}
      badge={badge}
    />
  );
};
