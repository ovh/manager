import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useMe, useNotifications } from '@ovh-ux/manager-react-components';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { Modal } from '@/components/Modal.component';
import { useGetIssueTypes } from '@/api/hooks/useIssuTypes';
import { ISSUE_TYPE_IDS, SUPPORT_TICKET_ID_URL, TRACK } from '@/constants';
import { createTicket } from '@/api/data/ticket';
import { createAndAssignCart } from '@/api/data/cart';
import { orderQuota } from '@/api/data/quota';
import { useGetServiceOptions } from '@/api/hooks/useServiceOptions';

export default function IncreaseQuotaPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { me } = useMe();
  const { addSuccess, addError } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => navigate('..');

  const { trackClick, trackPage } = useTracking();

  const type = location.pathname.includes('support') ? 'support' : 'credit';

  const { t, i18n } = useTranslation('quotas/increase');

  const { data: issueTypes } = useGetIssueTypes(i18n.language);

  const issueType = useMemo(() => {
    return issueTypes?.find(({ id }) => ISSUE_TYPE_IDS.includes(id));
  }, [issueTypes]);

  const { data: serviceOptions } = useGetServiceOptions(projectId);

  const inputLabel = useMemo(() => {
    if (type === 'support' && Array.isArray(issueTypes)) {
      const targetIssueType = issueTypes.find(({ id }) =>
        ISSUE_TYPE_IDS.includes(id),
      );

      if (targetIssueType) {
        return targetIssueType.fields.map(({ label }) => label).join('\n\n');
      }
    }
    return '';
  }, [issueTypes]);

  const on = {
    confirm: async (formData: string) => {
      if (type === 'support') {
        if (!issueType) {
          trackPage({
            name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`,
          });

          addError(
            t('pci_projects_project_quota_increase_error_message', {
              message: '',
            }),
          );
        } else {
          setIsLoading(true);
          trackClick({
            name: `${TRACK.BASE}::${TRACK.CONTACT_SUPPORT}::${TRACK.CONFIRM}`,
            type: 'action',
          });
          try {
            const { ticketId } = await createTicket({
              issueTypeId: issueType.id,
              serviceName: projectId,
              subject: issueType.label,
              body: `
${issueType.subject}

${inputLabel}

${formData}
        `,
            });
            trackPage({
              name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.SUCCESS}`,
            });
            addSuccess(
              <span
                dangerouslySetInnerHTML={{
                  __html: t(
                    'pci_projects_project_quota_increase_success_message',
                    {
                      ticketUrl:
                        SUPPORT_TICKET_ID_URL.replace('{ticketId}', ticketId) +
                        me.ovhSubsidiary,
                    },
                  ),
                }}
              ></span>,
            );
            goBack();
          } catch (e) {
            trackPage({
              name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`,
            });
            addError(
              t('pci_projects_project_quota_increase_error_message', {
                message: (e as { data: { message: string } }).data?.message,
              }),
            );
            goBack();
          } finally {
            setIsLoading(false);
          }
        }
      } else if (type === 'credit') {
        const planCode = formData || 'quota-no-plan';

        const serviceOption = serviceOptions.find(
          (s) => s.planCode === planCode,
        );

        if (!serviceOptions) {
          trackPage({
            name: `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.ERROR}::${planCode}`,
          });
          addError(
            t('pci_projects_project_quota_increase_error_message', {
              message: '',
            }),
          );
        } else {
          setIsLoading(true);
          trackClick({
            name: `${TRACK.BASE}::${TRACK.SELECT_PLAN}::${TRACK.CONFIRM}_${planCode}`,
            type: 'action',
          });
          try {
            const cartId = await createAndAssignCart(me.ovhSubsidiary);
            const { url } = await orderQuota(projectId, cartId, serviceOption);
            addSuccess(
              <span
                dangerouslySetInnerHTML={{
                  __html: t(
                    'pci_projects_project_quota_increase_buy_success_message',
                    {
                      billingUrl: url,
                    },
                  ),
                }}
              ></span>,
            );
            goBack();
          } catch (e) {
            trackPage({
              name: `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.SUCCESS}::${planCode}`,
            });
            addError(
              t('pci_projects_project_quota_increase_error_message', {
                message: (e as { data: { message: string } }).data?.message,
              }),
            );
            goBack();
          } finally {
            setIsLoading(false);
          }
        }
      }
    },
    close: () => {
      goBack();
    },
    cancel: () => {
      goBack();
    },
  };

  return (
    <Modal
      type={type}
      onConfirm={on.confirm}
      onClose={on.close}
      onCancel={on.cancel}
      isLoading={isLoading}
    ></Modal>
  );
}
