import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ParamValueType } from '@ovh-ux/url-builder';
import { useEffect, useState } from 'react';

interface OvhUrl {
  application: string;
  path: string;
  params: Record<string, ParamValueType>;
}
export function ovhUrl(
    application: string,
    path: string = '',
    params: Record<string, ParamValueType> = {},
) {
  const navigation = useNavigation();
  const [url, setUrl] = useState('');
  useEffect(() => {
    const fetchUrl = async ({
        application,
        path,
        params,
    }: OvhUrl) => {
        const goTo = (await navigation.getURL(application, path, params)) as string;
        setUrl(goTo);
    }
    fetchUrl({application, path, params})
  }, [application, path, params, navigation]);
  return url;
} 