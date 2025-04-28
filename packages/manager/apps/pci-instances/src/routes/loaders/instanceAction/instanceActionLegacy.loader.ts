import { LoaderFunction, redirect } from 'react-router-dom';
import { TSectionType } from '@/types/instance/action/action.type';
import { actionSectionRegex } from '@/constants';
import { getPathMatch } from '@/utils';

export const instanceActionLegacyLoader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  const instanceId = searchParams.get('instanceId');
  const region = searchParams.get('region') ?? null;

  const section = getPathMatch<TSectionType>(pathname, actionSectionRegex);

  const canRedirect = !!section && !!instanceId;

  if (canRedirect) {
    return redirect(`../region/${region}/instance/${instanceId}/${section}`);
  }

  return { notFoundAction: true };
};
