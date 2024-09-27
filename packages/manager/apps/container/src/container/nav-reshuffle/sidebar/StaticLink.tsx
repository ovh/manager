import React from 'react';
import { useTranslation } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config';
import { useShell } from '@/context';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

interface StaticLinkProps {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  handleClick?(): void;
  handleOnEnter?(node: Node): void;
  id?: string;
  isShortText?: boolean;
}

const StaticLink: React.FC<ComponentProps<StaticLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  handleClick = () => {},
  handleOnEnter = () => {},
  id = '',
  isShortText = false,
}: StaticLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  let url: string = null;

  if (node.url) {
    url =
      (node.url as Record<string, string>)[environment.getRegion()] ||
      (node.url as string);
  } else {
    url = navigation.getURL(
      node.routing.application,
      node.routing.hash || '#/',
    );
  }

  if (linkParams) {
    Object.keys(linkParams).forEach((paramName) => {
      url = url.replace(`{${paramName}}`, linkParams[paramName]);
    });
  }

  return (
    <a
      onClick={handleClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          handleOnEnter(node);
        }
      }}
      href={url}
      target={node.isExternal ? '_blank' : '_top'}
      rel={node.isExternal ? 'noopener noreferrer' : ''}
      title={t(isShortText ? node.shortTranslation : node.translation)}
      id={id}
      role="link"
      className='d-flex items-center'
    >
      {node.icon && (
      <OsdsIcon
            name={node.icon as ODS_ICON_NAME}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
      )}
      {t(isShortText ? node.shortTranslation : node.translation)}
      {node.isExternal && (
        <OsdsIcon
          name={ODS_ICON_NAME.EXTERNAL_LINK}
          className='ml-1'
          contrasted
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      )}
      {!isShortText && <SidebarLinkTag node={node} />}
      {!isShortText && (count as number) > 0 && (
          <OsdsIcon
            name={ODS_ICON_NAME.SHAPE_DOT}
            size={ODS_ICON_SIZE.xs}
            className={`ml-auto ${style.sidebarLinkTag}`}
          />
      )}
    </a>
  );
};
export default StaticLink;
