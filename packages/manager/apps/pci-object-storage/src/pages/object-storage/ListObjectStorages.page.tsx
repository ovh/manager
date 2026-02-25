import { Outlet } from 'react-router-dom';
import StoragesList from './_components/storages/StorageListTable.component';
import { useObjectStorageData } from './ObjectStorage.context';

const ListObjectStorages = () => {
  const { storages } = useObjectStorageData();

  return (
    <>
      <StoragesList storages={storages || []} />
      <Outlet />
    </>
  );
};

export default ListObjectStorages;
