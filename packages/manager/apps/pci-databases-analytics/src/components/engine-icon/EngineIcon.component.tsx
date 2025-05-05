import { Glasses, TrendingUp, Database } from 'lucide-react';
import * as database from '@/types/cloud/project/database';
import { cn } from '@/lib/utils';

interface EngineIconProps {
  engine: database.EngineEnum;
  category: database.engine.CategoryEnum;
  className?: string;
  iconSize?: number;
}

export const EngineIcon = ({
  engine,
  category,
  className,
  iconSize = 20,
}: EngineIconProps) => {
  const categoryIcons: Record<database.engine.CategoryEnum, JSX.Element> = {
    [database.engine.CategoryEnum.analysis]: <Glasses size={iconSize} />,
    [database.engine.CategoryEnum.streaming]: <TrendingUp size={iconSize} />,
    [database.engine.CategoryEnum.operational]: <Database size={iconSize} />,
    [database.engine.CategoryEnum.all]: <Database size={iconSize} />,
  };

  const engineStyles: Record<database.EngineEnum, string> = {
    cassandra: 'from-blue-900 to-blue-300',
    grafana: 'from-orange-600 to-yellow-300',
    kafka: 'from-black to-gray-700',
    kafkaConnect: 'from-black to-gray-700',
    kafkaMirrorMaker: 'from-black to-gray-700',
    m3aggregator: 'from-purple-900 to-purple-400',
    m3db: 'from-purple-900 to-purple-400',
    mongodb: 'from-green-800 to-green-400',
    mysql: 'from-blue-700 to-cyan-300',
    opensearch: 'from-blue-500 to-blue-300',
    postgresql: 'from-indigo-900 to-blue-400',
    redis: 'from-red-700 to-red-400',
    valkey: 'from-purple-700 to-blue-200',
  };

  return (
    <div
      className={cn(
        `rounded-full bg-gradient-to-tr ${engineStyles[engine] ||
          'from-primary to-slate-50'} text-white p-1`,
        className,
      )}
    >
      {categoryIcons[category] ?? <Database size={iconSize} />}
    </div>
  );
};
