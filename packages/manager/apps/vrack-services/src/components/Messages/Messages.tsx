import React from 'react';
import { OperationMessages } from './OperationMessages';
import { ResiliationSuccessMessages } from './ResiliationMessages';
import { UpdateDisplayNameMessage } from './UpdateDisplayNameMessages';

export const Messages: React.FC<{ vrackServicesId?: string }> = ({
  vrackServicesId,
}) => (
  <>
    <OperationMessages id={vrackServicesId} />
    <ResiliationSuccessMessages id={vrackServicesId} />
    <UpdateDisplayNameMessage vrackServicesId={vrackServicesId} />
  </>
);
