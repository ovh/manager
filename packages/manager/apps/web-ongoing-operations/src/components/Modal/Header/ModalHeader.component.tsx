import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TOngoingOperations } from '@/types';

interface ModalHeaderComponentProps {
  readonly data: TOngoingOperations;
}

export default function ModalHeaderComponent({
  data,
}: ModalHeaderComponentProps) {
  const { t } = useTranslation('dashboard');
  const { domain, comment, function: func } = data;

  return (
    <div>
      <hgroup className="mb-2">
        <OdsText preset="heading-3" className="mb-3">
          {t('domain_operations_modal_title', {
            t0: domain,
          })}
        </OdsText>
        {comment && (
          <OdsText preset="span">
            {t('domain_operations_update_comment', {
              t0: comment,
            })}
          </OdsText>
        )}
      </hgroup>
      <OdsText>
        {t('domain_operations_update_info', {
          t0: t(`domain_operations_nicOperation_${func}`),
        })}
      </OdsText>
    </div>
  );
}
