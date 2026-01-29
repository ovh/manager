import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsCard,
  OdsButton,
  OdsModal,
  OdsInput,
  OdsSelect,
  OdsMessage,
} from '@ovhcloud/ods-react';
import {
  useTerminateService,
  useChangeContact,
  useSubscribeCommitment,
} from '@/api/hooks/useService';

type TServiceManagementProps = {
  serviceName: string;
};

export const ServiceManagement = ({ serviceName }: TServiceManagementProps) => {
  const { t } = useTranslation('vps');

  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);

  const [terminateReason, setTerminateReason] = useState('');
  const [contactType, setContactType] = useState<'admin' | 'tech' | 'billing'>('admin');
  const [newContact, setNewContact] = useState('');
  const [commitmentDuration, setCommitmentDuration] = useState<'12' | '24'>('12');

  const terminateMutation = useTerminateService();
  const changeContactMutation = useChangeContact();
  const commitmentMutation = useSubscribeCommitment();

  const handleTerminate = () => {
    terminateMutation.mutate(
      { serviceName, reason: terminateReason },
      {
        onSuccess: () => setShowTerminateModal(false),
      },
    );
  };

  const handleChangeContact = () => {
    changeContactMutation.mutate(
      { serviceName, contactType, newContact },
      {
        onSuccess: () => {
          setShowContactModal(false);
          setNewContact('');
        },
      },
    );
  };

  const handleCommitment = () => {
    commitmentMutation.mutate(
      { serviceName, duration: commitmentDuration },
      {
        onSuccess: () => setShowCommitmentModal(false),
      },
    );
  };

  return (
    <>
      <OdsCard className="p-6">
        <OdsText preset="heading-4" className="mb-4">
          Service Management
        </OdsText>

        <div className="flex flex-wrap gap-3">
          <OdsButton
            variant="outline"
            label="Change Contact"
            onClick={() => setShowContactModal(true)}
          />
          <OdsButton
            variant="outline"
            label="Commitment"
            onClick={() => setShowCommitmentModal(true)}
          />
          <OdsButton
            variant="outline"
            color="critical"
            label="Terminate"
            onClick={() => setShowTerminateModal(true)}
          />
        </div>
      </OdsCard>

      {showTerminateModal && (
        <OdsModal isOpen onOdsClose={() => setShowTerminateModal(false)}>
          <OdsText slot="heading" preset="heading-4">
            Terminate Service
          </OdsText>

          <div className="space-y-4 p-4">
            <OdsMessage color="critical">
              Warning: This action will terminate your VPS service. This cannot
              be undone.
            </OdsMessage>

            <div>
              <OdsText preset="label" className="mb-2">
                Reason (optional)
              </OdsText>
              <OdsInput
                type="text"
                name="terminateReason"
                value={terminateReason}
                onOdsChange={(e) => setTerminateReason(e.detail.value as string)}
              />
            </div>
          </div>

          <div slot="actions" className="flex gap-2">
            <OdsButton
              variant="ghost"
              label={t('common_cancel')}
              onClick={() => setShowTerminateModal(false)}
            />
            <OdsButton
              variant="default"
              color="critical"
              label="Terminate"
              onClick={handleTerminate}
              isLoading={terminateMutation.isPending}
            />
          </div>
        </OdsModal>
      )}

      {showContactModal && (
        <OdsModal isOpen onOdsClose={() => setShowContactModal(false)}>
          <OdsText slot="heading" preset="heading-4">
            Change Contact
          </OdsText>

          <div className="space-y-4 p-4">
            <div>
              <OdsText preset="label" className="mb-2">
                Contact Type
              </OdsText>
              <OdsSelect
                name="contactType"
                value={contactType}
                onOdsChange={(e) =>
                  setContactType(e.detail.value as 'admin' | 'tech' | 'billing')
                }
              >
                <option value="admin">Admin</option>
                <option value="tech">Tech</option>
                <option value="billing">Billing</option>
              </OdsSelect>
            </div>

            <div>
              <OdsText preset="label" className="mb-2">
                New Contact NIC
              </OdsText>
              <OdsInput
                type="text"
                name="newContact"
                placeholder="xx123456-ovh"
                value={newContact}
                onOdsChange={(e) => setNewContact(e.detail.value as string)}
              />
            </div>
          </div>

          <div slot="actions" className="flex gap-2">
            <OdsButton
              variant="ghost"
              label={t('common_cancel')}
              onClick={() => setShowContactModal(false)}
            />
            <OdsButton
              variant="default"
              label={t('common_save')}
              onClick={handleChangeContact}
              isLoading={changeContactMutation.isPending}
              isDisabled={!newContact}
            />
          </div>
        </OdsModal>
      )}

      {showCommitmentModal && (
        <OdsModal isOpen onOdsClose={() => setShowCommitmentModal(false)}>
          <OdsText slot="heading" preset="heading-4">
            Subscribe Commitment
          </OdsText>

          <div className="space-y-4 p-4">
            <OdsText preset="paragraph">
              Commit to a longer contract period to receive discounts on your
              service.
            </OdsText>

            <div>
              <OdsText preset="label" className="mb-2">
                Commitment Duration
              </OdsText>
              <OdsSelect
                name="commitmentDuration"
                value={commitmentDuration}
                onOdsChange={(e) =>
                  setCommitmentDuration(e.detail.value as '12' | '24')
                }
              >
                <option value="12">12 months</option>
                <option value="24">24 months</option>
              </OdsSelect>
            </div>
          </div>

          <div slot="actions" className="flex gap-2">
            <OdsButton
              variant="ghost"
              label={t('common_cancel')}
              onClick={() => setShowCommitmentModal(false)}
            />
            <OdsButton
              variant="default"
              label="Subscribe"
              onClick={handleCommitment}
              isLoading={commitmentMutation.isPending}
            />
          </div>
        </OdsModal>
      )}
    </>
  );
};
