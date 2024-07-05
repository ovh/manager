import { useRef } from 'react';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import NavLink from '@/components/links/NavLink.component';
import { Badge } from '../ui/badge';

export interface Tab {
  href: string;
  label: string;
  count?: number;
  end?: boolean;
  disabled?: boolean;
}
interface TabsMenuProps {
  tabs: Tab[];
}
const TabsMenu = ({ tabs }: TabsMenuProps) => {
  const s = useRef(null);
  return (
    <ScrollArea
      data-testid="scrollbar"
      className="py-2"
      ref={s}
      onWheel={(e) => {
        s.current.children[1].scrollLeft += e.deltaY;
      }}
    >
      <div
        className="flex border-b border-[#e6f5fc]"
        data-testid="tab-container"
      >
        {tabs.map((tab, index) => (
          <NavLink end={tab.end} to={tab.href} key={`${tab.label}-${index}`}>
            {({ isActive }) => (
              <span
                className="w-full px-6 flex gap-2 items-center"
                ref={(node) => {
                  if (node && isActive)
                    node?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge className="hidden md:block text-xs rounded-full">
                    {tab.count}
                  </Badge>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

TabsMenu.Skeleton = function TabsMenuSkeleton() {
  return (
    <div
      className="relative flex overflow-x-auto mb-4 w-full border-b border-gray-100"
      data-testid="skeleton-container"
    >
      <div className="flex">
        <span className="whitespace-nowrap w-full block text-primary-500 text-base font-semibold m-0 px-6 py-2">
          <Skeleton className="h-6 w-16" />
        </span>
        <span className="whitespace-nowrap w-full block text-primary-500 text-base font-semibold m-0 px-6 py-2">
          <Skeleton className="h-6 w-16" />
        </span>
        <span className="whitespace-nowrap w-full block text-primary-500 text-base font-semibold m-0 px-6 py-2">
          <Skeleton className="h-6 w-16" />
        </span>
        <span className="whitespace-nowrap w-full block text-primary-500 text-base font-semibold m-0 px-6 py-2">
          <Skeleton className="h-6 w-16" />
        </span>
      </div>
    </div>
  );
};

export default TabsMenu;
