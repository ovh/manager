import { FC, PropsWithChildren, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { validate } from 'uuid';
import NotFound from '@/pages/404/NotFound.page';

const InstanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { instanceId } = useParams();
  const isValidUUID = useMemo(
    () => (instanceId ? validate(instanceId) : false),
    [instanceId],
  );

  if (!instanceId || !isValidUUID) return <NotFound />;

  return children;
};

export default InstanceWrapper;
