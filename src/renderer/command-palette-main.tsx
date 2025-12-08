import React from 'react';
import { createRoot } from 'react-dom/client';
import CommandPalette from './components/CommandPalette';

const root = createRoot(document.getElementById('root')!);
root.render(<CommandPalette />);
