import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';

import { ManagerButton, Modal } from '@ovh-ux/manager-react-components';

import { useCreateNashaService, useNashaDatacenters } from '@/data/api/hooks/useNashaServices';
import type { NashaOrder } from '@/types/Nasha.type';

interface NashaCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NashaCreateModal({ isOpen, onClose }: NashaCreateModalProps) {
  const { t } = useTranslation('listing');
  const { data: datacentersData } = useNashaDatacenters();
  const createService = useCreateNashaService();

  const [formData, setFormData] = useState<NashaOrder>({
    datacenter: '',
    protocol: 'NFS',
    size: 100,
    customName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.datacenter) {
      newErrors.datacenter = t('errors.datacenterRequired');
    }

    if (!formData.protocol) {
      newErrors.protocol = t('errors.protocolRequired');
    }

    if (formData.size < 100) {
      newErrors.size = t('errors.sizeMinimum');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createService.mutateAsync(formData);
      onClose();
      setFormData({
        datacenter: '',
        protocol: 'NFS',
        size: 100,
        customName: '',
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      datacenter: '',
      protocol: 'NFS',
      size: 100,
      customName: '',
    });
    setErrors({});
  };

  return (
    <Modal
      heading={t('create_service')}
      type={ODS_MODAL_COLOR.information}
      isOpen={isOpen}
      onDismiss={handleClose}
      primaryLabel={t('create')}
      secondaryLabel={t('cancel')}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      isPrimaryButtonLoading={createService.isPending}
      isPrimaryButtonDisabled={createService.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('datacenter')}</label>
          <OdsSelect
            value={formData.datacenter}
            onValueChange={(value: any) => setFormData({ ...formData, datacenter: value })}
            placeholder={t('select_datacenter')}
          >
            {datacentersData?.datacenters.map((datacenter) => (
              <option key={datacenter} value={datacenter}>
                {datacenter}
              </option>
            ))}
          </OdsSelect>
          {errors.datacenter && <p className="text-sm text-red-600">{errors.datacenter}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('protocol')}</label>
          <OdsSelect
            value={formData.protocol}
            onValueChange={(value: any) =>
              setFormData({ ...formData, protocol: value as 'NFS' | 'CIFS' })
            }
          >
            <option value="NFS">NFS</option>
            <option value="CIFS">CIFS</option>
          </OdsSelect>
          {errors.protocol && <p className="text-sm text-red-600">{errors.protocol}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('size_gb')}</label>
          <OdsInput
            type="number"
            value={formData.size.toString()}
            onValueChange={(value: any) => setFormData({ ...formData, size: parseInt(value, 10) || 0 })}
            min="100"
            step="1"
            placeholder="100"
          />
          {errors.size && <p className="text-sm text-red-600">{errors.size}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('custom_name')} (optionnel)</label>
          <OdsInput
            value={formData.customName || ''}
            onValueChange={(value: any) => setFormData({ ...formData, customName: value })}
            placeholder={t('custom_name_placeholder')}
          />
        </div>

        <OdsText preset="caption" color="neutral-600">
          {t('create_service_info')}
        </OdsText>
      </div>
    </Modal>
  );
}
