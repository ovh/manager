import React, { useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import ServerSidebarItemRenderer from './SidebarItemRenderer';
import { loadItem, SidebarMenuItem } from './sidebarMenu';
import style from './index.module.scss';

export default function ServerSidebarVirtual({
  items,
  onMenuChange,
}: {
  items: SidebarMenuItem[];
  onMenuChange: CallableFunction;
}) {
  const { t } = useTranslation('sidebar');
  const parentRef = useRef();
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getItemKey: (i) => items[i].id,
    getScrollElement: () => parentRef.current,
    estimateSize: () => parseInt(style.menuRowHeight, 10),
  });
  const onItemToggle = useCallback(
    (item: SidebarMenuItem) => {
      if (
        item.loader &&
        !item.isOpen &&
        !item.isLoading &&
        !item.subItems?.length
      ) {
        item.isOpen = true;
        loadItem(item).finally(() => {
          item.isOpen = true;
          onMenuChange();
        });
      } else {
        item.isOpen = !item.isOpen;
      }
      if (item.href && !item.isExternal) {
        window.location.href = item.href;
      }
      onMenuChange();
    },
    [onMenuChange],
  );

  const notifyMenuChange = useCallback(() => onMenuChange(), [onMenuChange]);

  // @TODO this is a hack since row virtualizer doesn't recalculate range when optiosn changes
  // it has to be removed once the issue is resolved in tanstack virtual
  rowVirtualizer.calculateRange();

  const getRootParent = (item: SidebarMenuItem): SidebarMenuItem => {
    if (!item) {
      return item;
    }
    if (item?.depth === 0) {
      return item;
    }
    return getRootParent(item?.parent);
  };
  const vItems = rowVirtualizer.getVirtualItems();
  const stickyChild = items[vItems[2]?.index];
  const stickyParent = getRootParent(stickyChild);
  const hideSticky = vItems
    .slice(1, vItems.length)
    .some((i) => items[i.index] === stickyParent);

  return (
    <>
      <div ref={parentRef} className={style.container}>
        <nav
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
          aria-label={t('sidebar_description')}
        >
          <ul role="menu" tabIndex={0}>
            {vItems.map((virtualRow) => (
              <li
                key={virtualRow.key}
                role="menuitem"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ServerSidebarItemRenderer
                  item={items[virtualRow.index]}
                  onToggle={onItemToggle}
                  onSearch={notifyMenuChange}
                ></ServerSidebarItemRenderer>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {stickyChild?.depth >= 1 && stickyParent && !hideSticky && (
        <div className={style.sticky}>
          <ServerSidebarItemRenderer
            item={stickyParent}
            onToggle={onItemToggle}
            onSearch={notifyMenuChange}
          ></ServerSidebarItemRenderer>
        </div>
      )}
    </>
  );
}
