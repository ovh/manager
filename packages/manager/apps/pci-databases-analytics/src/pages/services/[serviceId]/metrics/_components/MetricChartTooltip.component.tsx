import { TooltipProps } from 'recharts';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

interface CustomTooltipProps extends TooltipProps<number, string> {
  unit: string;
}

export const MetricChartTooltip = ({
  active,
  payload,
  label,
  unit,
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border bg-background px-3 py-2 shadow-sm text-sm">
      <div className="mb-1 text-muted-foreground">
        <FormattedDate
          date={new Date(label)}
          options={{
            dateStyle: 'full',
            timeStyle: 'medium',
          }}
        />
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center space-x-2">
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}</span>
          <span className="ml-auto font-medium">
            {entry.value.toLocaleString()} {unit}
          </span>
        </div>
      ))}
    </div>
  );
};
