import React from 'react';

import { useVrackServicesList } from '@ovh-ux/manager-network-common';

import { OperationMessage } from './OperationMessage.component';

export const OperationMessages: React.FC<{ id?: string }> = ({ id }) => {
  const { data: vrackServicesList } = useVrackServicesList();

  if (vrackServicesList?.data?.length === 0) {
    return null;
  }

  return id ? (
    <OperationMessage vs={vrackServicesList?.data.find((vs) => vs.id === id)} />
  ) : (
    <>
      {vrackServicesList?.data.map((vs) => (
        <OperationMessage key={vs.id} vs={vs} />
      ))}
    </>
  );
};
