import React, { useEffect, useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsSelect,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  changeIpOrganisation,
  getIpDetailsQueryKey,
  getIpRipeInformationQueryKey,
  upsertIpRipeInformation,
} from '@/data/api';
import {
  useGetIpOrganisation,
  useGetIpRipeInformation,
  useGetOrganisationsList,
} from '@/data/hooks';
import { TRANSLATION_NAMESPACES, fromIdToIp, ipFormatter } from '@/utils';

export default function UpsertIpBlockInformation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { ipGroup: ip } = ipFormatter(fromIdToIp(id));
  const { ipRipeInfo, isLoading: isRipeLoading } = useGetIpRipeInformation({
    ip,
  });
  const { organisations, isLoading: isOrgLoading } = useGetOrganisationsList();
  const {
    organisationId,
    rirForOrganisation,
    hasOnGoingChangeRipeOrgTask,
    isLoading: isOrganisationIdLoading,
  } = useGetIpOrganisation({ ip });
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { t } = useTranslation([TRANSLATION_NAMESPACES.ipBlockInformation]);
  const [netname, setNetname] = React.useState(ipRipeInfo?.netname || '');
  const [description, setDescription] = React.useState(
    ipRipeInfo?.description || '',
  );
  const [organisation, setOrganisation] = React.useState(organisationId || '');

  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['edit_ip-block-information', 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  };

  const { mutate: upsertRipe, isPending: isRipePending } = useMutation({
    mutationFn: () => upsertIpRipeInformation({ ip, description, netname }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getIpRipeInformationQueryKey({ ip }),
      });
      addSuccess(t('ipBlockInformationUpdateSuccessMessage', { ip }));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'edit_ip-block-information_success',
      });
    },
    onError: (error: ApiError) => {
      addError(t('ipBlockInformationUpdateErrorMessage', { ip, error }));
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'edit_ip-block-information_error',
      });
    },
  });

  const { mutate: changeOrganisation, isPending: isOrgPending } = useMutation({
    mutationFn: () => changeIpOrganisation({ ip, organisation }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getIpDetailsQueryKey({ ip }),
      });
      addSuccess(
        t('ipBlockInformationOrgUpdateSuccessMessage', { ip, organisation }),
      );
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'edit_ip-block-information_organization_success',
      });
    },
    onError: (error: ApiError) => {
      addError(
        t('ipBlockInformationOrgUpdateErrorMessage', {
          ip,
          organisation,
          error,
        }),
      );
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'edit_ip-block-information_organization_error',
      });
    },
  });

  const handleSubmit = () => {
    const hasRipeChanges =
      netname !== ipRipeInfo?.netname ||
      description !== ipRipeInfo?.description;
    const hasOrgChanges = organisation !== organisationId;

    if (hasRipeChanges || hasOrgChanges) {
      clearNotifications();
    }

    if (hasRipeChanges) upsertRipe();
    if (hasOrgChanges && !hasOnGoingChangeRipeOrgTask) changeOrganisation();

    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['edit_ip-block-information', 'confirm'],
    });

    closeModal();
  };

  useEffect(() => {
    setNetname(ipRipeInfo?.netname || '');
    setDescription(ipRipeInfo?.description || '');
    setOrganisation(organisationId || '');
  }, [ipRipeInfo, organisationId]);

  const availableOrganisations = useMemo(() => {
    if (rirForOrganisation === 'ARIN') {
      return (
        organisations?.filter(
          (orgId: string): boolean =>
            orgId?.toLowerCase().startsWith('arin_') ?? false,
        ) ?? []
      );
    }
    if (rirForOrganisation === 'RIPE') {
      return (
        organisations?.filter(
          (orgId: string): boolean =>
            orgId?.toLowerCase().startsWith('ripe_') ?? false,
        ) ?? []
      );
    }
    return organisations;
  }, [organisations, rirForOrganisation]);

  return (
    <Modal
      isOpen
      isLoading={isRipeLoading || isOrgLoading || isOrganisationIdLoading}
      onDismiss={closeModal}
      heading={t('ipBlockInformationTitle')}
      isPrimaryButtonLoading={isRipePending || isOrgPending}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={handleSubmit}
      primaryButtonTestId="confirm-button"
      onSecondaryButtonClick={closeModal}
      secondaryButtonTestId="cancel-button"
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
    >
      <div className="space-y-3">
        <div>
          <OdsText preset="caption" className="mb-2">
            {t('ipBlockInformationSubtitle')}
          </OdsText>
        </div>

        <div>
          <OdsFormField className="w-full">
            <label slot="label">{t('ipBlockInformationNetNameLabel')}</label>
            <OdsInput
              name="netname"
              value={netname}
              onOdsChange={(e) => setNetname(e.detail.value as string)}
              isDisabled={isRipePending}
            />
          </OdsFormField>
        </div>

        <div>
          <OdsFormField className="w-full">
            <label slot="label">
              {t('ipBlockInformationDescriptionLabel')}
            </label>
            <OdsTextarea
              name="description"
              value={description}
              rows={4}
              onOdsChange={(e) => setDescription(e.detail.value)}
              isDisabled={isRipePending}
            />
          </OdsFormField>
        </div>

        <div>
          <OdsFormField className="w-full">
            <label slot="label">
              {t('ipBlockInformationOrganisationLabel')}
            </label>
            {hasOnGoingChangeRipeOrgTask ? (
              <OdsMessage
                isDismissible={false}
                color={ODS_MESSAGE_COLOR.information}
              >
                {t('ipBlockInformationOrganisationOnGoingChange')}
              </OdsMessage>
            ) : (
              <OdsSelect
                name="organisation"
                value={organisation}
                onOdsChange={(e) => setOrganisation(e.detail.value || '')}
                isDisabled={isOrgPending}
              >
                {availableOrganisations?.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </OdsSelect>
            )}
          </OdsFormField>
        </div>
      </div>
    </Modal>
  );
}
