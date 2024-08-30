import React from 'react';
import { useTranslation } from 'react-i18next';

import { Node } from './navigation-tree/node';
import style from './style.module.scss';

export default function SidebarLinkTag({ node }: { node: Node }): JSX.Element {
  const { t } = useTranslation('sidebar');
  return (
    <>
      {node.tag && (
        <span
          data-testid={`static-link-tag-${node.id}`}
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_tag}`}
        >
          {t(`sidebar_tag_${node.tag}`)}
        </span>
      )}
    </>
  );
}
