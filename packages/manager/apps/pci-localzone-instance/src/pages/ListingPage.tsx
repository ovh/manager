import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Listing from '@/components/Listing';

export default function ListingPage() {
  const { t } = useTranslation('common');

  const headers = [
    {
      title: 'ID',
      property: 'id',
    },
    {
      title: 'Localisation',
      property: 'localization',
    },
  ];

  const items = [
    {
      id: '1234',
      localization: 'GRA11',
    },
    {
      id: '2345',
      localization: 'DE1',
    },
  ];

  return (
    <>
      Listing page {t('hello')}
      <Link to="./new">Create an instance</Link>
      <Listing headers={headers} items={items} />
      <ul>
        <li>
          <Link to="./1234">Instance Dashboard</Link>
        </li>
        <li>
          <Link to="./boot?instanceId=1234">Boot an instance</Link>
        </li>
      </ul>
      <Outlet />
    </>
  );
}
