import { useState } from 'react';

import { Location, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  Input,
  MESSAGE_COLOR,
  Message,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { usePutWebHostingWebsite } from '@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite';

interface EditSiteState {
  siteId?: string;
  siteName?: string;
  path?: string;
}

const isPathAlreadyUsed = (message?: string) => {
  const apiMessage = (message ?? '').toLowerCase();
  return apiMessage.includes('path') && apiMessage.includes('already used');
};

export default function EditSiteModal() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { state } = useLocation() as Location<EditSiteState>;
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ACTIONS]);
  const { addSuccess } = useNotifications();

  const siteId = state?.siteId;
  const siteName = state?.siteName ?? '';
  const currentPath = state?.path ?? '';

  const [path, setPath] = useState(currentPath);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onClose = () => {
    navigate(-1);
  };

  const { putWebHostingWebsite: editSite, isPending } = usePutWebHostingWebsite(
    serviceName,
    () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite:multisite_edit_site_modal_success')}
        </Text>,
        true,
      );
      onClose();
    },
    (error: ApiError) => {
      setErrorMessage(
        isPathAlreadyUsed(error?.response?.data?.message)
          ? t('multisite:multisite_edit_site_modal_error_path_already_used')
          : t('multisite:multisite_edit_site_modal_error_generic'),
      );
    },
  );

  const trimmedPath = path.trim();
  const hasChanged = trimmedPath !== currentPath;
  const isValid = trimmedPath.length > 0;

  return (
    <Modal
      heading={t('common:edit_site')}
      onOpenChange={() => !isPending && onClose()}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: () => {
          setErrorMessage(null);
          editSite({ websiteId: siteId, name: siteName, path: trimmedPath });
        },
        disabled: !hasChanged || !isValid || isPending,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
        disabled: isPending,
      }}
    >
      <div className="flex flex-col space-y-4">
        {isPending && (
          <Message color={MESSAGE_COLOR.information} dismissible={false}>
            {t('multisite:multisite_edit_site_modal_loading')}
          </Message>
        )}

        {!isPending && errorMessage && (
          <Message color={MESSAGE_COLOR.critical} dismissible={false}>
            {errorMessage}
          </Message>
        )}

        <FormField className="w-full">
          <FormFieldLabel>
            {t('multisite:multisite_edit_site_modal_site_name_label')}
          </FormFieldLabel>
          <Input name="siteName" type="text" value={siteName} readOnly disabled />
        </FormField>

        <FormField className="w-full">
          <FormFieldLabel>{t('multisite:multisite_edit_site_modal_path_label')}</FormFieldLabel>
          <div className="flex flex-row items-center space-x-2">
            <Text preset={TEXT_PRESET.paragraph}>./</Text>
            <Input
              name="path"
              type="text"
              className="w-full"
              value={path}
              disabled={isPending}
              onChange={(event) => setPath(event.target.value)}
            />
          </div>
        </FormField>
      </div>
    </Modal>
  );
}
