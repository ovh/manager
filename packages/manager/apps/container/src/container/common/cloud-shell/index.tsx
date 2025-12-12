import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import clsx from 'clsx';

const CloudShellLink = (): JSX.Element => {
  const { t } = useTranslation('navbar');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const { useBeta } = useContainer();
  const applications = shell
    .getPlugin('environment')
    .getEnvironment()
    .getApplications();

  const url = applications['cloud-shell']?.publicURL;

  if (!url) return null;

  const handleClick = () => {
    trackingPlugin.trackClick({
      name: 'topnav::cloud-shell',
      type: 'action',
    });
  };

  const className = clsx(
    'block bg-transparent',
    useBeta && '*:text-[var(--ods-color-primary-100)]', // Force-override UI-kit link styles
    !useBeta && 'disabled:opacity-50 oui-navbar-link oui-navbar-link_icon',
  );

  return (
    <a
      className={className}
      href={url}
      onClick={handleClick}
      title={t('navbar_cloud_shell')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    </a>
  );
};

export default CloudShellLink;
