import React, { useState } from 'react';
import { Modal } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsText,
  OdsFileUpload,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsFile } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';
import { isImportFormCompatible, readJsonFile } from '@/utils/importJson';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import {
  InstallationFormValues,
  StructuredInstallationForm,
} from '@/types/form.type';
import { formMappers } from '@/mappers/formMappers';
import { testIds } from '@/utils/testIds.constants';
import { WIZARD_SETTINGS } from './installationWizard.constants';

export default function InstallationWizard() {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'installation',
    NAMESPACES.ACTIONS,
    NAMESPACES.UPLOAD,
  ]);
  const [upload, setUpload] = useState<OdsFile | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [readError, setReadError] = useState<string>('');
  const [
    uploadedData,
    setUploadedData,
  ] = useState<InstallationFormValues | null>(null);
  const {
    setValues,
    setInitializationState,
    clearInitializationState,
  } = useInstallationFormContext();

  const closeModal = () => navigate(urls.dashboard);

  const readUploadedFile = async (file: File) => {
    setReadError('');
    setUploadedData(null);
    try {
      const data = await readJsonFile(file);
      const isFormCompatible = isImportFormCompatible(data);
      if (!isFormCompatible) throw new Error('File not compatible');

      const mapped = formMappers.toFlat(data as StructuredInstallationForm);
      setUploadedData(mapped);
    } catch (err) {
      setReadError(t('wizard_error_file'));
    }
  };

  const handleSubmit = () => {
    if (upload && !readError) {
      setValues(uploadedData);
      setInitializationState({
        isPrefilled: true,
        prefilledDeploymentType: uploadedData.deploymentType,
        hasChangedPrefilledDeploymentType: false,
      });
      navigate(urls.installationInitialStep);
      return;
    }
    clearInitializationState();
    navigate(urls.installationInitialStep);
  };

  return (
    <Modal
      isOpen
      heading={t('wizard_title')}
      primaryLabel={t('wizard_cta')}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onDismiss={closeModal}
      onSecondaryButtonClick={closeModal}
      onPrimaryButtonClick={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <OdsText>{t('wizard_subtitle')}</OdsText>
        {readError && (
          <OdsMessage color="critical" isDismissible={false}>
            {readError}
          </OdsMessage>
        )}
        <OdsFileUpload
          data-testid={testIds.formFileUpload}
          maxFile={WIZARD_SETTINGS.maxFile}
          accept={WIZARD_SETTINGS.accept}
          browseFileLabel={t(`${NAMESPACES.UPLOAD}:browse_files`)}
          dropzoneLabel={t(`${NAMESPACES.UPLOAD}:drag_and_drop_file`)}
          acceptedFileLabel={t(`${NAMESPACES.UPLOAD}:accepted_type`, {
            type: 'json',
          })}
          maxSize={WIZARD_SETTINGS.maxSize}
          maxSizeLabel={t(`${NAMESPACES.UPLOAD}:max_size`)}
          uploadSuccessLabel={t(`${NAMESPACES.UPLOAD}:uploaded_file`)}
          onOdsChange={async (e) => {
            const { files, noError } = e.detail;
            const file: OdsFile = files[0];
            file.isUploaded = true;

            setUpload(file);
            if (noError) setUploadError(null);
            await readUploadedFile(file);
          }}
          onOdsCancel={() => {
            setUpload(null);
            setReadError(null);
            setUploadError(null);
          }}
          onOdsRejected={(e) => setUploadError(e.detail.reason)}
          files={[upload].filter(Boolean)}
          error={
            uploadError && t(`${NAMESPACES.UPLOAD}:error_file_${uploadError}`)
          }
        />
        <OdsText>{t('wizard_content')}</OdsText>
      </div>
    </Modal>
  );
}
