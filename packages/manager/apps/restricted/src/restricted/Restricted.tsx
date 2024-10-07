import React from 'react';

import ErrorJumbotron from './ErrorJumbotron/ErrorJumbotron';
import GuideCard from './GuideCard/GuideCard';
import Navbar from './Navbar';
import Sidebar from './Sidebar/Sidebar';

import { GUIDES } from '@/constants';

import './restricted.styles.scss';

const Restricted = (): JSX.Element => (
  <div className="restricted d-flex flex-column h-100">
    <Navbar />
    <Sidebar />
    <div className="restricted-main d-flex flex-column px-5">
      <ErrorJumbotron />
      <div className="restricted-guides mb-4 d-flex flex-column flex-md-row">
        {GUIDES.map((guide) => (
          <GuideCard {...guide} key={guide.id} />
        ))}
      </div>
    </div>
  </div>
);

export default Restricted;
