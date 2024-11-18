import { z } from 'zod';
import clsx from 'clsx';
import { Button, Textarea } from '@datatr-ux/uxlib';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Links,
  LinkType,
  Notifications,
  Title,
  useMe,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, Translation, useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';

import { FC, useMemo, useState } from 'react';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { TCreateTicketResponse } from '@/api/data/ticket';
import {
  useGetIssueTypes,
  useMutationCreateTicket,
} from '@/api/hooks/useIssueTypes';
import {
  SUPPORT_ISSUE_TYPE_IDS,
  SUPPORT_TICKET_ID_URL,
  TRACK,
} from '@/constants';

const MIN_CHARACTERS = 20;
const IncreaseQuotaForm = ({
  fields,
  onSubmit,
  isPending,
}: {
  fields: { id: number; label: string; isRequired: boolean }[];
  goBackHref: string;
  onSubmit: (data: { [id: number]: string }) => void;
  isPending: boolean;
}) => {
  const { t } = useTranslation('quotas/increase');
  const object = {};

  useMemo(() => {
    fields.forEach((field) => {
      object[field.id] = field.isRequired
        ? z.string().min(
            MIN_CHARACTERS,
            t('pci_projects_project_quota_increase_error_message_min', {
              min: MIN_CHARACTERS,
            }),
          )
        : z.string().optional();
    });
  }, [fields]);

  const schema = z.object(object);
  const defaultValues = useMemo(
    () =>
      fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = '';
        return acc;
      }, {}),
    [fields],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues,
  });

  const onSubmitButton = (data: { [id: number]: string }) => onSubmit(data);
  const backHref = useHref('../quota');

  const isButtonDisabled = !isValid || isPending;

  return (
    <form onSubmit={handleSubmit(onSubmitButton)} className="my-3">
      {fields.map((field) => (
        <div key={field.label}>
          <p>{field.label}</p>
          <Controller
            name={field.id.toString()}
            control={control}
            render={({ field: f }) => (
              <div className="mt-3 mb-10">
                <Textarea
                  className={clsx(
                    'leading-5 tracking-wide font-sans font-normal text-base text-customColor min-h-8 m-0 py-1 px-1 border border-customColor rounded-t-sm shadow-none outline-none bg-white',
                    errors[f.name] ? 'border-destructive' : '',
                  )}
                  {...register(f.name)}
                  name={f.name}
                  rows={3}
                />
                <div className="mt-3">
                  {!!errors[field.id] && (
                    <p className="text-destructive text-s">
                      {errors[field.id].message}
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      ))}
      <div className="flex flex-row gap-4">
        <Button
          mode="outline"
          variant="neutral"
          label={t('pci_projects_project_quota_increase_cancel_label')}
          className="mt-4"
          type="reset"
        >
          <a href={backHref}>
            {t('pci_projects_project_quota_increase_cancel_label')}
          </a>
        </Button>
        <Button className="mt-4" disabled={isButtonDisabled} type="submit">
          {t('pci_projects_project_quota_increase_submit_label')}
        </Button>
      </div>
    </form>
  );
};
const QuotaLink: FC<{ href: string; children?: string }> = ({
  href,
  children,
}) => {
  return (
    <Links
      color={ODS_LINK_COLOR.primary}
      label={children}
      href={href}
      target="_blank"
      type={LinkType.external}
    />
  );
};

const IncreaseQuotaSupport = () => {
  const [ticketCreated, setTicketCreated] = useState(false);
  const { t, i18n } = useTranslation('quotas/increase');

  const { projectId } = useParams();
  const { me } = useMe();
  const backHref = useHref('../quota');

  const { data: issueTypes } = useGetIssueTypes(i18n.language);
  const { trackClick, trackPage } = useTracking();
  const { addSuccess, addError } = useNotifications();

  const quotaQuestions = issueTypes?.find(({ id }) =>
    SUPPORT_ISSUE_TYPE_IDS.includes(id),
  );

  const { mutate: createTicket, isPending } = useMutationCreateTicket({
    onSuccess: (data: TCreateTicketResponse) => {
      setTicketCreated(true);
      const baseUrl = SUPPORT_TICKET_ID_URL.replace(
        '{ticketId}',
        data.ticketId,
      );
      const ticketUrl = `${baseUrl}${me.ovhSubsidiary}`;
      trackPage({
        name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.SUCCESS}`,
      });
      addSuccess(
        <Trans
          t={t}
          i18nKey="pci_projects_project_quota_increase_success_message"
          components={{
            Link: <QuotaLink href={ticketUrl} />,
          }}
        />,
      );
    },
    onError: () => {
      trackPage({
        name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`,
      });
      addError(
        <Translation ns="quotas/increase">
          {(_t) =>
            _t('pci_projects_project_quota_increase_error_message', {
              message: '',
            })
          }
        </Translation>,
      );
    },
  });

  const onClick = async (data: { [id: number]: string }) => {
    if (!issueTypes?.length) {
      trackPage({
        name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`,
      });

      addError(
        <Translation ns="quotas/increase">
          {() =>
            t('pci_projects_project_quota_increase_error_message', {
              message: '',
            })
          }
        </Translation>,
      );
    } else {
      trackClick({
        name: `${TRACK.BASE}::${TRACK.CONTACT_SUPPORT}::${TRACK.CONFIRM}`,
      });

      if (quotaQuestions?.fields.length) {
        const body = `
        ${quotaQuestions?.subject}
        ${quotaQuestions.fields
          .map(
            (field) => `
        ${field.label}
        ${data[field.id]}
        `,
          )
          .join(' ')}
      `;

        createTicket({
          issueTypeId: quotaQuestions.id,
          serviceName: projectId,
          subject: quotaQuestions?.label,
          body,
          urgency: 'medium',
        });
      }
    }
  };

  return (
    <div>
      <Title>{t('pci_projects_project_quota_increase_title')}</Title>
      <p className="my-4">
        {t('pci_projects_project_quota_increase_description')}
      </p>
      <Links
        type={LinkType.back}
        label={t('pci_projects_project_quota_increase_back_label')}
        href={backHref}
      />

      {ticketCreated ? (
        <>
          <Notifications />
          <div>
            <OdsText className="whitespace-pre-wrap">
              {t('pci_projects_project_quota_assistance_success')}
            </OdsText>
          </div>
        </>
      ) : (
        <>
          <div>
            <OdsMessage className="my-4" isDismissible={false}>
              {t('pci_projects_project_quota_increase_banner')}
            </OdsMessage>
          </div>
          {quotaQuestions && quotaQuestions.fields.length > 0 && (
            <IncreaseQuotaForm
              goBackHref={backHref}
              onSubmit={onClick}
              isPending={isPending}
              fields={quotaQuestions?.fields.map((f) => ({
                id: f.id,
                label: f.label,
                isRequired: f.mandatory,
              }))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default IncreaseQuotaSupport;
