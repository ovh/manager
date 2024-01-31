import { NavLink } from 'react-router-dom';

interface TabsMenuProps {
  tabs: {
    href: string;
    label: string;
  }[];
}
const TabsMenu = ({ tabs }: TabsMenuProps) => {
  return (
    <div className="relative flex overflow-x-auto mb-4 w-full border-b border-gray-100">
      <div className="flex">
        {tabs.map((tab, index) => (
          <NavLink
            to={tab.href}
            key={index}
            className={({
              isActive,
            }) => `whitespace-nowrap w-full block text-primary-500 text-base font-semibold m-0 px-6 py-2 
                ${isActive ? 'border-b-2 border-primary-500' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default TabsMenu;
