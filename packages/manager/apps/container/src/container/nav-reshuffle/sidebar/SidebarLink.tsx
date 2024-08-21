import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';
import StaticLink from '@/container/nav-reshuffle/sidebar/StaticLink';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import useProductNavReshuffle from '@/core/product-nav-reshuffle/useProductNavReshuffle';

type SidebarLinkProps = {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  handleOnClick?(): void;
  handleOnEnter?(node: Node): void;
  id?: string;
  isShortText?: boolean;
};

const SidebarLink: React.FC<ComponentProps<SidebarLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  handleOnClick = () => { },
  handleOnEnter = () => { },
  id = '',
  isShortText = false,
}: SidebarLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const { isMobile } = useProductNavReshuffle();

  const Icon = node.iconNode;

  return !node.children && (node.url || node.routing) ? (
    <StaticLink
      handleClick={handleOnClick}
      handleOnEnter={handleOnEnter}
      count={count}
      node={node}
      linkParams={linkParams}
      id={id}
      isShortText={isShortText}
    />
  ) : (
    <button
      className={style['button-as-div']}
      title={t(node.translation)}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          handleOnEnter(node);
        }
      }}
      onClick={handleOnClick}
      id={id}
      role="button"
    >

      {isShortText ?
        <Icon className='p-1 fill-white block' />
        : <span>{t(node.translation)}</span>}
      <span className="flex justify-end align-items-center">
        {!isShortText && (count as number) > 0 && (
          <OsdsIcon
            name={ODS_ICON_NAME.SHAPE_DOT}
            size={ODS_ICON_SIZE.xs}
            className={style.sidebarLinkTag}
          />
        )}
        {!isShortText && node.children ? (
          <span
            className={`oui-icon oui-icon-chevron-right ${style.sidebar_arrow}`}
            aria-hidden="true"
          ></span>
        ) : null}
        {!isShortText && <SidebarLinkTag node={node} />}
      </span>
    </button >
  );
};

export default SidebarLink;