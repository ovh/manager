import { Outlet } from 'react-router-dom';
import StoragesList from './_components/StorageListTable.component';
import { useObjectStorageData } from '../ObjectStorage.context';

const Storages = () => {
  const { storages } = useObjectStorageData();

  return (
    <>
      <StoragesList storages={storages || []} />
      <Outlet />
    </>
  );
};

export default Storages;
