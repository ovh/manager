import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';

interface MeDocumentComponentProps {
  readonly argumentKey: string;
  readonly taskID: number;
}

export default function MeDocumentComponent({
  argumentKey,
  taskID,
}: MeDocumentComponentProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <OdsLink
      onClick={() => navigate(`/upload/${taskID}/${argumentKey}/`)}
      label={t(`domain_operations_update_nicowner_click_${argumentKey}`)}
      icon="external-link"
      className="mb-1 block"
      href=""
      data-testid="documentModal"
    />
  );
}
