import { useSearchParams } from 'react-router-dom';

import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

import {
  useProcedureStatus,
  Procedures,
  ProcedureStatus,
} from '@ovh-ux/manager-gcj-module';
import { useApplications } from '@/data/hooks/useApplications';
import { sanitizeUrl } from '@/helpers/sanitization/sanitizationHelper';

const PROCEDURE_INDIA_FEATURE = 'identity-documents';

const usePostCreationRedirectionUrl = () => {
  const [searchParams] = useSearchParams();
  const queryParamUrl = searchParams.get('onsuccess');
  const redirectionUrl = sanitizeUrl(queryParamUrl);
  const { data: defaultUrl } = useApplications({
    select: (applications) =>
      applications.hub?.publicURL ?? `${window.location.origin}/manager`,
  });

  return redirectionUrl || defaultUrl;
};

const useProcedureIndiaUrl = () =>
  useApplications({
    select: (applications) =>
      applications.account?.publicURL &&
      `${applications.account.publicURL}/identity-documents`,
  });

export const useDetailsRedirection = () => {
  const redirectionUrl = usePostCreationRedirectionUrl();
  const { data: procedureIndiaUrl } = useProcedureIndiaUrl();

  const {
    data: availability,
    isLoading: isFeatureAvailabilityLoading,
  } = useFeatureAvailability([PROCEDURE_INDIA_FEATURE]);

  const { data: procedure, isLoading: isProcedureLoading } = useProcedureStatus(
    Procedures.INDIA,
    {
      enabled: Boolean(availability?.[PROCEDURE_INDIA_FEATURE]),
    },
  );

  if (isFeatureAvailabilityLoading || isProcedureLoading) {
    return {
      url: undefined,
      isLoading: true,
    };
  }

  if (
    procedure &&
    [ProcedureStatus.Required, ProcedureStatus.Open].includes(procedure.status)
  ) {
    return {
      url: procedureIndiaUrl || redirectionUrl,
      isLoading: false,
    };
  }

  return {
    url: redirectionUrl,
    isLoading: false,
  };
};
