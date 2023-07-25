import React, { useCallback, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLegacyContainer } from '@/container/legacy/context';
import { SidebarMenuItem } from './sidebarMenu';
import style from './index.module.scss';

function ServerSidebarSearchField({
  item,
  onUpdate,
}: {
  item: SidebarMenuItem;
  onUpdate: (value: string) => void;
}) {
  const [, setSearch] = useState(item.searchField);
  const { t } = useTranslation('sidebar');
  return (
    <div className={style.searchField}>
      <i className="ovh-font ovh-font-search" aria-hidden="true"></i>
      <input
        type="search"
        className="oui-input"
        placeholder={t('sidebar_search')}
        value={item.searchField}
        onChange={(e) => {
          setSearch(e.target.value);
          item.searchField = e.target.value;
          item.parent.searchQuery = e.target.value;
          onUpdate(e.target.value);
        }}
      ></input>
    </div>
  );
}

export default function ServerSidebarItemRenderer({
  item,
  onToggle,
  onSearch,
}: {
  item: SidebarMenuItem;
  onToggle: (item: SidebarMenuItem) => void;
  onSearch: (item: SidebarMenuItem) => void;
}) {
  const { t } = useTranslation('sidebar');
  const { setIsResponsiveSidebarMenuOpen } = useLegacyContainer();
  const hasToggle = item.loader || item.subItems?.length > 0;
  const updateHandler = useCallback(() => onSearch(item), [item, onSearch]);
  let itemRender = null;
  if ('searchField' in item) {
    itemRender = (
      <ServerSidebarSearchField item={item} onUpdate={updateHandler} />
    );
  } else if (item.isNoResultField) {
    itemRender = (
      <div>
        {t('sidebar_no_result')}
      </div>
    );
  } else if (hasToggle) {
    let icon = 'oui-icon-chevron-right';
    if (item.loadingError) {
      icon = 'oui-icon-error-circle';
    } else if (item.isOpen) {
      icon = 'oui-icon-chevron-down';
    }
    itemRender = (
      <button
        type="button"
        disabled={item.isLoading}
        onClick={() => onToggle(item)}
        {...{
          'aria-busy': !!item.isLoading,
        }}
        title={item.isOpen ? '' : t('sidebar_load_services')}
        className={`${item.depth > 0 ? style.subButton : ''} ${
          item.isSelected ? style.selectedButton : ''
        }`}
      >
        {item.isLoading && (
          <span className={style.menuItemIcon} aria-hidden="true">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </span>
        )}
        {!item.isLoading && (
          <span className={style.menuItemIcon} aria-hidden="true">
            <i className={`oui-icon ${icon}`}></i>
          </span>
        )}
        {item.icon && (
          <span className={style.menuItemIcon} aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </button>
    );
  } else {
    const externalTarget = item.isExternal
      ? {
        target: '_blank',
        rel: 'noopener',
      }
      : {};
    itemRender = (
      <a
        style={{
          paddingLeft: item.depth === 0 ? '1.75rem' : '0',
          fontWeight: item.isSelected || item.depth === 0 ? 700 : 400,
          color: item.isSelected ? '#2859c0' : '#113f6d',
        }}
        href={item.href || '#'}
        onClick={() => setIsResponsiveSidebarMenuOpen(false)}
        {...externalTarget}
        title={item.title || t('sidebar_access_dashboard')}
        role="menuitem"
      >
        {item.icon && (
          <span className={style.menuItemIcon} aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
        {item?.badge && (
          <span
            className={`oui-badge oui-badge_s oui-badge_${item.badge} ${style.menuBadge}`}
          >
            {item.badge}
          </span>
        )}
      </a>
    );
  }
  return (
    <div className={`${style.menuItem} ${item.depth > 0 ? 'pl-2' : ''}`}>
      <div className={item.depth > 0 ? style.menuItemBorder : ''}>
        <div
          className={item.isSelected ? style.menuItemSelected : ''}
          style={{
            paddingLeft: `${item.depth * 1.75 -
              (item.depth === 1 ? 0.5 : 0)}rem`,
          }}
        >
          {itemRender}
        </div>
      </div>
    </div>
  );
}
