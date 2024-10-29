import { Subtitle } from '@ovh-ux/manager-react-components';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { ROUTES_URLS } from '@/routes/routes.constants';
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
  const { okmsId } = useParams();
  const [isRootAccount, setIsRootAccount] = useState<boolean>(false);
  const { userList, groupList, serviceAccountList } = useIdentityData();
  const { nichandle } = useContext(ShellContext).environment.getUser();
  const { trackClick } = useOvhTracking();

  useEffect(() => {
    if (isRootAccount) {
      setIdentityURNs([`urn:v1:eu:identity:account:${nichandle}`]);
      return;
    }
    const userURNs = userList.map((user) => user.urn);
    const groupURNs = groupList.map((group) => group.urn);
    const serviceAccountURNs = serviceAccountList.map(
      (serviceAccount) => serviceAccount.identity,
    );
    setIdentityURNs([...userURNs, ...groupURNs, ...serviceAccountURNs]);
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

          {!isRootAccount && (
            <>
              <div className="flex">
                <OsdsIcon
                  name={ODS_ICON_NAME.INFO}
                  size={ODS_ICON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {t(
                    'key_management_service_credential_create_identities_max_label',
                  )}
                </OsdsText>
              </div>
              <IdentitiesSelectedUsersList identityURNs={identityURNs} />
              <IdentitiesSelectedGroups identityURNs={identityURNs} />
              <IdentitiesSelectedServiceAccounts identityURNs={identityURNs} />
            </>
          )}
        </div>
        <div className="flex gap-4">
          <OsdsButton
            inline
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['cancel'],
              });
              navigate(`/${okmsId}/${ROUTES_URLS.credentials}`);
            }}
          >
            {t(
              'key_management_service_credential_create_identities_button_cancel_label',
            )}
          </OsdsButton>
          <OsdsButton
            inline
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
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
          >
            {t(
              'key_management_service_credential_create_identities_button_back_label',
            )}
          </OsdsButton>
          <OsdsButton
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
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
            disabled={
              identityURNs.length > 25 || identityURNs.length === 0 || undefined
            }
          >
            {t(
              'key_management_service_credential_create_identities_button_create_label',
            )}
          </OsdsButton>
        </div>
      </div>
    </div>
  );
};

export default CreateAddIdentities;
