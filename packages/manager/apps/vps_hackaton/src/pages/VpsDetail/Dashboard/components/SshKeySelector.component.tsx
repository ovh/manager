import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Text, Radio, Textarea } from '@ovhcloud/ods-react';
import type { TRebuildFormValues } from '../schema/rebuild.schema';

export const SshKeySelector = () => {
  const { t } = useTranslation('vps');
  const { setValue, watch, register } = useFormContext<TRebuildFormValues>();

  const sshKeyOption = watch('sshKey');

  const handleOptionChange = (value: 'none' | 'manual') => {
    setValue('sshKey', value, { shouldValidate: true });
    if (value === 'none') {
      setValue('publicSshKey', '', { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <Text preset="paragraph" className="text-gray-600">
        {t('vps_rebuild_step_ssh_description')}
      </Text>

      <div className="space-y-3">
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
            sshKeyOption === 'none'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Radio
            name="sshKey"
            value="none"
            isChecked={sshKeyOption === 'none'}
            onChange={() => handleOptionChange('none')}
          />
          <Text preset="paragraph">{t('vps_rebuild_ssh_none')}</Text>
        </label>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
            sshKeyOption === 'manual'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Radio
            name="sshKey"
            value="manual"
            isChecked={sshKeyOption === 'manual'}
            onChange={() => handleOptionChange('manual')}
          />
          <Text preset="paragraph">{t('vps_rebuild_ssh_manual')}</Text>
        </label>
      </div>

      {sshKeyOption === 'manual' && (
        <div className="mt-4">
          <Text preset="label" className="mb-2">
            {t('vps_rebuild_ssh_key_label')}
          </Text>
          <Textarea
            {...register('publicSshKey')}
            placeholder="ssh-rsa AAAA..."
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
