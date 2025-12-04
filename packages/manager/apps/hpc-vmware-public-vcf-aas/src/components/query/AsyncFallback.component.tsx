import { useTranslation } from 'react-i18next';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';

import Errors from '../error/Error.component';
import Loading from '../loading/Loading.component';

type AsyncFallbackProps =
  | { state: 'loading' }
  | { state: 'skeletonLoading'; count?: number }
  | { state: 'error'; error: ApiError }
  | { state: 'emptyError' }
  | { state: 'customError'; error: { status: number; data: { message: string } } };

export const AsyncFallback = (props: AsyncFallbackProps) => {
  const { t } = useTranslation(NAMESPACES.DASHBOARD);

  switch (props.state) {
    case 'loading':
      return <Loading />;
    case 'skeletonLoading':
      return (
        <>
          {Array.from({ length: props.count ?? 1 }).map((_, i) => (
            <OdsSkeleton key={i} />
          ))}
        </>
      );
    case 'error':
      return <Errors error={props.error.response} />;
    case 'emptyError':
      return <Errors error={{ status: 503, data: { message: t('no_result_found') } }} />;
    case 'customError':
      return <Errors error={props.error} />;
    default:
      return null;
  }
};
