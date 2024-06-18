import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';
import { isMobile } from '@/container/nav-reshuffle/sidebar/utils';
import StaticLink from '@/container/nav-reshuffle/sidebar/StaticLink';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

type SidebarLinkProps = {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  handleOnMouseOver?(): void;
  handleOnMouseLeave?(): void;
  handleNavigation?(): void;
  id?: string;
  isShortText?: boolean;
};

const SidebarLink: React.FC<ComponentProps<SidebarLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  handleOnMouseOver = () => {},
  handleOnMouseLeave = () => {},
  handleNavigation = () =>  {},
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
      className={style['button-as-div']}
      onMouseOver={!mobile ? handleOnMouseOver : null}
      onMouseLeave={!mobile ? handleOnMouseLeave : null}
      onFocus={!mobile ? handleOnMouseOver : null}
      onTouchEnd={mobile ? handleNavigation : null}
      id={id}
    >
      <span> {t(isShortText ? node.shortTranslation : node.translation)}</span>
      <div className='flex align-items-center'>
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
      </div>
    </button>
  );
};

export default SidebarLink;
