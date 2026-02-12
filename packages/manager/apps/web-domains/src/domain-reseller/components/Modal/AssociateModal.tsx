import {
  useGetDomainsListByExcludedNicBilling,
  useUpdateDomainNicbilling,
} from '@/domain-reseller/hooks/data/query';
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
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/muk';

interface AssociateModalProps {
  isOpen: boolean;
  nicAdmin: string;
  onAssociateModalChange: (open: boolean) => void;
}

export default function AssociateModal({
  isOpen,
  nicAdmin,
  onAssociateModalChange,
}: AssociateModalProps) {
  const { t } = useTranslation(['domain-reseller', NAMESPACES.ACTIONS]);
  const { data, isLoading, isFetching } = useGetDomainsListByExcludedNicBilling(
    nicAdmin,
  );
  const { mutateAsync, isPending } = useUpdateDomainNicbilling();
  const { addError, addSuccess } = useNotifications();
  const queryClient = useQueryClient();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectKey, setSelectKey] = useState(0);

  const [loadingProgress, setLoadingProgress] = useState(0);

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

  const resetAndClose = () => {
    setSelectedDomains([]);
    setSelectKey((prev) => prev + 1);
    onAssociateModalChange(false);
  };

  const items = useMemo(() => {
    return data?.map((d) => ({
      label: d.currentState.name,
      value: d.currentState.name,
    }));
  }, [data]);

  const updateNicbilling = async () => {
    const results = await Promise.allSettled(
      selectedDomains.map((serviceName) =>
        mutateAsync({ serviceName, nicBilling: nicAdmin }),
      ),
    );

    handleResults(results);
    invalidateDomainsQueries();
    resetAndClose();
  };

  const handleResults = (results: PromiseSettledResult<void>[]) => {
    if (results.some((r) => r.status === 'rejected')) {
      addError(t('domain_reseller_associate_modal_associate_error'));
    }
    if (results.some((r) => r.status === 'fulfilled')) {
      addSuccess(t('domain_reseller_associate_modal_associate_success'));
    }
  };

  const invalidateDomainsQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['domainsByNicBilling'] });
    queryClient.invalidateQueries({ queryKey: ['domainsExcludedNicBilling'] });
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
        {isLoading ? (
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
                onClick={updateNicbilling}
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
