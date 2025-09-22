import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsCheckbox,
  OdsFormField,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { getHdsInfoUrl } from '@/constants';

type HdsOptionProps = {
  isChecked: boolean;
  onCheckChanged: (isChecked: boolean) => void;
  isValidForCertification: boolean;
  isAlreadyCertifiedProject?: boolean;
  isDisabled?: boolean;
  isLightVersion?: boolean;
};

export default function HdsOption({
  isChecked,
  isDisabled = false,
  onCheckChanged,
  isValidForCertification,
  isAlreadyCertifiedProject = false,
  isLightVersion = false,
}: HdsOptionProps) {
  const { t } = useTranslation('hds');

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const hdsInfoLink = getHdsInfoUrl(ovhSubsidiary as OvhSubsidiary);

  const isHdsDisabled =
    isAlreadyCertifiedProject || !isValidForCertification || isDisabled;

  const renderHdsLink = () => (
    <OdsLink
      icon="external-link"
      target="_blank"
      className={isLightVersion ? 'ml-8' : undefined}
      href={hdsInfoLink}
      label={t('pci_projects_hds_description_link')}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      {!isLightVersion && (
        <>
          <OdsText preset="paragraph">
            {t('pci_projects_project_edit_hds_description')}
          </OdsText>

          {renderHdsLink()}
        </>
      )}

      <OdsFormField className="flex flex-row items-center">
        <OdsCheckbox
          name="isHds"
          inputId="is-hds"
          isChecked={isChecked}
          isDisabled={isHdsDisabled}
          onOdsChange={(event) => onCheckChanged(event.detail.checked)}
          data-testid="hds-checkbox"
        />
        <label className="ml-4 cursor-pointer" htmlFor="is-hds">
          <OdsText preset="paragraph">
            {t('pci_projects_hds_description')}
          </OdsText>
        </label>
      </OdsFormField>

      {isLightVersion && renderHdsLink()}
    </div>
  );
}
