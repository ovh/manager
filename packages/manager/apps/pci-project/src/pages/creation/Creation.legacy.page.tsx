import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export default function ProjectCreation() {
  const { t } = useTranslation(['new/legacy', NAMESPACES.FORM, NAMESPACES.ACTIONS]);

  const navigate = useNavigate();

  const [description, setDescription] = useState(`Project ${format(new Date(), 'yyyy-MM-dd')}`);

  const handleCancel = useCallback(() => navigate('..'), [navigate]);

  const handleCreateProject = useCallback(() => {
    const orderLink = `https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'project~productId~'cloud~quantity~1~duration~'P1M~configuration~(~(label~'description~values~(~'${encodeURIComponent(
      description,
    )})))))`;

    window.open(orderLink, '_top', 'noopener,noreferrer');
  }, [description]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="min-h-screen w-full max-w-2xl bg-white p-10 shadow-lg">
        <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('pci_project_new_title')}</OdsText>

        <OdsFormField
          className="w-full"
          error={
            !description.trim() ? t('error_required_field', { ns: NAMESPACES.FORM }) : undefined
          }
        >
          <OdsText className="font-bold" preset="caption">
            {t('pci_project_new_description_label')}
          </OdsText>

          <OdsInput
            name="project-description"
            className="max-w-full"
            value={description}
            maxlength={255}
            onOdsChange={(event) => setDescription(`${event.detail.value}`)}
          />
        </OdsFormField>

        <div className="my-8 flex justify-between">
          <OdsButton
            size="sm"
            variant="outline"
            label={t('cancel', { ns: NAMESPACES.ACTIONS })}
            onClick={handleCancel}
          />
          <OdsButton
            color="primary"
            size="sm"
            label={t('pci_project_new_btn_create')}
            icon={ODS_ICON_NAME.chevronRight}
            iconAlignment="right"
            isDisabled={!description?.trim()}
            onClick={handleCreateProject}
          />
        </div>
      </div>
    </div>
  );
}
