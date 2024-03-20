import { Link } from '@/components/links';

const Settings = () => {
  return (
    <>
      <h3>Settings</h3>
      <Link to={'update'}>Update service</Link>
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
