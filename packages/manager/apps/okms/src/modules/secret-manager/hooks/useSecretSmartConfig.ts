import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { useSecretConfigReference } from '@secret-manager/data/hooks/useSecretConfigReference';
import { Secret } from '@secret-manager/types/secret.type';
import { SecretSmartConfig, buildSecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';

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

export type UseSecretSmartConfigParams = {
  secret: Secret | undefined;
  okmsId: string;
};

export const useSecretSmartConfig = ({
  secret,
  okmsId,
}: UseSecretSmartConfigParams): UseSecretSmartConfigResult => {
  const { data: okms, isPending: isOkmsPending, error: okmsError } = useOkmsById(okmsId);
  const region = okms?.region;

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

  if (isPending) {
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
  const secretConfig = buildSecretSmartConfig(secretConfigOkms, secretReference, secret);

  return {
    isPending: false,
    isError: false,
    error: undefined,
    secretConfig,
  };
};
