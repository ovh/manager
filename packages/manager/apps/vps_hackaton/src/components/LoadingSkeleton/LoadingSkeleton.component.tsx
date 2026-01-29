type TLoadingSkeletonProps = {
  lines?: number;
  className?: string;
};

export const LoadingSkeleton = ({
  lines = 3,
  className = '',
}: TLoadingSkeletonProps) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 rounded bg-gray-200"
          style={{ width: `${100 - index * 10}%` }}
        />
      ))}
    </div>
  );
};
