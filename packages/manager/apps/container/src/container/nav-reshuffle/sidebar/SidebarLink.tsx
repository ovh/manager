import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';
import StaticLink from '@/container/nav-reshuffle/sidebar/StaticLink';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { SidebarTooltipLink } from './tooltip/SidebarTooltipLink';

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
  handleOnClick = () => {},
  handleOnEnter = () => {},
  id = '',
  isShortText = false,
}: SidebarLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');

  return !node.children && (node.url || node.routing) ? (
    <StaticLink
      handleClick={handleOnClick}
      count={count}
      node={node}
      linkParams={linkParams}
      id={id}
      isShortText={isShortText}
    />
  ) : (
    <button
      className={style['button-as-div']}
      title={t(isShortText ? node.shortTranslation : node.translation)}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          handleOnEnter(node);
        }
      }}
      onClick={handleOnClick}
      id={id}
      role="button"
    >
      {isShortText && (
        <SidebarTooltipLink
          tooltip={t(node.translation)}
          text={t(node.shortTranslation)}
        />
      )}
        <span className="flex justify-start align-items-center">
        {node.icon && (
          <OsdsIcon
            name={node.icon as ODS_ICON_NAME}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
        )}
        {!isShortText && (
          <span>{t(node.translation)}</span>
        )}
        </span>
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
    </button>
  );
};

export default SidebarLink;
