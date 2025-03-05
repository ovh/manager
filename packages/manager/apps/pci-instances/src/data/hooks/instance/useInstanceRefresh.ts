import { Query, useQueries, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getInstance } from '@/data/api/instance';
import { TInstance } from '@/types/instance/entity.type';

type TXXX = { id: string } & Record<string, unknown>;

export type TPendingInstance = Pick<TInstance, 'id' | 'region'>;
export type TUseInstanceRefreshArgs = {
  projectId: string;
  pendingInstances: TPendingInstance[];
};

export type TUseInstanceRefresh = (
  args: TUseInstanceRefreshArgs,
) => {
  data: any[];
};

export const useInstancesStatus = ({
  projectId,
  pendingInstances,
}: TUseInstanceRefreshArgs) => {
  const instanceQueries = useQueries({
    queries: pendingInstances.map(({ id: instanceId, region }) => ({
      queryKey: ['foo', instanceId],
      queryFn: () =>
        getInstance({
          projectId,
          instanceId,
          region,
        }),
      refetchInterval: (query) => (query.state.error ? false : 5000),
    })),
    combine: (results) =>
      results.map(({ data, ...rest }, index) => ({
        id: pendingInstances[index].id,
        ...rest,
        data,
      })),
  });

  instanceQueries.forEach(({ id, data }) => {
    console.log({ data });
    console.log({ id });
    if (id === '484a0d51-8fca-4d81-a392-99432bb23b08') {
      console.log({ data });
    }
  });

  return instanceQueries;
};

// export const useInstancesStatus: TUseInstanceRefresh = ({
//   projectId,
//   pendingInstances,
// }: TUseInstanceRefreshArgs) => {
//   const data = useQueries({
//     queries: pendingInstances.map((elt) => ({
//       queryKey: ['foo', elt.id],
//       queryFn: () =>
//         getInstance({
//           projectId,
//           instanceId: elt.id,
//           region: elt.region,
//         }),
//       refetchInterval: (query) => {
//         const x = pendingInstances.some(
//           (elt) => !query.queryKey.includes(elt.id),
//         );
//         // const x = query.queryKey.includes(elt.id);
//         return x ? 2000 : false;
//       },
//       retry: false,
//     })),
//     combine: (r) => ({
//       data: r.map((d, index) => ({
//         id: pendingInstances[index].id,
//         isFetching: d.isFetching,
//         hasPendingTask: d.data?.hasPendingTask ?? true,
//       })),
//     }),
//   });

//   useEffect(() => {
//     if (data.data.some((elt) => elt.hasPendingTask)) {
//       data.data
//         .filter((x) => x.hasPendingTask === true)
//         .forEach((elt) => {
//           console.log('here');
//           pendingInstances.pop();
//         });
//     }
//   }, [data.data, pendingInstances]);

//   return data;
// };
