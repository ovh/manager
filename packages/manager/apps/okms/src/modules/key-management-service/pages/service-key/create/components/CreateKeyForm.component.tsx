import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useCreateOkmsServiceKey } from '@key-management-service/data/hooks/useCreateOkmsServiceKey';
import { ProtectionLevelSection } from '@key-management-service/pages/service-key/create/components/ProtectionLevelSection.component';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import {
  OkmsKeyTypes,
  OkmsServiceKeyCurve,
  OkmsServiceKeyOperations,
  OkmsServiceKeySize,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';
import { ServiceKeyNameErrors } from '@key-management-service/utils/service-key/validateServiceKeyName';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { CREATE_KEY_TEST_IDS } from '../CreateKey.constants';
import { GeneralInformationSection } from './GeneralInformationSection.component';
import { KeyTypeSection } from './KeyTypeSection.component';
import { KeyUsageSection } from './KeyUsageSection.component';

type CreateKeyFormProps = {
  okmsId: string;
  region: string;
  references: OkmsServiceKeyReference[];
  defaultReference: OkmsServiceKeyReference;
};

export const CreateKeyForm = ({
  okmsId,
  region,
  references,
  defaultReference,
}: CreateKeyFormProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOkmsTracking();

  const [keyType, setKeyType] = useState<OkmsKeyTypes>(defaultReference?.type);
  const [keySize, setKeySize] = useState<OkmsServiceKeySize | undefined>(
    defaultReference?.sizes.find((size) => size.default)?.value,
  );
  const [keyCurve, setKeyCurve] = useState<OkmsServiceKeyCurve | undefined>(
    defaultReference?.curves.find((curve) => curve.default)?.value,
  );
  const [keyOperations, setKeyOperations] = useState<OkmsServiceKeyOperations[]>([]);
  const [keyDisplayName, setKeyDisplayName] = useState<string | undefined>();
  const [serviceKeyNameError, setServiceKeyNameError] = useState<
    ServiceKeyNameErrors | undefined
  >();

  const { createKmsServiceKey, isPending } = useCreateOkmsServiceKey({
    okmsId,
  });

  // Find the current reference for the selected key type
  const currentReference = references.find((ref) => ref.type === keyType);

  // Set all default values when the key type changes
  useEffect(() => {
    if (!currentReference) {
      return;
    }

    const preselectedSize = currentReference.sizes.find((size) => size.default);
    const preselectedCurve = currentReference.curves.find((curve) => curve.default);
    const defaultOperations = currentReference.operations.find((operation) => operation.default);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeySize(preselectedSize?.value || undefined);
    setKeyCurve(preselectedCurve?.value || undefined);
    setKeyOperations(defaultOperations?.value || []);
  }, [keyType, currentReference, setKeySize, setKeyCurve, setKeyOperations]);

  // Submit form
  const handleSubmit = async () => {
    if (!keyDisplayName || !keyType) {
      return;
    }

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['confirm'],
    });

    try {
      await createKmsServiceKey({
        name: keyDisplayName,
        context: keyDisplayName,
        curve: keyCurve,
        size: keySize ? (Number(keySize) as OkmsServiceKeySize) : undefined,
        operations: keyOperations,
        type: keyType,
      });

      navigate(KMS_ROUTES_URLS.serviceKeyListing(okmsId));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['create', 'service-key'],
      });
    } catch {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['create', 'service-key'],
      });
    }
  };

  return (
    <div className="block w-full">
      <div className="max-w-lg gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <ProtectionLevelSection />
          <GeneralInformationSection
            keyDisplayName={keyDisplayName}
            setKeyDisplayName={setKeyDisplayName}
            serviceKeyNameError={serviceKeyNameError}
            setServiceKeyNameError={setServiceKeyNameError}
          />
          <KeyTypeSection
            keyType={keyType}
            keySize={keySize}
            keyCurve={keyCurve}
            setKeyType={setKeyType}
            setKeySize={setKeySize}
            setKeyCurve={setKeyCurve}
            region={region}
            currentReference={currentReference}
          />
          <KeyUsageSection
            keyType={keyType}
            keyOperations={keyOperations}
            setKeyOperations={setKeyOperations}
            currentReference={currentReference}
          />
          <div className="flex gap-4">
            <Button
              variant="outline"
              color="primary"
              onClick={() => {
                trackClick({
                  location: PageLocation.funnel,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: ['cancel'],
                });
                navigate(KMS_ROUTES_URLS.serviceKeyListing(okmsId));
              }}
            >
              {t('key_management_service_service-keys_create_cta_cancel')}
            </Button>
            <Button
              color="primary"
              data-testid={CREATE_KEY_TEST_IDS.ctaConfirm}
              onClick={handleSubmit}
              loading={isPending}
              disabled={!keyDisplayName || !!serviceKeyNameError || keyOperations?.length === 0}
            >
              {t('key_management_service_service-keys_create_cta_submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
