import { Step } from './steps.type';
import './steps.scss';

type Props = {
  steps: Step[];
};

export default function Steps({ steps }: Props) {
  return (
    <ul className="steps">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`step ${step.isActive ? 'step-active' : ''}`}
          data-content={step.label}
        >
          <div>{step.children}</div>
        </li>
      ))}
    </ul>
  );
}
