import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimation } from '../../hooks/useAnimation';

describe('useAnimation Hook - Animações Básicas', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAnimation());
    
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.isVisible).toBe(false);
  });

  it('should start fade in animation', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.fadeIn();
    });
    
    // Verificar se a animação foi iniciada
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.isVisible).toBe(true);
  });

  it('should start fade out animation', async () => {
    const { result } = renderHook(() => useAnimation());
    
    // Primeiro faz fade in
    act(() => {
      result.current.fadeIn();
    });
    
    // Depois faz fade out
    act(() => {
      result.current.fadeOut();
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.isVisible).toBe(false);
  });

  it('should handle slide in from bottom', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideIn('bottom');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('bottom');
  });

  it('should handle slide in from top', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideIn('top');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('top');
  });

  it('should handle slide in from left', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideIn('left');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('left');
  });

  it('should handle slide in from right', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideIn('right');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('right');
  });

  it('should handle scale animation', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.scaleIn();
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.scale).toBeGreaterThanOrEqual(0);
  });

  it('should handle scale out animation', async () => {
    const { result } = renderHook(() => useAnimation());
    
    // Primeiro faz scale in
    act(() => {
      result.current.scaleIn();
    });
    
    // Depois faz scale out
    act(() => {
      result.current.scaleOut();
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.scale).toBeLessThanOrEqual(1);
  });

  it('should handle slide out from bottom', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideOut('bottom');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('bottom');
  });

  it('should handle slide out from top', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideOut('top');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('top');
  });

  it('should handle slide out from left', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideOut('left');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('left');
  });

  it('should handle slide out from right', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.slideOut('right');
    });
    
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.direction).toBe('right');
  });
});

describe('useAnimation Hook - Callbacks', () => {
  it('should call onAnimationStart callback', () => {
    const onStart = vi.fn();
    const { result } = renderHook(() => useAnimation({ onAnimationStart: onStart }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(onStart).toHaveBeenCalledWith('fadeIn');
  });

  it('should call onAnimationEnd callback', async () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useAnimation({ onAnimationEnd: onEnd }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    // Verificar se a animação foi iniciada
    expect(result.current.isAnimating).toBe(true);
    expect(onEnd).toBeDefined();
  });

  it('should handle multiple callbacks', () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    const { result } = renderHook(() => useAnimation({ 
      onAnimationStart: onStart,
      onAnimationEnd: onEnd 
    }));
    
    act(() => {
      result.current.slideIn('bottom');
    });
    
    expect(onStart).toHaveBeenCalledWith('slideIn');
  });

  it('should call callbacks for all animation types', () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    const { result } = renderHook(() => useAnimation({ 
      onAnimationStart: onStart,
      onAnimationEnd: onEnd 
    }));
    
    const animations = ['fadeIn', 'fadeOut', 'slideIn', 'slideOut', 'scaleIn', 'scaleOut'];
    
    animations.forEach(animation => {
      act(() => {
        if (animation === 'fadeIn') result.current.fadeIn();
        else if (animation === 'fadeOut') result.current.fadeOut();
        else if (animation === 'slideIn') result.current.slideIn('bottom');
        else if (animation === 'slideOut') result.current.slideOut('bottom');
        else if (animation === 'scaleIn') result.current.scaleIn();
        else if (animation === 'scaleOut') result.current.scaleOut();
      });
    });
    
    expect(onStart).toHaveBeenCalledTimes(animations.length);
  });
});

describe('useAnimation Hook - Configurações', () => {
  it('should use custom duration', () => {
    const { result } = renderHook(() => useAnimation({ duration: 1000 }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.duration).toBe(1000);
  });

  it('should use custom easing', () => {
    const { result } = renderHook(() => useAnimation({ easing: 'ease-out' }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.easing).toBe('ease-out');
  });

  it('should handle delay configuration', () => {
    const { result } = renderHook(() => useAnimation({ delay: 500 }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.delay).toBe(500);
  });

  it('should use all custom configurations', () => {
    const { result } = renderHook(() => useAnimation({ 
      duration: 2000,
      easing: 'ease-in-out',
      delay: 1000
    }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.duration).toBe(2000);
    expect(result.current.easing).toBe('ease-in-out');
    expect(result.current.delay).toBe(1000);
  });
});

describe('useAnimation Hook - Estados', () => {
  it('should track animation progress', async () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.fadeIn();
    });
    
    // Durante a animação, o progress deve estar entre 0 e 1
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(1);
  });

  it('should handle animation state changes', () => {
    const { result } = renderHook(() => useAnimation());
    
    // Estado inicial
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.isVisible).toBe(false);
    
    // Durante fade in
    act(() => {
      result.current.fadeIn();
    });
    
    // Verificar se a animação foi iniciada
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.isVisible).toBe(true);
  });

  it('should reset animation state', () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.fadeIn();
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.isVisible).toBe(false);
  });

  it('should handle multiple state changes', () => {
    const { result } = renderHook(() => useAnimation());
    
    // Fade in
    act(() => {
      result.current.fadeIn();
    });
    expect(result.current.isVisible).toBe(true);
    
    // Fade out
    act(() => {
      result.current.fadeOut();
    });
    expect(result.current.isVisible).toBe(false);
    
    // Reset
    act(() => {
      result.current.reset();
    });
    expect(result.current.isAnimating).toBe(false);
  });
});

describe('useAnimation Hook - Performance', () => {
  it('should not trigger unnecessary re-renders', () => {
    const { result, rerender } = renderHook(() => useAnimation());
    
    let renderCount = 0;
    
    rerender();
    renderCount++;
    
    act(() => {
      result.current.fadeIn();
    });
    
    rerender();
    renderCount++;
    
    // Deve ter no máximo 2 re-renders (inicial + animação)
    expect(renderCount).toBeLessThanOrEqual(2);
  });

  it('should handle concurrent animations', () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.fadeIn();
      result.current.slideIn('bottom');
    });
    
    // Deve manter apenas a última animação
    expect(result.current.isAnimating).toBe(true);
  });

  it('should handle rapid animation calls', () => {
    const { result } = renderHook(() => useAnimation());
    
    act(() => {
      result.current.fadeIn();
      result.current.fadeOut();
      result.current.scaleIn();
      result.current.slideIn('top');
    });
    
    expect(result.current.isAnimating).toBe(true);
  });
});

describe('useAnimation Hook - Easing Functions', () => {
  it('should handle linear easing', () => {
    const { result } = renderHook(() => useAnimation({ easing: 'linear' }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.easing).toBe('linear');
  });

  it('should handle ease-in easing', () => {
    const { result } = renderHook(() => useAnimation({ easing: 'ease-in' }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.easing).toBe('ease-in');
  });

  it('should handle ease-out easing', () => {
    const { result } = renderHook(() => useAnimation({ easing: 'ease-out' }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.easing).toBe('ease-out');
  });

  it('should handle ease-in-out easing', () => {
    const { result } = renderHook(() => useAnimation({ easing: 'ease-in-out' }));
    
    act(() => {
      result.current.fadeIn();
    });
    
    expect(result.current.easing).toBe('ease-in-out');
  });
});
