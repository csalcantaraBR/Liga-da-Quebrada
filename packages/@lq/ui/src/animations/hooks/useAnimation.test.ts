import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimation } from './useAnimation';

describe('useAnimation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false, // Default to false for prefers-reduced-motion
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('useAnimation - Basic Animation', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAnimation());

      expect(result.current.isAnimating).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.startAnimation).toBeDefined();
      expect(result.current.stopAnimation).toBeDefined();
    });

    it('should start animation when called', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('should stop animation when called', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.startAnimation();
        result.current.stopAnimation();
      });

      expect(result.current.isAnimating).toBe(false);
    });

    it('should animate with custom duration', () => {
      const { result } = renderHook(() => useAnimation({ duration: 1000 }));

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion to true
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.startAnimation();
      });

      // Animation should be disabled when prefers-reduced-motion is active
      expect(result.current.isAnimating).toBe(false);
    });
  });

  describe('useAnimation - Easing Functions', () => {
    it('should support linear easing', () => {
      const { result } = renderHook(() => useAnimation({ easing: 'linear' }));

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('should support ease-in easing', () => {
      const { result } = renderHook(() => useAnimation({ easing: 'easeIn' }));

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('should support ease-out easing', () => {
      const { result } = renderHook(() => useAnimation({ easing: 'easeOut' }));

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('should support ease-in-out easing', () => {
      const { result } = renderHook(() => useAnimation({ easing: 'easeInOut' }));

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });
  });

  describe('useAnimation - Callbacks', () => {
    it('should call onStart callback', () => {
      const onStart = vi.fn();
      const { result } = renderHook(() => useAnimation({ onStart }));

      act(() => {
        result.current.startAnimation();
      });

      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should call onComplete callback', () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() => useAnimation({ onComplete }));

      act(() => {
        result.current.startAnimation();
        result.current.stopAnimation();
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should call onUpdate callback during animation', () => {
      const onUpdate = vi.fn();
      const { result } = renderHook(() => useAnimation({ onUpdate }));

      act(() => {
        result.current.startAnimation();
      });

      expect(onUpdate).toHaveBeenCalled();
    });
  });

  describe('useAnimation - Performance', () => {
    it('should use requestAnimationFrame for smooth animations', () => {
      const mockRequestAnimationFrame = vi.fn();
      global.requestAnimationFrame = mockRequestAnimationFrame;

      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.startAnimation();
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should cleanup animation on unmount', () => {
      const { result, unmount } = renderHook(() => useAnimation());

      // Start animation
      act(() => {
        result.current.startAnimation();
      });

      // Ensure animation is running
      expect(result.current.isAnimating).toBe(true);

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });
});
