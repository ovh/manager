import { Outlet, Link, useLoaderData, LoaderFunction } from 'react-router-dom';

export type LoaderData = {
  instance: { id: string };
};

export const loader:LoaderFunction = async ({ params }) => {
  const { instanceId } = params;

  return {
    instance: { id: instanceId }
  }
}

export const handle = {
  crumb: () => {
    return "Dashboard";
  },
};

export function Component() {
  const { instance } = useLoaderData() as LoaderData;

  return <>Dashboard page {instance.id}

    <ul>
      <li>
        <Link to="./backup">Backup</Link>
      </li>
      <li>
        <Link to="./boot">Boot</Link>
      </li>
      <li>
        <Link to="./stop">Stop</Link>
      </li>
      <li>
        <Link to="./soft-reboot">Soft Reboot</Link>
      </li>
      <li>
        <Link to="./hard-reboot">Hard reboot</Link>
      </li>
      <li>
        <Link to="./delete">Delete</Link>
      </li>
      <li>
        <Link to="./attach-volume">Attach Volume</Link>
      </li>
    </ul>

    <Outlet />
  </>
}

Component.displayName = 'DashboardPage'
