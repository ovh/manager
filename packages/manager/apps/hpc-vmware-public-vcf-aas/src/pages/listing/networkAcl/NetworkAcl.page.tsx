import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import {
  useVcdOrganization,
  isStatusTerminated,
} from '@ovh-ux/manager-module-vcd-api';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import { NetworkAclProvider } from './NetworkAcl.context';
import NetworkAclListContent from './NetworkAclListContent.component';

export default function NetworkAclList() {
  const { id } = useParams();
  const { data: vcdOrganisation } = useVcdOrganization({ id });
  const { t } = useTranslation('networkAcl');
  const organisationStatus = vcdOrganisation?.data?.resourceStatus;
  return (
    <Suspense>
      {!isStatusTerminated(organisationStatus) ? (
        <NetworkAclProvider>
          <NetworkAclListContent />
        </NetworkAclProvider>
      ) : (
        <div className="flex text-center flex-col">
          <OdsText preset="heading-3">
            {t('managed_vcd_network_acl_status_organisation_terminated')}
          </OdsText>
        </div>
      )}
    </Suspense>
  );
}
