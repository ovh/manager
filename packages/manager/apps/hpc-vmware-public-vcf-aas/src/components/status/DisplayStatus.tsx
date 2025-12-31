import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';

import Errors from '../error/Error.component';
import Loading from '../loading/Loading.component';

type DisplayStatusProps =
  | { variant: 'loading' }
  | { variant: 'skeletonLoading'; count?: number }
  | { variant: 'error'; error: ApiError }
  | { variant: 'customError'; error: { status: number; data: { message: string } } };

export const DisplayStatus = (props: DisplayStatusProps) => {
  switch (props.variant) {
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
    case 'customError':
      return <Errors error={props.error} />;
    default:
      return null;
  }
};
