import React from 'react';
import { startApplication } from './core';

const Home = React.lazy(() => import('./home'));

startApplication('dedicated', Home);
