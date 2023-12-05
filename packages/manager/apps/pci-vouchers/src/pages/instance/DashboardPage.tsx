import { Outlet, Link, useParams } from 'react-router-dom';
import { useInstance } from '@/hooks/useInstance';

export default function DashboardPage() {
  const { projectId, instanceId } = useParams();
  const { data: instance } = useInstance(projectId || '', instanceId || '');

  return (
    <>
      {instance && (
        <>
          Dashboard page {instance.id} {instance.name}
          <dl>
            <dt>Status</dt>
            <dd>{instance.status}</dd>

            <dt>Region</dt>
            <dd>{instance.region}</dd>
          </dl>
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
      )}
    </>
  );
}
