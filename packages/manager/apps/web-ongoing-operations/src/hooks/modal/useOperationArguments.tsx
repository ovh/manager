import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
} from '@/data/api/web-ongoing-operations';
import { TArgument, TOperationArguments } from '@/types';

const getMeTaskArguments = async (
  dataId: number,
): Promise<TOperationArguments> => {
  const nicList = await getmeTaskDomainNicList(dataId);
  const promiseArray: Promise<TArgument>[] = [];

  nicList.forEach((element: string) =>
    promiseArray.push(getmeTaskDomainArgument(dataId, element)),
  );

  const data = (await Promise.all(promiseArray)) || [];

  const index = data.findIndex((arg) =>
    ['/me/contact', 'string', '/me'].includes(arg.type),
  );
  const actions = index >= 0;
  return { data, actions };
};

export function useOperationArguments(id: number) {
  return useQuery<TOperationArguments>({
    queryKey: ['arguments'],
    queryFn: () => getMeTaskArguments(id),
  });
}
