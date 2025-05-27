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

type Upload = {
  file: OdsFile | null;
  data: InstallationFormValues | null;
  uploadError: string;
  readError: string;
};

export default function InstallationWizard() {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'installation',
    NAMESPACES.ACTIONS,
    NAMESPACES.UPLOAD,
  ]);
  const [upload, setUpload] = useState<Upload | null>({
    file: null,
    data: null,
    uploadError: '',
    readError: '',
  });
  const { setValues, setInitializationState } = useInstallationFormContext();

  const closeModal = () => navigate(urls.dashboard);

  const readUploadedFile = async (file: File) => {
    try {
      const data = await readJsonFile(file);
      const isFormCompatible = isImportFormCompatible(data);
      if (!isFormCompatible) throw new Error('File not compatible');

      const mapped = formMappers.toFlat(data as StructuredInstallationForm);
      setUpload((prev) => ({ ...prev, data: mapped, readError: '' }));
    } catch (err) {
      setUpload((prev) => ({
        ...prev,
        data: null,
        readError: t('wizard_error_file'),
      }));
    }
  };

  const handleSubmit = () => {
    if (upload.file && !upload.readError) {
      setValues(upload.data);
      setInitializationState((prev) => ({
        ...prev,
        isPrefilled: true,
        prefilledData: {
          serviceName: upload.data.serviceName,
          datacenterId: upload.data.datacenterId,
          clusterName: upload.data.clusterName,
          deploymentType: upload.data.deploymentType,
          network: upload.data.network,
          thickDatastorePolicy: upload.data.thickDatastorePolicy,
          applicationServerOva: upload.data.applicationServerOva,
          applicationServerDatastore: upload.data.applicationServerDatastore,
          hanaServerOva: upload.data.hanaServerOva,
          hanaServerDatastore: upload.data.hanaServerDatastore,
        },
      }));
    }
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
        {upload.readError && (
          <OdsMessage color="critical" isDismissible={false}>
            {upload.readError}
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

            setUpload((prev) => ({
              ...prev,
              file,
              uploadError: noError ? '' : prev.uploadError,
            }));
            await readUploadedFile(file);
          }}
          onOdsCancel={() => {
            setUpload((prev) => ({
              ...prev,
              file: null,
              data: null,
              readError: '',
              uploadError: '',
            }));
          }}
          onOdsRejected={(e) => {
            setUpload((prev) => ({ ...prev, uploadError: e.detail.reason }));
          }}
          files={[upload.file].filter(Boolean)}
          error={
            upload.uploadError &&
            t(`${NAMESPACES.UPLOAD}:error_file_${upload.uploadError}`)
          }
        />
        <OdsText>{t('wizard_content')}</OdsText>
      </div>
    </Modal>
  );
}
