import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useMe } from '@ovh-ux/manager-react-components';

import { Button, Icon } from '@ovh-ux/muk';

import { EditNameModal } from '@/components/edit-name/EditNameModal.component';
import { GUIDES_URL } from '@/pages/dashboard/Dashboard.constants';
import type { Nasha } from '@/types/Dashboard.type';

type DashboardHeaderProps = {
  nasha: Nasha;
  nashaApiUrl: string;
  onReload?: () => void;
};

export function DashboardHeader({
  nasha,
  nashaApiUrl,
  onReload,
}: DashboardHeaderProps) {
  const { t } = useTranslation('dashboard');
  const { me } = useMe();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const name = nasha.customName || nasha.serviceName;
  const subsidiary = me?.ovhSubsidiary || 'DEFAULT';
  const nashaGuidesUrl = GUIDES_URL[subsidiary] || GUIDES_URL.DEFAULT;

  // TODO: Get changelog links from constants
  const changelogLinks = {
    changelog: 'https://github.com/ovh/manager/tree/master/packages/manager/modules/nasha',
    roadmap: 'https://github.com/ovh/manager/tree/master/packages/manager/modules/nasha',
  };

  return (
    <>
      <header className="d-flex flex-row justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <h1 className="h2 mb-0 word-break">{name}</h1>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setIsEditModalOpen(true)}
            aria-label={t('actions.edit')}
          >
            <Icon name="pen" />
          </Button>
        </div>
        <div className="d-flex flex-wrap justify-content-end align-items-center gap-1">
          {/* TODO: Add ChangelogButton when available */}
          <Button
            variant="ghost"
            size="sm"
            href={nashaGuidesUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('guides.header')}
          </Button>
        </div>
      </header>
      <p className="text-muted mb-2">{nasha.serviceName}</p>

      {isEditModalOpen && (
        <EditNameModal
          nasha={nasha}
          nashaApiUrl={nashaApiUrl}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(message) => {
            // TODO: Show success message
            onReload?.();
          }}
          onError={(error) => {
            // TODO: Show error message
            console.error('Error updating name:', error);
          }}
        />
      )}
    </>
  );
}

