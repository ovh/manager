import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Text, Checkbox } from '@ovhcloud/ods-react';
import type { TRebuildFormValues } from '../schema/rebuild.schema';

export const RebuildOptions = () => {
  const { t } = useTranslation('vps');
  const { setValue, watch } = useFormContext<TRebuildFormValues>();

  const sshKey = watch('sshKey');
  const doNotSendPassword = watch('doNotSendPassword');
  const installRTM = watch('installRTM');

  const hasSshKey = sshKey === 'manual';

  return (
    <div className="space-y-4">
      <Text preset="paragraph" className="text-gray-600">
        {t('vps_rebuild_step_options_description')}
      </Text>

      <div className="space-y-3">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
            !hasSshKey ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-300'
          }`}
        >
          <Checkbox
            isChecked={doNotSendPassword}
            isDisabled={!hasSshKey}
            onChange={(e) =>
              setValue('doNotSendPassword', e.detail.checked, {
                shouldValidate: true,
              })
            }
          />
          <div>
            <Text preset="paragraph" className="font-medium">
              {t('vps_rebuild_option_no_password')}
            </Text>
            {!hasSshKey && (
              <Text preset="caption" className="text-gray-500">
                {t('vps_rebuild_option_no_password_warning')}
              </Text>
            )}
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:border-gray-300">
          <Checkbox
            isChecked={installRTM}
            onChange={(e) =>
              setValue('installRTM', e.detail.checked, { shouldValidate: true })
            }
          />
          <div>
            <Text preset="paragraph" className="font-medium">
              {t('vps_rebuild_option_rtm')}
            </Text>
          </div>
        </label>
      </div>
    </div>
  );
};
