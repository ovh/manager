import React, { useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { US_API_CONSOLE_LINK } from '../actions.constants';

export const HandleLinkNavigation = ({
  children,
}: Readonly<{ children?: string }>) => {
  const { shell, environment } = React.useContext(ShellContext);
  const region = useMemo(() => environment.getRegion(), [shell]);
  const appName = environment.getApplicationURL('new-billing')
    ? 'new-billing'
    : 'dedicated';
  const [href, setHref] = React.useState('');

  React.useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await shell.navigation.getURL(
          appName,
          '#/billing/autorenew/services',
          {},
        );
        setHref(response as string);
      } catch (error) {
        setHref('#');
      }
    };
    fetchUrl();
  }, []);

  return (
    <OdsLink
      href={region !== 'US' ? href : US_API_CONSOLE_LINK}
      referrerpolicy="strict-origin-when-cross-origin"
      target="_blank"
      icon={ODS_ICON_NAME.externalLink}
      label={children}
    />
  );
};
