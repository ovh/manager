import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Modal } from '@ovh-ux/muk';
import { Button, FormField, FormFieldError, FormFieldHelper, FormFieldLabel, Input } from '@ovh-ux/muk';

import { putJSON } from '@/data/api/Client.api';
import type { Nasha } from '@/types/Dashboard.type';

const NAME_PATTERN = /^[^<>]+$/;

type EditNameModalProps = {
  nasha: Nasha;
  nashaApiUrl: string;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (error: unknown) => void;
};

export function EditNameModal({
  nasha,
  nashaApiUrl,
  onClose,
  onSuccess,
  onError,
}: EditNameModalProps) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const [customName, setCustomName] = useState(nasha.customName || '');
  const [error, setError] = useState<string>('');

  const { mutate: updateName, isPending } = useMutation({
    mutationFn: async (name: string) => {
      return putJSON('v6', nashaApiUrl, { customName: name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha', 'data', nasha.serviceName] });
      const successMessage = t('edit_name.success');
      onSuccess?.(successMessage);
      onClose();
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation: pattern
    if (!NAME_PATTERN.test(customName)) {
      setError(t('edit_name.forbid'));
      return;
    }

    // Validation: forbid same as serviceName
    if (customName === nasha.serviceName) {
      setError(t('edit_name.forbid', { name: nasha.serviceName }));
      return;
    }

    updateName(customName);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      heading={t('edit_name.title', { name: nasha.serviceName })}
    >
      <form onSubmit={handleSubmit}>
        <FormField error={error}>
          <FormFieldLabel>
            {t('edit_name.label', { name: nasha.serviceName })}
          </FormFieldLabel>
          <Input
            type="text"
            id="customName"
            name="customName"
            value={customName}
            onChange={(e) => {
              setCustomName(e.target.value);
              setError('');
            }}
            required
            disabled={isPending}
          />
          <FormFieldHelper>
            {t('edit_name.rules')}
          </FormFieldHelper>
          {error && (
            <FormFieldError>
              {error}
            </FormFieldError>
          )}
        </FormField>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t('edit_name.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
          >
            {t('edit_name.confirm')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

