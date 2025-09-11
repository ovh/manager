import React from 'react';
import './CreatingSpinner.css';

type CreatingSpinnerProps = {
  children?: React.ReactNode;
};

export default function CreatingSpinner({ children }: CreatingSpinnerProps) {
  return (
    <div className="creating-spinner-container">
      <div className="creating-spinner-content">{children}</div>
      <div className="creating-spinner">
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="28"
          />
        </svg>
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="28"
          />
        </svg>
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="28"
          />
        </svg>
      </div>
    </div>
  );
}
