import React from 'react';
import { useTranslation } from 'react-i18next';

import { OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';

import type { DashboardHeaderProps } from './DashboardHeader.types';

export const DashboardHeader = ({
  serviceName,
  customName,
  onEditName,
  guides = [],
  isEolService = false
}: DashboardHeaderProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <header className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <OdsText preset="heading-1">
            {customName || serviceName}
          </OdsText>
          <ManagerButton
            id="edit-name-button"
            label=""
            icon={ODS_ICON_NAME.pen}
            variant="ghost"
            onClick={onEditName}
            aria-label={t('edit_name')}
          />
        </div>

        <div className="flex gap-2">
          {/* Guides button simple */}
          {guides.length > 0 && (
            <ManagerButton
              id="guides-button"
              label="Guides"
              icon="book"
              variant="ghost"
              onClick={() => window.open(guides[0]?.link, '_blank')}
            />
          )}
        </div>
      </div>

      <OdsText preset="paragraph" color="neutral-600">
        {serviceName}
      </OdsText>

      {/* EOL banner si applicable */}
      {isEolService && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <OdsText preset="paragraph" color="warning">
            {t('eol_service_warning')}
          </OdsText>
        </div>
      )}
    </header>
  );
};
