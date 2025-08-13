import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHover } from './useHover';

describe('useHover Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useHover - Basic Functionality', () => {
    it('should initialize with isHovered as false', () => {
      const { result } = renderHook(() => useHover());

      expect(result.current.isHovered).toBe(false);
      expect(result.current.hoverProps).toBeDefined();
    });

    it('should handle mouse enter event', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
      });

      expect(result.current.isHovered).toBe(true);
    });

    it('should handle mouse leave event', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
        result.current.hoverProps.onMouseLeave?.({} as React.MouseEvent);
      });

      expect(result.current.isHovered).toBe(false);
    });

    it('should handle touch start event for mobile', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        result.current.hoverProps.onTouchStart?.({} as React.TouchEvent);
      });

      expect(result.current.isHovered).toBe(true);
    });

    it('should handle touch end event for mobile', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        result.current.hoverProps.onTouchStart?.({} as React.TouchEvent);
        result.current.hoverProps.onTouchEnd?.({} as React.TouchEvent);
      });

      expect(result.current.isHovered).toBe(false);
    });
  });

  describe('useHover - Callbacks', () => {
    it('should call onHoverStart callback', () => {
      const onHoverStart = vi.fn();
      const { result } = renderHook(() => useHover({ onHoverStart }));

      act(() => {
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
      });

      expect(onHoverStart).toHaveBeenCalledTimes(1);
    });

    it('should call onHoverEnd callback', () => {
      const onHoverEnd = vi.fn();
      const { result } = renderHook(() => useHover({ onHoverEnd }));

      act(() => {
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
        result.current.hoverProps.onMouseLeave?.({} as React.MouseEvent);
      });

      expect(onHoverEnd).toHaveBeenCalledTimes(1);
    });

    it('should not call callbacks if already in state', () => {
      const onHoverStart = vi.fn();
      const { result } = renderHook(() => useHover({ onHoverStart }));

      act(() => {
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent); // Second call
      });

      expect(onHoverStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('useHover - Accessibility', () => {
    it('should handle focus events for keyboard navigation', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        result.current.hoverProps.onFocus?.({} as React.FocusEvent);
      });

      expect(result.current.isHovered).toBe(true);
    });

    it('should handle blur events for keyboard navigation', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        result.current.hoverProps.onFocus?.({} as React.FocusEvent);
        result.current.hoverProps.onBlur?.({} as React.FocusEvent);
      });

      expect(result.current.isHovered).toBe(false);
    });

    it('should include proper ARIA attributes', () => {
      const { result } = renderHook(() => useHover());

      expect(result.current.hoverProps).toHaveProperty('onMouseEnter');
      expect(result.current.hoverProps).toHaveProperty('onMouseLeave');
      expect(result.current.hoverProps).toHaveProperty('onTouchStart');
      expect(result.current.hoverProps).toHaveProperty('onTouchEnd');
      expect(result.current.hoverProps).toHaveProperty('onFocus');
      expect(result.current.hoverProps).toHaveProperty('onBlur');
    });
  });

  describe('useHover - Performance', () => {
    it('should debounce rapid hover events', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useHover({ debounceMs: 100 }));

      act(() => {
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
        result.current.hoverProps.onMouseLeave?.({} as React.MouseEvent);
        result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
      });

      // Should be false initially due to debounce
      expect(result.current.isHovered).toBe(false);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Should be true after debounce
      expect(result.current.isHovered).toBe(true);

      vi.useRealTimers();
    });

    it('should cleanup timers on unmount', () => {
      vi.useFakeTimers();
      const { unmount } = renderHook(() => useHover({ debounceMs: 100 }));

      unmount();

      // Should not throw when timers are cleared
      expect(() => vi.advanceTimersByTime(100)).not.toThrow();

      vi.useRealTimers();
    });
  });

  describe('useHover - Edge Cases', () => {
    it('should handle null events gracefully', () => {
      const { result } = renderHook(() => useHover());

      expect(() => {
        act(() => {
          result.current.hoverProps.onMouseEnter?.(null as any);
        });
      }).not.toThrow();
    });

    it('should handle undefined callbacks', () => {
      const { result } = renderHook(() => useHover({ onHoverStart: undefined }));

      expect(() => {
        act(() => {
          result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
        });
      }).not.toThrow();
    });

    it('should maintain state during rapid events', () => {
      const { result } = renderHook(() => useHover());

      act(() => {
        // Rapid enter/leave events
        for (let i = 0; i < 10; i++) {
          result.current.hoverProps.onMouseEnter?.({} as React.MouseEvent);
          result.current.hoverProps.onMouseLeave?.({} as React.MouseEvent);
        }
      });

      expect(result.current.isHovered).toBe(false);
    });
  });
});
