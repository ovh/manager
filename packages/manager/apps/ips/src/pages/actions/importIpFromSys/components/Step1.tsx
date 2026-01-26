import React from 'react';

import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import {
  FormFieldLabel,
  TEXT_PRESET,
  FormField,
  Input,
  Text,
} from '@ovhcloud/ods-react';

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
        <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
          {t('step1Description')}
        </Text>
        <FormField className="mb-3 block">
          <FormFieldLabel>{t('step1IpLabel')}</FormFieldLabel>
          <Input
            className="w-full"
            name="ipOrBlock"
            id="ipOrBlock"
            invalid={Boolean(ip) && !isIpValid(ip)}
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
        </FormField>
        <FormField>
          <FormFieldLabel>{t('step1TokenLabel')}</FormFieldLabel>
          <Input
            name="token"
            id="token"
            value={token}
            invalid={Boolean(token) && !isTokenValid(token)}
            onChange={(e) => setToken(e.target.value)}
          />
        </FormField>
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
