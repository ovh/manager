import React from 'react';

const NoToC = () => {
  return (
    <style>
      {`
        .sbdocs-wrapper > div:has(div > .toc-wrapper) {
          display: none;
        }
      `}
    </style>
  );
};

export {
  NoToC,
};
