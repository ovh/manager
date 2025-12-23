import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { useSecretConfigReference } from '@secret-manager/data/hooks/useSecretConfigReference';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { Secret } from '@secret-manager/types/secret.type';
import { SecretSmartConfig, buildSecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { ErrorResponse } from '@/common/types/api.type';

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

export const useSecretSmartConfig = (secret: Secret | undefined): UseSecretSmartConfigResult => {
  const { okmsId } = useRequiredParams('okmsId');

  const { data: okms, isPending: isOkmsPending, error: okmsError } = useOkmsById(okmsId);
  const region = useCurrentRegion(okms ? [okms] : []);

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

  const isPending = isOkmsPending || isSecretConfigOkmsPending || isSecretReferencePending;
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
  const secretConfig = buildSecretSmartConfig(secret, secretConfigOkms, secretReference);

  return {
    isPending: false,
    isError: false,
    error: undefined,
    secretConfig,
  };
};
