import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { displaySizeFormat } from '@/data/notebooks';

interface SliderProps {
  storageUsed: number;
  storageFree: number;
}

const ResourceSlider = ({ storageUsed, storageFree }: SliderProps) => {
  const formattedStorageUsed = displaySizeFormat(storageUsed, false, 1);
  const formattedStorageFree = displaySizeFormat(storageFree, false, 1);

  console.log(formattedStorageFree);
  console.log(formattedStorageUsed);
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

/*
ResourceSlider.Skeleton = function ResourceSliderSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-56 h-4" />
      <Skeleton className="w-20 h-4" />
    </div>
  );
};
*/
