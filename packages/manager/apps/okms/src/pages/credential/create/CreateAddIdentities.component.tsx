import { Subtitle } from '@ovh-ux/manager-react-components';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsIcon,
  OdsText,
  OdsDivider,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import IdentitiesRootAccount from './identities/IdentitiesRootAccount.component';
import IdentitiesSelectedUsersList from './identities/IdentitiesSelectedUsersList.component';
import IdentitiesSelectedGroups from './identities/IdentitiesSelectedGroups.component';
import IdentitiesSelectedServiceAccounts from './identities/IdentitiesSelectedServiceAccounts.component';

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
  const { okmsId } = useParams() as { okmsId: string };
  const [isRootAccount, setIsRootAccount] = useState<boolean>(false);
  const { userList, groupList, serviceAccountList } = useIdentityData();
  const { auth } = useContext(ShellContext).environment.getUser();
  const region = useContext(ShellContext).environment.getRegion();
  const { trackClick } = useOvhTracking();

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
  }, [userList, groupList, serviceAccountList, isRootAccount]);

  return (
    <div className="max-w-screen-lg">
      <div className="flex flex-col gap-7 md:gap-9">
        <div className="flex flex-col gap-6 md:gap-8">
          <Subtitle>
            {t('key_management_service_credential_create_identities_title')}
          </Subtitle>
          <IdentitiesRootAccount
            isRootAccount={isRootAccount}
            setIsRootAccount={setIsRootAccount}
          />

          <OdsDivider />

          {!isRootAccount && (
            <>
              <div className="flex items-center gap-1">
                <OdsIcon name={ODS_ICON_NAME.circleInfo} />
                <OdsText preset={ODS_TEXT_PRESET.span}>
                  {t(
                    'key_management_service_credential_create_identities_max_label',
                  )}
                </OdsText>
              </div>
              <IdentitiesSelectedUsersList identityURNs={identityURNs} />
              <IdentitiesSelectedGroups identityURNs={identityURNs} />
              <IdentitiesSelectedServiceAccounts identityURNs={identityURNs} />
            </>
          )}
        </div>
        <div className="flex gap-4">
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            color={ODS_BUTTON_COLOR.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['cancel'],
              });
              navigate(KMS_ROUTES_URLS.credentialListing(okmsId));
            }}
            label={t(
              'key_management_service_credential_create_identities_button_cancel_label',
            )}
          />
          <OdsButton
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['previous'],
              });
              prevStep();
            }}
            label={t(
              'key_management_service_credential_create_identities_button_back_label',
            )}
          />
          <OdsButton
            color={ODS_BUTTON_COLOR.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['confirm'],
              });
              nextStep();
            }}
            isDisabled={identityURNs.length > 25 || identityURNs.length === 0}
            label={t(
              'key_management_service_credential_create_identities_button_create_label',
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAddIdentities;
