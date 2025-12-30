import React from 'react';

import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { Links } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { TRANSLATION_NAMESPACES, useGuideUtils } from '@/utils';

export type IpReverseErrorProps = {
  apiError: ApiError;
};

/**
 * Component to display the api error when trying to update IP Reverse
 * @param apiError the api error to display
 * @returns React Component
 */
export const IpReverseError = ({ apiError }: IpReverseErrorProps) => {
  const { t } = useTranslation([
    'ip-reverse',
    TRANSLATION_NAMESPACES.error,
    'error',
  ]);
  const { trackClick } = useOvhTracking();
  const { links } = useGuideUtils();

  return (
    <span>
      <div className="font-bold">{t('ip_reverse_update_failure_title')}</div>
      <div className="my-2">
        {t('ip_reverse_update_failure_hint')}
        <Links
          href={links?.configureReverseDnsGuide?.link}
          label={t('ip_reverse_update_failure_hint_link')}
          target="_blank"
          onClickReturn={() => {
            trackClick({
              actionType: 'action',
              buttonType: ButtonType.link,
              location: PageLocation.page,
              actions: [
                `go-to_${links?.configureReverseDnsGuide?.trackingLabel}`,
              ],
            });
          }}
        />
        {'.'}
      </div>
      <p>
        <li>
          <span className="inline-block min-w-24 font-bold">
            {t('ip_reverse_update_failure_api_error')}
          </span>
          <span>
            {apiError?.response?.data?.message || apiError?.message || null}
          </span>
        </li>
        <li>
          <span className="inline-block min-w-24 font-bold">
            {t('ip_reverse_update_failure_request_id')}
          </span>
          <span>{apiError?.response?.headers?.['x-ovh-queryid']}</span>
        </li>
      </p>
    </span>
  );
};
