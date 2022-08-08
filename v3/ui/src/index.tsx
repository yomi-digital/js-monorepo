import React from 'react';
import { createRoot } from 'react-dom/client';
import { Synthetix } from './App';
import './app.css';

const container = document.querySelector('#app');
// @ts-ignore
const root = createRoot(container);

root.render(<Synthetix />);