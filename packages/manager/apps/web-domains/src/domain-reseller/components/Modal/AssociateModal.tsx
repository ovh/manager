import {
  useGetDomainsListByExcludedNicBilling,
  useUpdateDomainNicbilling,
} from '@/domain-reseller/hooks/data/query';
import Loading from '@/domain/components/Loading/Loading';
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
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import SelectAssociateDomains from './Select/SelectAssociateDomains';
import { useMemo, useState } from 'react';
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
  const { data } = useGetDomainsListByExcludedNicBilling(nicAdmin);
  const { mutate, isPending } = useUpdateDomainNicbilling();
  const { addError, addSuccess } = useNotifications();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectKey, setSelectKey] = useState(0);
  const queryClient = useQueryClient();

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

  const updateNicbilling = () => {
    selectedDomains.forEach((serviceName) => {
      mutate(
        {
          serviceName,
          //We inject the domain reseller nic admin into domain service nic billing
          nicBilling: nicAdmin,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            addSuccess(t('domain_reseller_associate_modal_associate_success'));
          },
          onError: (e: Error) => {
            addError(t('domain_reseller_associate_modal_associate_error'));
          },
          onSettled: () => {
            resetAndClose();
          },
        },
      );
    });
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
      </ModalContent>
    </Modal>
  );
}
