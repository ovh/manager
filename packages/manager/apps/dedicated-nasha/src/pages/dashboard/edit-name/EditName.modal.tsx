import React, { useState, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  MODAL_COLOR,
} from '@ovhcloud/ods-react';
import { useUpdateNasha } from '@/hooks/nasha';
import { urls } from '@/routes/Routes.constants';
import { PREFIX_TRACKING_EDIT_NAME } from '@/constants/nasha.constants';
import type { Nasha } from '@/types/nasha.type';

interface DashboardContext {
  nasha: Nasha;
  serviceName: string;
}

const NAME_PATTERN = /^[^<>]+$/;

export default function EditNameModal() {
  const { nasha, serviceName } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const { t } = useTranslation('components');
  const { shell } = useContext(ShellContext);

  const [customName, setCustomName] = useState(nasha.customName || '');
  const [error, setError] = useState<string | null>(null);

  const updateNasha = useUpdateNasha(serviceName);

  const handleClose = () => {
    navigate(urls.dashboard(serviceName));
  };

  const handleCancelClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_EDIT_NAME}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!NAME_PATTERN.test(name)) {
      setError(t('nasha_components_edit_name_rules'));
      return false;
    }
    if (name === nasha.customName) {
      setError(t('nasha_components_edit_name_forbid', { name: nasha.customName }));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(customName)) {
      return;
    }

    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_EDIT_NAME}::confirm`,
      type: 'action',
    });

    try {
      await updateNasha.mutateAsync({ customName });
      // Show success message via shell alerter or toast
      handleClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to update name');
    }
  };

  const isValid = customName.trim() && NAME_PATTERN.test(customName) && customName !== nasha.customName;

  return (
    <Modal open onOpenChange={(open) => !open && handleClose()}>
      <ModalContent color={MODAL_COLOR.primary}>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <h2 className="text-xl font-semibold mb-4">
              {t('nasha_components_edit_name_title', { name: nasha.serviceName })}
            </h2>

            <FormField className="mb-6">
              <FormFieldLabel>
                {t('nasha_components_edit_name_label', { name: nasha.serviceName })}
              </FormFieldLabel>
              <Input
                type="text"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  if (error) validateName(e.target.value);
                }}
                placeholder={nasha.serviceName}
                required
              />
              <FormFieldHelper>
                {t('nasha_components_edit_name_rules')}
              </FormFieldHelper>
              {error && <FormFieldError>{error}</FormFieldError>}
            </FormField>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.neutral}
                onClick={handleCancelClick}
                disabled={updateNasha.isPending}
              >
                {t('nasha_components_edit_name_secondary')}
              </Button>
              <Button
                type="submit"
                color={BUTTON_COLOR.primary}
                disabled={!isValid || updateNasha.isPending}
                loading={updateNasha.isPending}
              >
                {t('nasha_components_edit_name_primary')}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}

