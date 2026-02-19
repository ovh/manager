import {
  useGetDomainsListByExcludedResellerNicAdmin,
  useUpdateDomainsNicbilling,
} from '@/domain-reseller/hooks/data/query';
import type { DomainSettledResult } from '@/domain-reseller/hooks/data/query';
import { updateNicBillingAlreadyRunningMessage } from '@/domain-reseller/constants/constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  TEXT_PRESET,
  BUTTON_VARIANT,
  Meter,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import SelectAssociateDomains from './Select/SelectAssociateDomains';
import { useEffect, useMemo, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { updateContactEnumStatus } from '@/domain-reseller/enum/updateContactStatus.enum';

interface AssociateModalProps {
  isOpen: boolean;
  nicAdminReseller: string;
  onAssociateModalChange: (open: boolean) => void;
}

export default function AssociateModal({
  isOpen,
  nicAdminReseller,
  onAssociateModalChange,
}: AssociateModalProps) {
  const { t } = useTranslation(['domain-reseller', NAMESPACES.ACTIONS]);
  const {
    data,
    isLoading,
    isFetching,
  } = useGetDomainsListByExcludedResellerNicAdmin(nicAdminReseller);
  const { mutateAsync, isPending } = useUpdateDomainsNicbilling();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectKey, setSelectKey] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  /** Extracts the API error message from a rejected promise, falling back to the generic error message */
  const getErrorMessage = (rejected: PromiseRejectedResult): string =>
    rejected.reason?.response?.data?.message ?? rejected.reason?.message;

  /** Checks if the rejection is due to a contact change already in progress (pending email validation) */
  const isAlreadyRunning = (rejected: PromiseRejectedResult): boolean =>
    getErrorMessage(rejected) === updateNicBillingAlreadyRunningMessage;

  useEffect(() => {
    if (!isFetching) {
      setLoadingProgress(100);
      return;
    }

    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => (prev >= 90 ? 90 : prev + 5));
    }, 300);

    return () => clearInterval(interval);
  }, [isFetching]);

  /** Resets the form state without closing the modal or clearing notifications */
  const resetForm = () => {
    setSelectedDomains([]);
    setSelectKey((prev) => prev + 1);
  };

  /** Resets the form, clears all notifications and closes the modal (used for cancel / close actions) */
  const resetAndClose = () => {
    resetForm();
    clearNotifications();
    onAssociateModalChange(false);
  };

  const items = useMemo(
    () =>
      data?.map((d) => ({
        label: d.currentState.name,
        value: d.currentState.name,
      })) ?? [],
    [data],
  );

  /**
   * Processes mutation results and displays appropriate notifications:
   * - Groups "already running" rejections into a single success notification (pending email validation)
   * - Shows an error notification for each unexpected failure
   * - Shows a success notification if at least one domain was associated
   */
  const handleResults = (settledResults: DomainSettledResult[]) => {
    const rejected = settledResults.filter(
      (r) => r.result.status === updateContactEnumStatus.Rejected,
    ) as { result: PromiseRejectedResult; domain: string }[];

    const pendingValidation = rejected.filter((r) =>
      isAlreadyRunning(r.result),
    );
    const errors = rejected.filter((r) => !isAlreadyRunning(r.result));

    if (pendingValidation.length) {
      addSuccess(
        t('domain_reseller_associate_modal_associate_not_mail_validated', {
          count: pendingValidation.length,
          domain: pendingValidation[0]?.domain,
        }),
      );
    }

    errors.forEach(({ result, domain }) =>
      addError(
        t('domain_reseller_associate_modal_associate_error', {
          error: getErrorMessage(result),
          domain,
        }),
      ),
    );

    if (settledResults.some((r) => r.result.status === updateContactEnumStatus.Fulfilled)) {
      addSuccess(t('domain_reseller_associate_modal_associate_success'));
    }
  };

  /** Triggers the billing contact change for all selected domains in parallel, then handles results and closes the modal */
  const updateNicBilling = async () => {
    clearNotifications();

    const results = await mutateAsync({
      serviceNames: selectedDomains,
      nicBilling: nicAdminReseller,
    });

    handleResults(results);
    resetForm();
    onAssociateModalChange(false);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(detail) => {
        if (!detail.open) {
          resetAndClose();
        }
      }}
      closeOnInteractOutside={false}
    >
      <ModalContent>
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading4}>
            {t('domain_reseller_associate_modal_title')}
          </Text>
        </ModalHeader>
        {isLoading || isFetching ? (
          <div className="flex flex-col items-center gap-y-6 my-12 px-6">
            <Meter value={loadingProgress} />
            <Text className="text-center" preset={TEXT_PRESET.paragraph}>
              {t('domain_reseller_associate_modal_loading')}
            </Text>
          </div>
        ) : (
          <ModalBody className="flex flex-col gap-y-6">
            <SelectAssociateDomains
              key={selectKey}
              items={items}
              selectedDomains={selectedDomains}
              onSelectionChange={setSelectedDomains}
            />
            <Text preset={TEXT_PRESET.paragraph}>
              {t('domain_reseller_associate_modal_description')}
            </Text>
            <div className="flex items-center justify-end gap-x-4">
              <Button variant={BUTTON_VARIANT.ghost} onClick={resetAndClose}>
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              <Button
                onClick={updateNicBilling}
                disabled={selectedDomains.length === 0 || isPending}
                loading={isPending}
              >
                {t('domain_reseller_associate')}
              </Button>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
