import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { UpdateNameModal } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';

const NAME_PATTERN = /^[^<>]+$/;
const PREFIX_TRACKING_EDIT_NAME = 'dashboard::edit-name';

export default function EditNamePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'edit-name']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: nasha, isLoading } = useNashaDetail(serviceName ?? '');
  const [customName, setCustomName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (nasha) {
      setCustomName(nasha.customName || '');
    }
  }, [nasha]);

  const handleClose = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_EDIT_NAME, 'cancel'],
    });
    // Navigate back to parent route (dashboard) using relative path
    navigate('..', { replace: true });
  };

  const handleUpdateName = async (newName: string) => {
    if (!serviceName || !nasha) return;

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_EDIT_NAME, 'confirm'],
    });

    setIsUpdating(true);
    setError(null);

    try {
      await httpV6.put(`${APP_FEATURES.listingEndpoint}/${serviceName}`, {
        customName: newName.trim(),
      });

      // Navigate back to dashboard with success - use relative path
      navigate('..', {
        replace: true,
        state: { success: t('edit-name:success', 'Name updated successfully') },
      });
    } catch (err) {
      setError(err as Error);
      setIsUpdating(false);
    }
  };

  if (isLoading || !nasha) {
    return <div>Loading...</div>;
  }

  return (
    <UpdateNameModal
      isOpen={true}
      headline={t('edit-name:title', `Edit name for ${nasha.serviceName}`, {
        name: nasha.serviceName,
      })}
      description={t('edit-name:description', 'Update the display name for this service')}
      inputLabel={t('edit-name:label', `Name for ${nasha.serviceName}`, {
        name: nasha.serviceName,
      })}
      defaultValue={customName}
      isLoading={isUpdating}
      onClose={handleClose}
      updateDisplayName={(newName: string) => {
        void handleUpdateName(newName);
      }}
      error={error ? error.message : null}
      pattern={NAME_PATTERN.source}
      patternMessage={t(
        'edit-name:rules',
        'Only alphanumeric characters, hyphens and underscores are allowed',
      )}
      cancelButtonLabel={t('edit-name:cancel', 'Cancel')}
      confirmButtonLabel={t('edit-name:confirm', 'Confirm')}
    />
  );
}
