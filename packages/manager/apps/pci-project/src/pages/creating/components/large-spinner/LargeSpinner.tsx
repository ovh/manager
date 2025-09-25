import React from 'react';
import './LargeSpinner.css';

type LargeSpinnerProps = {
  children?: React.ReactNode;
};

export default function LargeSpinner({ children }: LargeSpinnerProps) {
  return (
    <div className="large-spinner-container">
      <div className="large-spinner-content">{children}</div>
      <div className="large-spinner">
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
