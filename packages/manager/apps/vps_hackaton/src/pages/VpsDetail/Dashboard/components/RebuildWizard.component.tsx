import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Text, Button, Stepper, Step } from '@ovhcloud/ods-react';
import { useRebuildVps } from '@/api/hooks/useVpsActions';
import {
  rebuildSchema,
  defaultRebuildValues,
  type TRebuildFormValues,
} from '../schema/rebuild.schema';
import { ImageSelector } from './ImageSelector.component';
import { SshKeySelector } from './SshKeySelector.component';
import { RebuildOptions } from './RebuildOptions.component';
import { RebuildConfirmation } from './RebuildConfirmation.component';

type TRebuildWizardProps = {
  serviceName: string;
  onClose: () => void;
};

const STEPS = ['image', 'ssh', 'options', 'confirm'] as const;
type TStep = (typeof STEPS)[number];

export const RebuildWizard = ({ serviceName, onClose }: TRebuildWizardProps) => {
  const { t } = useTranslation('vps');
  const [currentStep, setCurrentStep] = useState<TStep>('image');

  const formMethods = useForm<TRebuildFormValues>({
    resolver: zodResolver(rebuildSchema),
    defaultValues: defaultRebuildValues,
    mode: 'onChange',
  });

  const rebuildMutation = useRebuildVps();

  const currentStepIndex = STEPS.indexOf(currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSubmit = formMethods.handleSubmit((data) => {
    rebuildMutation.mutate(
      {
        serviceName,
        imageId: data.imageId,
        sshKey: data.sshKey === 'manual' ? data.publicSshKey : undefined,
        doNotSendPassword: data.doNotSendPassword,
        installRTM: data.installRTM,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  });

  const canProceedFromImage = !!formMethods.watch('imageId');
  const canProceedFromConfirm = formMethods.watch('confirmed');

  const stepLabels: Record<TStep, { title: string; description: string }> = {
    image: {
      title: t('vps_rebuild_step_image'),
      description: t('vps_rebuild_step_image_description'),
    },
    ssh: {
      title: t('vps_rebuild_step_ssh'),
      description: t('vps_rebuild_step_ssh_description'),
    },
    options: {
      title: t('vps_rebuild_step_options'),
      description: t('vps_rebuild_step_options_description'),
    },
    confirm: {
      title: t('vps_rebuild_step_confirm'),
      description: t('vps_rebuild_step_confirm_description'),
    },
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-2xl">
      <Text slot="heading" preset="heading-4">
        {t('vps_rebuild_title')}
      </Text>

      <div className="p-4">
        <Stepper className="mb-6">
          {STEPS.map((step, index) => (
            <Step
              key={step}
              isActive={currentStep === step}
              isComplete={index < currentStepIndex}
            >
              {stepLabels[step].title}
            </Step>
          ))}
        </Stepper>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit}>
            {currentStep === 'image' && (
              <ImageSelector serviceName={serviceName} />
            )}
            {currentStep === 'ssh' && <SshKeySelector />}
            {currentStep === 'options' && <RebuildOptions />}
            {currentStep === 'confirm' && <RebuildConfirmation />}
          </form>
        </FormProvider>
      </div>

      <div slot="actions" className="flex justify-between gap-2">
        <div>
          <Button
            variant="ghost"
            label={t('vps_rebuild_cancel')}
            onClick={onClose}
          />
        </div>
        <div className="flex gap-2">
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              label={t('vps_rebuild_previous')}
              onClick={handlePrevious}
            />
          )}
          {currentStep !== 'confirm' ? (
            <Button
              variant="default"
              label={t('vps_rebuild_next')}
              onClick={handleNext}
              isDisabled={currentStep === 'image' && !canProceedFromImage}
            />
          ) : (
            <Button
              variant="default"
              color="critical"
              label={t('vps_rebuild_submit')}
              onClick={handleSubmit}
              isDisabled={!canProceedFromConfirm}
              isLoading={rebuildMutation.isPending}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
