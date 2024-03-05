import { H3 } from '@/components/typography';

export function breadcrumb() {
  return 'Settings';
}

const Settings = () => {
  return (
    <>
      <H3>Settings</H3>
      <ul className="list-disc list-inside">
        <li className="list-item">Update backup time</li>
        <li className="list-item">Update maintenance time</li>
        <li className="list-item">Maintenances</li>
        <li className="list-item">Manage ips</li>
        <li className="list-item">Update version</li>
        <li className="list-item">Update plan</li>
        <li className="list-item">Update flavor</li>
        <li className="list-item">Update storage</li>
        <li className="list-item">Advanced configuration</li>
        <li className="list-item">Rename service</li>
        <li className="list-item">Delete service</li>
        <li className="list-item">Support ?</li>
        <li className="list-item">Billing ?</li>
      </ul>
    </>
  );
};

export default Settings;
