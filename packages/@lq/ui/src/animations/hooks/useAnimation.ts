import { useState, useCallback, useEffect, useRef } from 'react';

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

export interface AnimationConfig {
  duration?: number;
  easing?: EasingFunction;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: (progress: number) => void;
}

export interface AnimationState {
  isAnimating: boolean;
  progress: number;
  startAnimation: () => void;
  stopAnimation: () => void;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};

// Check if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useAnimation = (config: AnimationConfig = {}): AnimationState => {
  const {
    duration = 300,
    easing = 'easeInOut',
    onStart,
    onComplete,
    onUpdate,
  } = config;

  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](rawProgress);

    setProgress(easedProgress);
    onUpdate?.(easedProgress);

    if (rawProgress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setProgress(1);
      onComplete?.();
    }
  }, [duration, easing, onUpdate, onComplete]);

  const startAnimation = useCallback(() => {
    if (prefersReducedMotion()) {
      // Skip animation if user prefers reduced motion
      setProgress(1);
      onUpdate?.(1);
      onComplete?.();
      return;
    }

    setIsAnimating(true);
    setProgress(0);
    onUpdate?.(0);
    startTimeRef.current = null;
    onStart?.();
    
    animationRef.current = requestAnimationFrame(animate);
  }, [animate, onStart, onComplete, onUpdate]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    isAnimating,
    progress,
    startAnimation,
    stopAnimation,
  };
};
