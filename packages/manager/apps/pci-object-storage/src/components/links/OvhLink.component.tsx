import * as React from 'react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import A from './A.component';

interface OvhLinkProps {
  application: string;
  path: string;
  params?: Record<string, string | number | boolean>;
}
function OvhLink({
  application,
  path,
  params = {},
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> &
  OvhLinkProps & { disabled?: boolean }) {
  const navigation = useNavigation();
  const [url, setUrl] = React.useState('');
  React.useEffect(() => {
    const fetchUrl = async (urlParams: OvhLinkProps) => {
      const goTo = (await navigation.getURL(
        urlParams.application,
        urlParams.path,
        urlParams.params,
      )) as string;
      setUrl(goTo);
    };
    fetchUrl({ application, path, params });
  }, [application, path, params, navigation]);
  return (
    <A href={url} {...props}>
      {children}
    </A>
  );
}

export default OvhLink;
