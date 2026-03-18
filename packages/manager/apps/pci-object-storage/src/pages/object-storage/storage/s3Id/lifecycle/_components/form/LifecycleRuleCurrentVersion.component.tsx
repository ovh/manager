import { useTranslation } from 'react-i18next';
import { useLifecycleFormContext } from './LifecycleForm.context';
import { LifecycleRuleVersionOperations } from './LifecycleRuleVersionOperations.component';
import { CheckboxField } from './CheckboxField.component';

export const LifecycleRuleCurrentVersion = () => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const expiredObjectDeleteMarker = form.watch('expiredObjectDeleteMarker');

  return (
    <LifecycleRuleVersionOperations
      titleKey="formCurrentVersionTitle"
      descriptionKey="formCurrentVersionDescription"
      transition={{
        hasFieldName: 'hasCurrentVersionTransitions',
        transitionsFieldName: 'transitions',
        daysKey: 'days',
        checkboxId: 'has-transitions',
        checkboxLabelKey: 'formTransitionsLabel',
        checkboxDescriptionKey: 'formTransitionsDescription',
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
      <CheckboxField
        id="expired-delete-marker"
        label={t('formExpiredDeleteMarkerLabel')}
        checked={expiredObjectDeleteMarker}
        onCheckedChange={(checked) =>
          form.setValue('expiredObjectDeleteMarker', checked)
        }
        disabled={isPending}
        className="mt-4"
      />
    </LifecycleRuleVersionOperations>
  );
};
