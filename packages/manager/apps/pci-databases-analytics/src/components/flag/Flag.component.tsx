import { cn } from '@/lib/utils';

const Flag = ({
  flagName,
  className,
}: {
  flagName: string;
  className?: string;
}) => {
  if (!flagName) {
    return null;
  }
  const flagUrl = `assets/flags/${flagName}.svg`;
  return (
    <div
      style={{
        backgroundImage: `url('${flagUrl}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
      className={cn(
        'w-[1.33rem] h-[1rem] inline-block align-middle shadow-sm',
        className,
      )}
    ></div>
  );
};

export default Flag;
