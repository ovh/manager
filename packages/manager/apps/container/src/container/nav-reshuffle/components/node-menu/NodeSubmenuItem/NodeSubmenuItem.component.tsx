import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, NodeTag } from '@/types/node';
import { Badge, BADGE_COLOR } from '@ovh-ux/muk';
import { SubmenuItem } from '../../common/SubmenuItem/SubmenuItem.component';
import { useNodeUrl } from '../../../hooks/useNodeUrl';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

interface NodeSubmenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  node: Node;
}

const TAG_COLORS: Record<NodeTag, BADGE_COLOR> = {
  [NodeTag.NEW]: BADGE_COLOR.information,
  [NodeTag.BETA]: BADGE_COLOR.success,
  [NodeTag.ALPHA]: BADGE_COLOR.warning,
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

  const badge = useMemo(
    () =>
      node.tag ? (
        <Badge color={TAG_COLORS[node.tag]} className="ml-2">
          {t(`sidebar_tag_${node.tag}`)}
        </Badge>
      ) : (
        undefined
      ),
    [node?.tag],
  );

  useEffect(() => {
    setIsHighlighted(currentNavigationNode?.id === node.id);
  }, [currentNavigationNode, node.id]);

  return (
    <SubmenuItem
      href={url}
      isHighlighted={isHighlighted}
      label={t(node.translation)}
      badge={badge}
    />
  );
};
