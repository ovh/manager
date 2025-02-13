import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
} from '@/data/api/web-ongoing-operations';
import { urls } from '@/routes/routes.constant';

export function useOperationArguments(dataId: number) {
  const [operationArguments, setOperationArguments] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actions, setActions] = useState<boolean>(false);
  const navigate = useNavigate();

  getmeTaskDomainNicList(dataId)
    .then((nicList) => {
      const promises = nicList.map((element: string) =>
        getmeTaskDomainArgument(dataId, element),
      );
      return Promise.all(promises);
    })
    .then((argument) => {
      setOperationArguments(argument);
      argument.some((argumentItem) => {
        if (
          argumentItem.type === '/me/contact' ||
          argumentItem.type === 'string' ||
          argumentItem.type === '/me'
        ) {
          return setActions(true);
        }
        return null;
      });
      setLoading(false);
    })
    .catch(() => {
      navigate(urls.error404);
    });

  return { operationArguments, loading, actions };
}
