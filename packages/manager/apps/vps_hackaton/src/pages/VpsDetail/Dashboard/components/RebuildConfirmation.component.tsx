import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Text, Checkbox, Message } from '@ovhcloud/ods-react';
import type { TRebuildFormValues } from '../schema/rebuild.schema';

export const RebuildConfirmation = () => {
  const { t } = useTranslation('vps');
  const { setValue, watch } = useFormContext<TRebuildFormValues>();

  const confirmed = watch('confirmed');
  const imageId = watch('imageId');
  const sshKey = watch('sshKey');
  const publicSshKey = watch('publicSshKey');

  return (
    <div className="space-y-6">
      <Message color="critical">
        <Text preset="paragraph" className="font-medium">
          {t('vps_rebuild_confirm_warning')}
        </Text>
      </Message>

      <div className="space-y-4 rounded-lg bg-gray-50 p-4">
        <Text preset="heading-5">{t('vps_rebuild_confirm_title')}</Text>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Text preset="paragraph" className="text-gray-600">
              {t('vps_rebuild_confirm_image')}
            </Text>
            <Text preset="paragraph" className="font-medium">
              {imageId}
            </Text>
          </div>

          <div className="flex justify-between">
            <Text preset="paragraph" className="text-gray-600">
              {t('vps_rebuild_confirm_ssh')}
            </Text>
            <Text preset="paragraph" className="font-medium">
              {sshKey === 'manual' && publicSshKey
                ? `${publicSshKey.substring(0, 30)}...`
                : t('vps_rebuild_ssh_none')}
            </Text>
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <Checkbox
          isChecked={confirmed}
          onChange={(e) =>
            setValue('confirmed', e.detail.checked, { shouldValidate: true })
          }
        />
        <Text preset="paragraph" className="font-medium text-red-700">
          {t('vps_rebuild_confirm_checkbox')}
        </Text>
      </label>
    </div>
  );
};
