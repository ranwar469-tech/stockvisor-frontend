import '@testing-library/jest-dom/vitest';
import React from 'react';
import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeAll(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(window, 'confirm').mockImplementation(() => true);

  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  if (!window.ResizeObserver) {
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.ResizeObserver = ResizeObserver;
  }

  window.scrollTo = vi.fn();
});

vi.mock('react-google-charts', () => ({
  Chart: (props) => React.createElement('div', {
    'data-testid': 'google-chart',
    'data-chart-type': props.chartType || 'unknown',
  }),
}));

vi.mock('react-chartjs-2', () => ({
  Line: () => React.createElement('div', { 'data-testid': 'line-chart' }),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => React.createElement('div', { 'data-testid': 'responsive-container' }, children),
  RadarChart: ({ children }) => React.createElement('div', { 'data-testid': 'radar-chart' }, children),
  Radar: () => React.createElement('div', { 'data-testid': 'radar' }),
  PolarGrid: () => React.createElement('div', { 'data-testid': 'polar-grid' }),
  PolarAngleAxis: () => React.createElement('div', { 'data-testid': 'polar-angle-axis' }),
  PolarRadiusAxis: () => React.createElement('div', { 'data-testid': 'polar-radius-axis' }),
  Tooltip: () => React.createElement('div', { 'data-testid': 'recharts-tooltip' }),
}));
