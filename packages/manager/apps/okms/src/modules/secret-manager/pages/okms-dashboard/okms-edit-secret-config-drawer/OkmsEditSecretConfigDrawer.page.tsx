import { Suspense } from 'react';

import { useNavigate, useOutletContext } from 'react-router-dom';

import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';

import { EditOkmsSecretConfigDrawerForm } from '@/common/components/okms-secret-config-drawer-form/EditOkmsSecretConfigDrawerForm.component';

import { OkmsDashboardOutletContext } from '../OkmsDashboard.type';
import { OKMS_EDIT_SECRET_CONFIG_DRAWER_TEST_IDS } from './OkmsEditSecretConfigDrawer.page.constants';

const OkmsEditSecretConfigDrawer = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { okms } = useOutletContext<OkmsDashboardOutletContext>();

  const { data: okmsSecretConfig, isPending, error } = useSecretConfigOkms(okms.id);

  const handleDismiss = () => {
    navigate('..');
  };

  return (
    <Drawer
      isOpen
      heading={t('edit_okms_secret_config')}
      onDismiss={handleDismiss}
      isLoading={isPending}
      data-testid={OKMS_EDIT_SECRET_CONFIG_DRAWER_TEST_IDS.drawer}
    >
      <Suspense>
        {error && (
          <OdsMessage color="danger" className="mb-4" isDismissible={false}>
            {error?.response?.data?.message}
          </OdsMessage>
        )}
        {!error && !isPending && (
          <EditOkmsSecretConfigDrawerForm
            okmsId={okms.id}
            secretConfig={okmsSecretConfig}
            onDismiss={handleDismiss}
          />
        )}
      </Suspense>
    </Drawer>
  );
};

export default OkmsEditSecretConfigDrawer;
