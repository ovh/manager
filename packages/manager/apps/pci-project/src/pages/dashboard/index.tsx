import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useResolvedPath } from 'react-router-dom';

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabsList = useMemo(
    () => [
      {
        name: 'general_informations',
        title: 'Informations générales',
        to: useResolvedPath('').pathname,
      },
      {
        name: 'Tab 2',
        title: 'Tab 2',
        to: useResolvedPath('Tab2').pathname,
      },
    ],
    [useResolvedPath],
  );

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
    if (!activeTab) {
      navigate(tabsList[0].to);
    }
  }, [location.pathname, navigate, tabsList]);

  return <div>{/* Render your component content here */}</div>;
}
