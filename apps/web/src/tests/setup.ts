import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  }))
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: 'img'
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: 'a'
}));
