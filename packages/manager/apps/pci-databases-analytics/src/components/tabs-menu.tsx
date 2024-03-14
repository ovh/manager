import { Skeleton } from './ui/skeleton';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { NavLink } from './typography';

interface Tab {
  href: string;
  label: string;
  end?: boolean;
  disabled?: boolean;
}
interface TabsMenuProps {
  tabs: Tab[];
}
const TabsMenu = ({ tabs }: TabsMenuProps) => {
  return (
    <ScrollArea className="py-2">
      <div className="flex border-b border-[#e6f5fc]">
        {tabs.map((tab, index) => (
          <NavLink end={tab.end} to={tab.href} key={`${tab.label}-${index}`}>
            {({ isActive }) => (
              <span
                className="w-full px-6 "
                ref={(node) => {
                  if (node && isActive)
                    node.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                }}
              >
                {tab.label}
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
    <div className="relative flex overflow-x-auto mb-4 w-full border-b border-gray-100">
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
