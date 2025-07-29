import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsCheckbox,
  OdsFormField,
  OdsLink,
} from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TRANSLATION_NAMESPACES } from '@/utils';
import ModalButtonGroup from './ModalButtonGroup.component';
import { useDedicatedServerIpMigrationDetails } from '@/data/hooks';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';

export type Step4Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  ip: string;
  token: string;
  duration: string;
  destinationServer?: string;
  isNextButtonLoading?: boolean;
  error?: ApiError;
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
      <div className="flex flex-col mt-4 gap-3">
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
      <OdsFormField className="block mt-7">
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
