import { FC, PropsWithChildren, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { validate } from 'uuid';

const InstanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { instanceId } = useParams();
  const isValidUUID = useMemo(
    () => (instanceId ? validate(instanceId) : false),
    [instanceId],
  );

  if (!instanceId || !isValidUUID) return <Navigate to=".." />;

  return children;
};

export default InstanceWrapper;
