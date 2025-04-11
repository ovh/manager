import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';
import StaticLink from '@/container/nav-reshuffle/sidebar/StaticLink';
import {
  OsdsIcon,
  OsdsSkeleton,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SKELETON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';

export type SidebarLinkProps = {
  hasService?: boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  handleOnClick?(): void;
  handleOnEnter?(node: Node): void;
  id?: string;
  isShortText?: boolean;
  isLoading?: boolean;
};

const SidebarLink: React.FC<ComponentProps<SidebarLinkProps>> = ({
  hasService = false,
  node = {},
  linkParams = {},
  handleOnClick = () => {},
  handleOnEnter = () => {},
  id = '',
  isShortText = false,
  isLoading = false,
}: SidebarLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');

  return !node.children && (node.url || node.routing) ? (
    <StaticLink
      handleClick={handleOnClick}
      handleOnEnter={handleOnEnter}
      hasService={hasService}
      node={node}
      linkParams={linkParams}
      id={id}
      isShortText={isShortText}
    />
  ) : (
    <button
      className={`${style.button_as_div} ${
        isShortText ? style.button_as_div_short : ''
      } relative`}
      title={t(node.translation)}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          handleOnEnter(node);
        }
      }}
      onClick={handleOnClick}
      id={id}
      data-testid={id}
      role="button"
    >
      <span className="flex gap-2 align-items-center justify-start whitespace-nowrap">
        <span className={style.button_as_div_icon}>
          <SvgIconWrapper
            name={node.svgIcon}
            height={32}
            width={32}
            className={`p-1 fill-white transition-all duration-200O shrink-0 ${
              isLoading ? 'hidden' : 'block'
            }`}
          />
          {isLoading && isShortText && (
            <OsdsSpinner
              className={`h-[32px] w-[32px] transition-all duration-200O shrink-0`}
              size={ODS_SPINNER_SIZE.sm}
              contrasted
            />
          )}
        </span>
        {!isShortText && (
          <span className={style.sidebarLinkTitle}>
            {isLoading ? (
              <OsdsSkeleton
                inline={true}
                className="mx-2"
                size={ODS_SKELETON_SIZE.xs}
                randomized
              />
            ) : (
              <>{t(node.translation)}</>
            )}
          </span>
        )}
      </span>
      <span className="flex justify-end align-items-center">
        {hasService && (
          <OsdsIcon
            name={ODS_ICON_NAME.SHAPE_DOT}
            size={ODS_ICON_SIZE.xs}
            className={`${style.sidebarLinkTag} ${
              isShortText ? 'absolute -top-1.5 right-2.5' : ''
            }`}
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
