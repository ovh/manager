import { useParams } from 'react-router-dom';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { useSecretConfigReference } from '@secret-manager/data/hooks/useSecretConfigReference';
import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { Secret } from '@secret-manager/types/secret.type';
import {
  buildSecretSmartConfig,
  SecretSmartConfig,
} from '@secret-manager/utils/secretSmartConfig';
import { useNotificationAddErrorOnce } from '@/hooks/useNotificationAddErrorOnce';
import { useOkmsById } from '@/data/hooks/useOkms';
import { ErrorResponse } from '@/types/api.type';

export type UseSecretSmartConfigResult =
  | {
      isPending: true;
      isError: false;
      error: undefined;
      secretConfig: undefined;
    }
  | {
      isPending: false;
      isError: true;
      error: ErrorResponse;
      secretConfig: undefined;
    }
  | {
      isPending: false;
      isError: false;
      error: undefined;
      secretConfig: SecretSmartConfig;
    };

export const useSecretSmartConfig = (
  secret: Secret | undefined,
): UseSecretSmartConfigResult => {
  const { okmsId } = useParams() as LocationPathParams;

  const {
    data: okms,
    isPending: isOkmsPending,
    error: okmsError,
  } = useOkmsById(okmsId);
  const region = useCurrentRegion(okms?.data ? [okms.data] : []);

  const {
    data: secretConfigOkms,
    isPending: isSecretConfigOkmsPending,
    error: secretConfigOkmsError,
  } = useSecretConfigOkms(okmsId);
  const {
    data: secretReference,
    isPending: isSecretReferencePending,
    error: secretReferenceError,
  } = useSecretConfigReference(region);

  const isPending =
    isOkmsPending || isSecretConfigOkmsPending || isSecretReferencePending;
  const error = okmsError || secretConfigOkmsError || secretReferenceError;

  useNotificationAddErrorOnce(error);

  if (isPending || !secret) {
    return {
      isPending: true,
      isError: false,
      error: undefined,
      secretConfig: undefined,
    };
  }

  if (error) {
    return { isPending: false, isError: true, error, secretConfig: undefined };
  }

  // Get the secret config from all sources
  const secretConfig = buildSecretSmartConfig(
    secret,
    secretConfigOkms,
    secretReference,
  );

  return {
    isPending: false,
    isError: false,
    error: undefined,
    secretConfig,
  };
};
