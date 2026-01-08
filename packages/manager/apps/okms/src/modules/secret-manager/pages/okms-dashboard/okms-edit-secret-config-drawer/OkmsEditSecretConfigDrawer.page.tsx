import { Suspense } from 'react';

import { useNavigate, useOutletContext } from 'react-router-dom';

import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/muk';

import { EditOkmsSecretConfigDrawerForm } from '@/common/components/okms-secret-config-drawer-form/EditOkmsSecretConfigDrawerForm.component';

import { OkmsDashboardOutletContext } from '../OkmsDashboard.type';

const OkmsEditSecretConfigDrawer = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { okms } = useOutletContext<OkmsDashboardOutletContext>();

  const { data: okmsSecretConfig, isPending, error } = useSecretConfigOkms(okms.id);

  const handleDismiss = () => {
    navigate('..');
  };

  return (
    <Drawer.Root isOpen onDismiss={handleDismiss} isLoading={isPending}>
      <Drawer.Header title={t('edit_okms_secret_config')} />
      <Suspense>
        {error && (
          <Drawer.Content>
            <Message color="critical" className="mb-4" dismissible={false}>
              {error?.response?.data?.message}
            </Message>
          </Drawer.Content>
        )}
        {!error && !isPending && (
          <EditOkmsSecretConfigDrawerForm
            okmsId={okms.id}
            secretConfig={okmsSecretConfig}
            onDismiss={handleDismiss}
          />
        )}
      </Suspense>
    </Drawer.Root>
  );
};

export default OkmsEditSecretConfigDrawer;
