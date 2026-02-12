import { useTranslation } from 'react-i18next';
import { Checkbox, Label } from '@datatr-ux/uxlib';
import { useLifecycleFormContext } from './LifecycleForm.context';
import { LifecycleRuleVersionOperations } from './LifecycleRuleVersionOperations.component';

export const LifecycleRuleCurrentVersion = () => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const expiredObjectDeleteMarker = form.watch('expiredObjectDeleteMarker');

  return (
    <LifecycleRuleVersionOperations
      titleKey="formCurrentVersionTitle"
      transition={{
        hasFieldName: 'hasCurrentVersionTransitions',
        transitionsFieldName: 'transitions',
        daysKey: 'days',
        checkboxId: 'has-transitions',
        checkboxLabelKey: 'formTransitionsLabel',
        daysLabelKey: 'formTransitionDaysLabel',
        addButtonLabelKey: 'formAddTransition',
      }}
      expiration={{
        hasFieldName: 'hasCurrentVersionExpiration',
        daysFieldName: 'expirationDays',
        checkboxId: 'has-expiration',
        checkboxLabelKey: 'formExpirationLabel',
        daysLabelKey: 'formExpirationDaysLabel',
      }}
    >
      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          id="expired-delete-marker"
          checked={expiredObjectDeleteMarker}
          onCheckedChange={(checked) =>
            form.setValue('expiredObjectDeleteMarker', checked === true)
          }
          disabled={isPending}
        />
        <Label
          htmlFor="expired-delete-marker"
          className="text-sm font-normal cursor-pointer"
        >
          {t('formExpiredDeleteMarkerLabel')}
        </Label>
      </div>
    </LifecycleRuleVersionOperations>
  );
};
