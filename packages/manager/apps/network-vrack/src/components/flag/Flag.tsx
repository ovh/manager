import { getCountryCode } from '@/utils/region';

interface FlagDisplayProps {
  region: string;
}

export const Flag = ({ region }: FlagDisplayProps) => {
  return (
    <div
      style={{
        backgroundImage: `url('flags/${getCountryCode(region)}.svg')`,
      }}
      className="mr-3 w-10 bg-cover shadow-md"
    />
  );
};
