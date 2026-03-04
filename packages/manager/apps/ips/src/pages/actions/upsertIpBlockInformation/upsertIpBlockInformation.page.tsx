import React, { useEffect, useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  FormFieldLabel,
  MESSAGE_COLOR,
  MessageBody,
  SelectControl,
  FormField,
  Input,
  Message,
  Select,
  Text,
  Textarea,
  SelectContent,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';
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
  const { ipRipeInfo, loading: isRipeLoading } = useGetIpRipeInformation({
    ip,
  });
  const { organisations, loading: isOrgLoading } = useGetOrganisationsList();
  const {
    organisationId,
    rirForOrganisation,
    hasOnGoingChangeRipeOrgTask,
    loading: isOrganisationIdLoading,
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
      loading={isRipeLoading || isOrgLoading || isOrganisationIdLoading}
      onOpenChange={closeModal}
      heading={t('ipBlockInformationTitle')}
      primaryButton={{
        label: t('validate', { ns: NAMESPACES.ACTIONS }),
        onClick: handleSubmit,
        loading: isRipePending || isOrgPending,
        testId: 'confirm-button',
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: closeModal,
        testId: 'cancel-button',
      }}
    >
      <Text preset={TEXT_PRESET.paragraph} className="block mt-3 mb-2">
        {t('ipBlockInformationSubtitle')}
      </Text>

      <FormField className="w-full mb-4">
        <FormFieldLabel>{t('ipBlockInformationNetNameLabel')}</FormFieldLabel>
        <Input
          name="netname"
          value={netname}
          onChange={(e) => setNetname(e.target.value)}
          disabled={isRipePending}
          clearable
        />
      </FormField>

      <FormField className="w-full mb-4">
        <FormFieldLabel>
          {t('ipBlockInformationDescriptionLabel')}
        </FormFieldLabel>
        <Textarea
          name="description"
          value={description}
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isRipePending}
        />
      </FormField>

      <FormField className="w-full mb-4">
        <FormFieldLabel>
          {t('ipBlockInformationOrganisationLabel')}
        </FormFieldLabel>
        {hasOnGoingChangeRipeOrgTask ? (
          <Message dismissible={false} color={MESSAGE_COLOR.information}>
            <MessageBody>
              {t('ipBlockInformationOrganisationOnGoingChange')}
            </MessageBody>
          </Message>
        ) : (
          <Select
            name="organisation"
            value={[organisation]}
            onValueChange={(e) => setOrganisation(e.value?.[0] || '')}
            disabled={isOrgPending}
            items={availableOrganisations?.map((org) => ({
              label: org,
              value: org,
            }))}
          >
            <SelectContent />
            <SelectControl />
          </Select>
        )}
      </FormField>
    </Modal>
  );
}
