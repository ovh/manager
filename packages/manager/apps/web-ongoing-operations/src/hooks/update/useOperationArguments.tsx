import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainArgumentNames,
} from '@/data/api/web-ongoing-operations';
import { TArgument, TOperationArguments } from '@/types';

const getMeTaskArguments = async (
  dataId: number,
): Promise<TOperationArguments> => {
  const nicList = await getmeTaskDomainArgumentNames(dataId);
  const promiseArray: Promise<TArgument>[] = [];

  nicList.forEach((element: string) =>
    promiseArray.push(getmeTaskDomainArgument(dataId, element)),
  );

  const data = (await Promise.all(promiseArray)) || [];

  return { data };
};

export function useOperationArguments(id: number) {
  return useQuery<TOperationArguments>({
    queryKey: ['arguments', id],
    queryFn: () => getMeTaskArguments(id),
  });
}
