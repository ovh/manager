import Listing from '@/components/Listing';
import { Outlet, Link } from 'react-router-dom';

export function Component() {

  const headers = [
    {
      title: 'ID',
      property: 'id'
    },
    {
      title: 'Localisation',
      property: 'localization'
    }
  ];

  const items = [
    {
      id: '1234',
      localization: 'GRA11'
    },
    {
      id: '2345',
      localization: 'DE1'
    }
  ]

  return <>Listing page

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
}

Component.displayName = 'ListingPage';
