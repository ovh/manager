import React, { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import styles from './Tabs.module.css';

interface TabsProps {
  children?: React.ReactNode;
}

enum ScrollDirection {
  Left = 'left',
  Right = 'right',
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const updateScrollButtonsState = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scrollContainer = (
    direction: typeof ScrollDirection.Left | typeof ScrollDirection.Right,
  ) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.5;
    const newScrollLeft =
      direction === ScrollDirection.Left
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      updateScrollButtonsState();
      container.addEventListener('scroll', updateScrollButtonsState);
    }

    return () => container.removeEventListener('scroll', updateScrollButtonsState);
  }, [children]);

  return (
    <div className="w-full">
      <div className="flex items-center relative">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.default}
          icon={ODS_ICON_NAME.chevronLeft}
          size={ODS_BUTTON_SIZE.xs}
          label=""
          className="z-10 bg-white p-2 absolute left-0 -translate-x-1/2"
          onClick={() => scrollContainer(ScrollDirection.Left)}
          isDisabled={!canScrollLeft}
        ></OdsButton>

        <div
          ref={containerRef}
          className={clsx(
            'flex overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide w-full px-6',
            `${styles['hide-scrollbar']}`,
          )}
        >
          {children}
        </div>

        <OdsButton
          variant={ODS_BUTTON_VARIANT.default}
          icon={ODS_ICON_NAME.chevronRight}
          size={ODS_BUTTON_SIZE.xs}
          label=""
          className="z-10 bg-white p-2 absolute right-0 translate-x-1/2"
          onClick={() => scrollContainer(ScrollDirection.Right)}
          isDisabled={!canScrollRight}
        ></OdsButton>
      </div>
    </div>
  );
};

export default Tabs;
