import { Translation, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useMe, useNotifications } from '@ovh-ux/manager-react-components';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { Modal } from '@/components/Modal.component';
import { useGetIssueTypes } from '@/api/hooks/useIssuTypes';
import {
  SUPPORT_ISSUE_TYPE_IDS,
  SUPPORT_TICKET_ID_URL,
  TRACK,
} from '@/constants';
import { createTicket } from '@/api/data/ticket';
import { checkoutCart, createAndAssignCart } from '@/api/data/cart';
import { orderQuota } from '@/api/data/quota';
import { useGetFilteredServiceOptions } from '@/api/hooks/useServiceOptions';

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
    return issueTypes?.find(({ id }) => SUPPORT_ISSUE_TYPE_IDS.includes(id));
  }, [issueTypes]);

  const { data: serviceOptions } = useGetFilteredServiceOptions(projectId);

  // TODO duplicate
  const inputLabel = useMemo(() => {
    if (type === 'support' && Array.isArray(issueTypes)) {
      const targetIssueType = issueTypes.find(({ id }) =>
        SUPPORT_ISSUE_TYPE_IDS.includes(id),
      );

      if (targetIssueType) {
        return targetIssueType.fields.map(({ label }) => label).join('\n\n');
      }
    }
    return '';
  }, [issueTypes]);

  // TODO split and usecallback
  const on = {
    confirm: async (formData: string) => {
      if (type === 'support') {
        if (!issueType) {
          trackPage({
            name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`,
          });

          addError(
            <Translation ns="quotas/increase">
              {(_t) =>
                t('pci_projects_project_quota_increase_error_message', {
                  message: '',
                })
              }
            </Translation>,
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
              <Translation ns="quotas/increase">
                {(_t) => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: _t(
                        'pci_projects_project_quota_increase_success_message',
                        {
                          ticketUrl:
                            SUPPORT_TICKET_ID_URL.replace(
                              '{ticketId}',
                              ticketId,
                            ) + me.ovhSubsidiary,
                        },
                      ),
                    }}
                  ></span>
                )}
              </Translation>,
            );
            goBack();
          } catch (e) {
            trackPage({
              name: `${TRACK.BASE_CONTACT_SUPPORT_BANNER}::${TRACK.ERROR}`,
            });
            addError(
              <Translation ns="quotas/increase">
                {(_t) =>
                  _t('pci_projects_project_quota_increase_error_message', {
                    message: (e as { data: { message: string } }).data?.message,
                  })
                }
              </Translation>,
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
            <Translation ns="quotas/increase">
              {(_t) =>
                _t('pci_projects_project_quota_increase_error_message', {
                  message: '',
                })
              }
            </Translation>,
          );
        } else {
          setIsLoading(true);
          trackClick({
            name: `${TRACK.BASE}::${TRACK.SELECT_PLAN}::${TRACK.CONFIRM}_${planCode}`,
            type: 'action',
          });
          try {
            const cartId = await createAndAssignCart(me.ovhSubsidiary);
            const targetInstallationPrice = serviceOption.prices?.find(
              (price) => price.capacities.includes('installation'),
            );
            await orderQuota(
              projectId,
              cartId,
              serviceOption.planCode,
              targetInstallationPrice.duration,
              targetInstallationPrice.pricingMode,
            );
            const { url } = await checkoutCart(cartId);
            addSuccess(
              <Translation ns="quotas/increase">
                {(_t) => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: _t(
                        'pci_projects_project_quota_increase_buy_success_message',
                        {
                          billingUrl: url,
                        },
                      ),
                    }}
                  ></span>
                )}
              </Translation>,
            );
            goBack();
          } catch (e) {
            trackPage({
              name: `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.SUCCESS}::${planCode}`,
            });
            addError(
              <Translation ns="quotas/increase">
                {(_t) =>
                  _t('pci_projects_project_quota_increase_error_message', {
                    message: (e as { data: { message: string } }).data?.message,
                  })
                }
              </Translation>,
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
