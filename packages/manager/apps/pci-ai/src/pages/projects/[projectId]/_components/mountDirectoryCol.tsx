import { toast } from 'sonner';

import { Files } from "lucide-react";

const MountDirectoryColumn = ({ mountPath }: { mountPath: string }) => {
  return (
    <div className="flex items-center mt-2 py-1 max-w-[450px] text-primary font-semibold  border-primary-100 border hover:bg-primary-100 hover:text-primary-700 hover:border-b-primary">
    <p className="flex-1 truncate ml-1">{mountPath}</p>
    <Files
      className="w-4 h-4 ml-3 mb-1"
      onClick={() => {
        navigator.clipboard.writeText(mountPath || '');
        toast.success('Mount directory saved in clipboard', {
          dismissible: true,
        });
      }}
    />
  </div>
  );
};

export default MountDirectoryColumn;
