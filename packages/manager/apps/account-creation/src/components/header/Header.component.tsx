import ovhCloudLogo from '@/assets/logo-ovhcloud.png';

export default function HeaderComponent() {
  return (
    <div
      className="p-4 flex flex-row items-center justify-between gap-4"
      data-testid="header"
    >
      <img src={ovhCloudLogo} alt="ovh-cloud-logo" className="app-logo ml-3" />
    </div>
  );
}
