import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OdsCheckbox,
  OdsFormField,
  OdsLink,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';

import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { useDedicatedServerIpMigrationDetails } from '@/data/hooks';
import { TRANSLATION_NAMESPACES } from '@/utils';

import ModalButtonGroup from './ModalButtonGroup.component';

export type Step4Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  ip: string;
  token: string;
  duration: string;
  destinationServer?: string;
  isNextButtonLoading?: boolean;
  error?: ApiError | null;
};

export default function Step4({
  onCancel,
  onPrevious,
  onNext,
  ip,
  token,
  duration,
  destinationServer,
  isNextButtonLoading,
  error,
}: Step4Props) {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.importIpFromSys,
    NAMESPACES.CONTACT,
  ]);
  const [isContractChecked, setIsContractChecked] = React.useState(false);
  const { data } = useDedicatedServerIpMigrationDetails({
    ip,
    token,
    serviceName: destinationServer,
    duration,
  });

  return (
    <>
      <div className="mt-4 flex flex-col gap-3">
        {data?.data?.contracts?.map((contract) => (
          <OdsLink
            key={contract.url}
            className="block"
            target="_blank"
            icon={ODS_ICON_NAME.file}
            label={contract.name}
            href={contract.url}
          />
        ))}
      </div>
      <OdsFormField className="mt-7 block">
        <div className="flex items-center">
          <OdsCheckbox
            isChecked={isContractChecked}
            onOdsChange={(e) => setIsContractChecked(e.detail.checked)}
            className="mr-3"
            inputId="terms"
            name="terms"
          />
          <label htmlFor="terms" slot="label">
            {t('acceptContracts')}
          </label>
        </div>
      </OdsFormField>
      <ApiErrorMessage className="my-4" error={error} />
      <ModalButtonGroup
        currentStep={4}
        onCancel={onCancel}
        onPrevious={() => {
          setIsContractChecked(false);
          onPrevious();
        }}
        onNext={onNext}
        isNextButtonLoading={isNextButtonLoading}
        isNextButtonDisabled={!isContractChecked}
      />
    </>
  );
}
