import { UnknownChartProps } from './UnknownChart.props';

export const UnknownChartComponent = ({ message }: Readonly<UnknownChartProps>): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <span className="heading-1">Unknown chart type</span>
      {message ? <span className="heading-3">{message}</span> : null}
    </div>
  );
};

export default UnknownChartComponent;
