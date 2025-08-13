import { useState, useCallback, useRef, useEffect } from 'react';

export interface HoverConfig {
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  debounceMs?: number;
}

export interface HoverState {
  isHovered: boolean;
  hoverProps: {
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onTouchStart?: (event: React.TouchEvent) => void;
    onTouchEnd?: (event: React.TouchEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
  };
}

export const useHover = (config: HoverConfig = {}): HoverState => {
  const { onHoverStart, onHoverEnd, debounceMs = 0 } = config;
  
  const [isHovered, setIsHovered] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wasHoveredRef = useRef(false);

  const clearDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const setHovered = useCallback((hovered: boolean) => {
    if (debounceMs > 0) {
      clearDebounce();
      debounceRef.current = setTimeout(() => {
        if (hovered !== wasHoveredRef.current) {
          setIsHovered(hovered);
          wasHoveredRef.current = hovered;
          
          if (hovered) {
            onHoverStart?.();
          } else {
            onHoverEnd?.();
          }
        }
      }, debounceMs);
    } else {
      if (hovered !== wasHoveredRef.current) {
        setIsHovered(hovered);
        wasHoveredRef.current = hovered;
        
        if (hovered) {
          onHoverStart?.();
        } else {
          onHoverEnd?.();
        }
      }
    }
  }, [debounceMs, clearDebounce, onHoverStart, onHoverEnd]);

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    event?.preventDefault?.();
    setHovered(true);
  }, [setHovered]);

  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    event?.preventDefault?.();
    setHovered(false);
  }, [setHovered]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event?.preventDefault?.();
    setHovered(true);
  }, [setHovered]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event?.preventDefault?.();
    setHovered(false);
  }, [setHovered]);

  const handleFocus = useCallback((event: React.FocusEvent) => {
    event?.preventDefault?.();
    setHovered(true);
  }, [setHovered]);

  const handleBlur = useCallback((event: React.FocusEvent) => {
    event?.preventDefault?.();
    setHovered(false);
  }, [setHovered]);

  useEffect(() => {
    return () => {
      clearDebounce();
    };
  }, [clearDebounce]);

  return {
    isHovered,
    hoverProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
};
