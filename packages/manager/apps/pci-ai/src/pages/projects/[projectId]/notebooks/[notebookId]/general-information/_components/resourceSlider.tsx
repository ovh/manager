import { Progress } from '@/components/ui/progress';
import { displaySizeFormat } from '@/data/constant';

interface SliderProps {
  storageUsed: number;
  storageFree: number;
}

const ResourceSlider = ({ storageUsed, storageFree }: SliderProps) => {
  const formattedStorageUsed = displaySizeFormat(storageUsed, false, 1);
  const formattedStorageFree = displaySizeFormat(storageFree, false, 1);

  const value = (storageUsed * 100) / storageFree;
  return (
    <>
      <div className='mt-2'>
        <Progress value={value} />
        <p className="text-sm">
          {formattedStorageUsed} / {formattedStorageFree}
        </p>
      </div>
    </>
  );
};

export default ResourceSlider;
