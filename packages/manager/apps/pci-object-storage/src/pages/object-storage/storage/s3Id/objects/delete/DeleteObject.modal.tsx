import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Button,
  useToast,
  Input,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@datatr-ux/uxlib';
import { PERMANENT_DELETE_CONFIRMATION } from '@/configuration/polling.constants';
import RouteModal from '@/components/route-modal/RouteModal';
import storages from '@/types/Storages';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetStorageAccess } from '@/data/hooks/storage/useGetStorageAccess.hook';
import { useDeleteSwiftObject } from '@/data/hooks/swift-storage/useDeleteSwiftObject.hook';

const DeleteSwiftObject = () => {
  // const { projectId } = useParams();
  // const [searchParams] = useSearchParams();
  // const navigate = useNavigate();
  // const objectName = searchParams.get('objectName');
  // const { swift } = useSwiftData();
  // const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  // const toast = useToast();
  // const [confirmationInput, setConfirmationInput] = useState('');

  // if (!objectName) return navigate('../');
  // const { deleteSwiftObject, isPending: deletePending } = useDeleteSwiftObject({
  //   onError: (err) => {
  //     toast.toast({
  //       title: t('objectToastErrorTitle'),
  //       variant: 'destructive',
  //       description: getObjectStoreApiErrorMessage(err),
  //     });
  //   },
  //   onDeleteSuccess: () => {
  //     toast.toast({
  //       title: t('objectToastSuccessTitle'),
  //       description: t('deleteObjectToastSuccessDescription', {
  //         name: objectName,
  //       }),
  //     });
  //     navigate('../');
  //   },
  // });

  // const { getStorageAccess, isPending: accessPending } = useGetStorageAccess({
  //   onError: (err) => {
  //     toast.toast({
  //       title: t('objectToastErrorTitle'),
  //       variant: 'destructive',
  //       description: getObjectStoreApiErrorMessage(err),
  //     });
  //   },
  //   onSuccess: (access: storages.ContainerAccess) => {
  //     const swiftUrl = access.endpoints.find(
  //       (url) => url.region === swift.region,
  //     ).url;
  //     deleteSwiftObject({
  //       objectName,
  //       storageName: swift.name,
  //       token: access.token,
  //       url: swiftUrl,
  //     });
  //   },
  // });

  // const handleDelete = () => {
  //   getStorageAccess({ projectId });
  // };

  return (
    <></>
    // <RouteModal isLoading={!projectId && !objectName}>
    //   <DialogContent className="p-0">
    //     <DialogHeader className="bg-warning-100 p-6 rounded-t-sm sm:rounded-t-lg ">
    //       <DialogTitle>{t('deleteObjectTitle')}</DialogTitle>
    //     </DialogHeader>
    //     <div className="p-6 pt-0">
    //       <p className="mt-2">
    //         {t('deleteObjectDescription', {
    //           name: objectName,
    //         })}
    //       </p>

    //       <div className="flex flex-col gap-2 mt-2">
    //         <Label htmlFor="terminateInput" className="font-semibold">
    //           {t('deleteObjectConfirmation')}
    //         </Label>
    //         <Input
    //           id="terminateInput"
    //           type="text"
    //           placeholder="PERMANENTLY DELETE"
    //           onChange={(event) => {
    //             setConfirmationInput(event.target.value);
    //           }}
    //         />
    //       </div>
    //     </div>
    //     <DialogFooter className="flex justify-end p-6 pt-0">
    //       <DialogClose asChild>
    //         <Button type="button" mode="outline">
    //           {t('deleteObjectButtonCancel')}
    //         </Button>
    //       </DialogClose>
    //       <Button
    //         type="button"
    //         disabled={
    //           deletePending ||
    //           accessPending ||
    //           confirmationInput !== PERMANENT_DELETE_CONFIRMATION
    //         }
    //         onClick={handleDelete}
    //       >
    //         {t('deleteObjectButtonConfirm')}
    //       </Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </RouteModal>
  );
};

export default DeleteSwiftObject;
