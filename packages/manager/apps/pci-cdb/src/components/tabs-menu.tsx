import { NavLink } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface TabsMenuProps {
  tabs: {
    href: string;
    label: string;
  }[];
}
const TabsMenu = ({ tabs }: TabsMenuProps) => {
  return (
    <ScrollArea className="pb-4">
      <div className="flex">
        {tabs.map((tab, index) => (
          <NavLink
            to={tab.href}
            key={index}
            className={({
              isActive,
            }) => `whitespace-nowrap w-fit text-primary-500 text-base font-semibold m-0 px-6 py-2 hover:text-primary-700 
                ${isActive ? 'border-b-2 border-primary-500' : ''}`}
          >
            {tab.label}
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
