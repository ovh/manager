import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button, Divider } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { useShellContext } from '@/common/hooks/useShellContext';

import IdentitiesRootAccount from './identities/IdentitiesRootAccount.component';
import IdentitiesSelectedGroups from './identities/IdentitiesSelectedGroups.component';
import IdentitiesSelectedServiceAccounts from './identities/IdentitiesSelectedServiceAccounts.component';
import IdentitiesSelectedUsersList from './identities/IdentitiesSelectedUsersList.component';

type CreateAddIdentitiesProps = {
  identityURNs: string[];
  setIdentityURNs: Dispatch<SetStateAction<string[]>>;
  prevStep: () => void;
  nextStep: () => void;
};

const CreateAddIdentities = ({
  identityURNs,
  setIdentityURNs,
  prevStep,
  nextStep,
}: CreateAddIdentitiesProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { okmsId } = useRequiredParams('okmsId');
  const [isRootAccount, setIsRootAccount] = useState<boolean>(false);
  const { userList, groupList, serviceAccountList } = useIdentityData();
  const { environment } = useShellContext();
  const { auth } = environment.getUser();
  const region = environment.getRegion();
  const { trackClick } = useOkmsTracking();

  useEffect(() => {
    setIdentityURNs(
      isRootAccount
        ? [`urn:v1:${region.toLowerCase()}:identity:account:${auth.account}`]
        : [
            ...userList.map((user) => user.urn),
            ...groupList.map((group) => group.urn),
            ...serviceAccountList
              .map((serviceAccount) => serviceAccount.identity)
              .filter((identity) => identity !== null),
          ],
    );
  }, [
    userList,
    groupList,
    serviceAccountList,
    isRootAccount,
    region,
    auth.account,
    setIdentityURNs,
  ]);

  return (
    <div className="max-w-screen-lg">
      <div className="flex flex-col gap-7 md:gap-9">
        <div className="flex flex-col gap-6 md:gap-8">
          <Text preset="heading-3">
            {t('key_management_service_credential_create_identities_title')}
          </Text>
          <IdentitiesRootAccount
            isRootAccount={isRootAccount}
            setIsRootAccount={setIsRootAccount}
          />

          <Divider />

          {!isRootAccount && (
            <>
              <div className="flex items-center gap-1">
                <Icon name="circle-info" />
                <Text preset="span">
                  {t('key_management_service_credential_create_identities_max_label')}
                </Text>
              </div>
              <IdentitiesSelectedUsersList identityURNs={identityURNs} />
              <IdentitiesSelectedGroups identityURNs={identityURNs} />
              <IdentitiesSelectedServiceAccounts identityURNs={identityURNs} />
            </>
          )}
        </div>
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
              navigate(KMS_ROUTES_URLS.credentialListing(okmsId));
            }}
          >
            {t('key_management_service_credential_create_identities_button_cancel_label')}
          </Button>
          <Button
            variant="ghost"
            color="primary"
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['previous'],
              });
              prevStep();
            }}
          >
            {t('key_management_service_credential_create_identities_button_back_label')}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['confirm'],
              });
              nextStep();
            }}
            disabled={identityURNs.length > 25 || identityURNs.length === 0}
          >
            {t('key_management_service_credential_create_identities_button_create_label')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAddIdentities;
