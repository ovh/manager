import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@datatr-ux/uxlib';
import FileUploader from '@/components/file-uploader/FileUploader.component';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useAddUserPolicy } from '@/data/hooks/user/useAddUserPolicy.hook';
import { readJsonFile } from '@/lib/fileReader';

const ImportPolicyModal = () => {
  const { t } = useTranslation('pci-object-storage/users/import-policy');
  const { projectId, userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { addUserPolicy, isPending } = useAddUserPolicy({
    onError: (err) => {
      toast.toast({
        title: t('userPolicyToastErrorTitle'),
        variant: 'destructive',
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

  return (
    <FileUploader
      multipleFileImport={false}
      description={t('addUserPolicyDescription')}
      onFileSelect={async (pref, files) => {
        try {
          const policyJson = await readJsonFile(files[0]);
          addUserPolicy({
            projectId,
            userId: Number(userId),
            policyData: { policy: JSON.stringify(policyJson) },
          });
        } catch (err) {
          toast.toast({
            title: t('userPolicyToastErrorTitle'),
            variant: 'destructive',
            description: t('userPolicyJSONToastError'),
          });
        }
      }}
      jsonFile={true}
      title={t('addUserPolicyTitle')}
      pending={isPending}
    />
  );
};

export default ImportPolicyModal;
