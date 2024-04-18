import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';
import { isMobile } from '@/container/nav-reshuffle/sidebar/utils';
import StaticLink from '@/container/nav-reshuffle/sidebar/StaticLink';

type SidebarLinkProps = {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  handleNavigation?(): void;
  id?: string;
  isShortText?: boolean;
};

const SidebarLink: React.FC<ComponentProps<SidebarLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  handleNavigation = () => {},
  id = '',
  isShortText = false,
}: SidebarLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const mobile = isMobile();

  return !node.children && (node.url || node.routing) ? (
    <StaticLink
      handleClick={handleNavigation}
      count={count}
      node={node}
      linkParams={linkParams}
      id={id}
      isShortText={isShortText}
    />
  ) : (
    <button
      className={`${style['button-as-div']}`}
      onMouseOver={!mobile ? handleNavigation : null}
      onFocus={!mobile ? handleNavigation : null}
      onTouchEnd={mobile ? handleNavigation : null}
      id={id}
    >
      <span> {t(isShortText ? node.shortTranslation : node.translation)}</span>
      <div>
        {!isShortText && node.children ? (
          <span
            className={`oui-icon oui-icon-chevron-right ${style.sidebar_arrow}`}
            aria-hidden="true"
          ></span>
        ) : null}
        {!isShortText && <SidebarLinkTag node={node} />}
        {!isShortText && (count as number) > 0 && (
          <span
            className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );
};

export default SidebarLink;
