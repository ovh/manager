import { Loader } from '../../loaders/Loader.component';
import { LoadingChartComponentSpinnerProps } from './LoadingChartSpinner.props';

export const LoadingChartSpinnerComponent = ({
  type,
}: Readonly<LoadingChartComponentSpinnerProps>): JSX.Element => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader message={`loading chart ${type}`} />
    </div>
  );
};

export default LoadingChartSpinnerComponent;
