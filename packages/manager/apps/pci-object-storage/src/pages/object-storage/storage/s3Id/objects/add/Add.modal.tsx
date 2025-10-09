import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@datatr-ux/uxlib';

import FileUploader from '@/components/file-uploader/FileUploader.component';
import { useGetStorageAccess } from '@/data/hooks/storage/useGetStorageAccess.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useAddSwiftObject } from '@/data/hooks/swift-storage/useAddSwiftObject.hook';

const AddObjectModal = () => {
  // const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  // const { projectId } = useParams();
  // const [newfiles, setNewFiles] = useState<File[]>([]);
  // const [prefix, setPrefix] = useState<string>('');
  // const { swift } = useSwiftData();
  // const navigate = useNavigate();
  // const toast = useToast();

  // const { addSwiftObject, isPending: pendingAddSwift } = useAddSwiftObject({
  //   onError: (err) => {
  //     toast.toast({
  //       title: t('objectToastErrorTitle'),
  //       variant: 'destructive',
  //       description: getObjectStoreApiErrorMessage(err),
  //     });
  //   },
  //   onAddSuccess: () => {
  //     toast.toast({
  //       title: t('objectToastSuccessTitle'),
  //       description: t('addObjectToastSuccessDescription'),
  //     });
  //   },
  // });

  // const {
  //   getStorageAccess,
  //   isPending: pendingGetStorage,
  // } = useGetStorageAccess({
  //   onError: (err) => {
  //     toast.toast({
  //       title: t('objectToastErrorTitle'),
  //       variant: 'destructive',
  //       description: getObjectStoreApiErrorMessage(err),
  //     });
  //   },
  //   onSuccess: (access) => {
  //     const swiftUrl = access.endpoints.find(
  //       (endpoint) => endpoint.region === swift.region,
  //     ).url;
  //     if (!swiftUrl) return;

  //     newfiles.map((file: File) =>
  //       addSwiftObject({
  //         url: `${swiftUrl}/${swift.name}${encodeURIComponent(
  //           prefix ? `${prefix}/${file.name}` : file.name,
  //         )}`,
  //         file,
  //         token: access.token,
  //       }),
  //     );
  //     navigate('../');
  //   },
  // });

  return (
    <></>
    // <FileUploader
    //   multipleFileImport={true}
    //   onFileSelect={(pref, files) => {
    //     setNewFiles(files);
    //     setPrefix(pref);
    //     getStorageAccess({ projectId });
    //   }}
    //   title={t('addOjectModalTitle')}
    //   pending={pendingGetStorage || pendingAddSwift}
    // />
  );
};

export default AddObjectModal;
