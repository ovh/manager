import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldLabel,
  useToast,
} from '@datatr-ux/uxlib';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useAddUserPolicy } from '@/data/hooks/user/useAddUserPolicy.hook';
import { readJsonFile } from '@/lib/fileReader';
import RouteModal from '@/components/route-modal/RouteModal';
import FileUploadPending from '@/components/file-input/FileUploadPending.component';
import { FileInput } from '@/components/file-input/FileInput.component';
import { FormField } from '@/components/form-field/FormField.component';

const ImportPolicyModal = () => {
  const { t } = useTranslation('pci-object-storage/users/import-policy');
  const { projectId, userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addUserPolicy, isPending } = useAddUserPolicy({
    onError: (err) => {
      toast.toast({
        title: t('userPolicyToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('userPolicySuccessTitle'),
        description: t('userPolicyToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const schema = z.object({
    policies: z
      .array(z.instanceof(File))
      .min(1, { message: t('errorFileRequired') })
      .max(1, { message: t('errorFileRequired') }),
  });

  type ValidationSchema = z.infer<typeof schema>;
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      policies: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (formValues) => {
    try {
      const policyJson = await readJsonFile(formValues.policies[0]);
      addUserPolicy({
        projectId,
        userId: Number(userId),
        policyData: { policy: JSON.stringify(policyJson) },
      });
    } catch (err) {
      toast.toast({
        title: t('userPolicyToastErrorTitle'),
        variant: 'critical',
        description: t('userPolicyJSONToastError'),
      });
    }
  });

  return (
    <RouteModal>
      <DialogContent className="sm:max-w-xl" variant="information">
        <DialogHeader>
          <DialogTitle data-testid="import-policy-modal">
            {t('addUserPolicyTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
            <p>{t('addUserPolicyDescription')}</p>
            {isPending ? (
              <FileUploadPending value={0} total={1} />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2"
                id="import-policy"
              >
                <FormField form={form} name="policies">
                  {(field) => (
                    <>
                      <FieldLabel>Policy</FieldLabel>
                      <FileInput
                        {...field}
                        data-testid="import-policy-file-input"
                      />
                    </>
                  )}
                </FormField>
              </form>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('fileUploaderButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="import-policy"
            data-testid="import-policy-submit-button"
            disabled={isPending}
          >
            {t('fileUploaderButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ImportPolicyModal;
