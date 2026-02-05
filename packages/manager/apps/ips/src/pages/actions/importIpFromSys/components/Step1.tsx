import React from 'react';

import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import {
  TRANSLATION_NAMESPACES,
  isValidIpv4Block,
  isValidIpv6Block,
} from '@/utils';

import { VALID_TOKEN_SIZE } from '../importIpFromSys.constant';
import ModalButtonGroup from './ModalButtonGroup.component';

const isIpValid = (ip?: string) => {
  if (!ip) {
    return false;
  }
  return ipaddr.isValid(ip) || isValidIpv4Block(ip) || isValidIpv6Block(ip);
};
const isTokenValid = (token?: string) => token?.length === VALID_TOKEN_SIZE;

type Step1Props = {
  onCancel: () => void;
  onNext: () => void;
  ip?: string;
  setIp: React.Dispatch<React.SetStateAction<string | undefined>>;
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function Step1({
  onCancel,
  onNext,
  ip,
  setIp,
  token,
  setToken,
}: Step1Props) {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.importIpFromSys);
  const isNextButtonDisabled = React.useMemo(
    () => !isIpValid(ip) || !isTokenValid(token),
    [ip, token],
  );

  return (
    <>
      <div className="flex flex-col">
        <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
          {t('step1Description')}
        </OdsText>
        <OdsFormField className="mb-3 block">
          <label htmlFor="ipOrBlock" slot="label">
            {t('step1IpLabel')}
          </label>
          <OdsInput
            className="w-full"
            name="ipOrBlock"
            id="ipOrBlock"
            hasError={Boolean(ip) && !isIpValid(ip)}
            value={ip}
            onOdsChange={(e) => setIp(e.detail.value as string)}
          />
        </OdsFormField>
        <OdsFormField>
          <label htmlFor="token" slot="label">
            {t('step1TokenLabel')}
          </label>
          <OdsInput
            name="token"
            id="token"
            value={token}
            hasError={Boolean(token) && !isTokenValid(token)}
            onOdsChange={(e) => setToken(e.detail.value as string)}
          />
        </OdsFormField>
      </div>
      <ModalButtonGroup
        currentStep={1}
        onCancel={onCancel}
        onNext={onNext}
        isNextButtonDisabled={isNextButtonDisabled}
      />
    </>
  );
}
