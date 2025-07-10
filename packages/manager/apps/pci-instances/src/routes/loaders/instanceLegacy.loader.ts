import { LoaderFunction, redirect } from 'react-router-dom';
import { TSectionType } from '@/types/instance/action/action.type';
import { actionSectionRegex } from '@/constants';
import { getPathMatch } from '@/utils';

export const instanceLegacyRedirectionLoader: LoaderFunction = ({
  request,
  params,
}) => {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  const { instanceId } = params;
  const region = searchParams.get('region') ?? null;

  const instancePageUrl = `../region/${region}/instance/${instanceId}`;
  const section = getPathMatch<TSectionType>(pathname, actionSectionRegex);

  if (section) {
    return redirect(`${instancePageUrl}/action/${section}`);
  }

  return redirect(instancePageUrl);
};
