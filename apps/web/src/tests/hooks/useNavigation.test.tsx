import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useNavigation } from '../../hooks/useNavigation';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

describe('useNavigation Hook', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  describe('Navigation State Management', () => {
    it('should track current screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('home');
    });

    it('should handle navigation history', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('matchmaking');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].screen).toBe('home');
    });

    it('should support navigation parameters', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('game', { matchId: 'test-123' });
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/game/test-123', undefined, { shallow: true });
    });
  });

  describe('Screen Navigation', () => {
    it('should navigate to home screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('home');
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/', undefined, { shallow: true });
    });

    it('should navigate to matchmaking screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('matchmaking');
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/matchmaking', undefined, { shallow: true });
    });

    it('should navigate to game screen with match ID', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('game', { matchId: 'match-123' });
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/game/match-123', undefined, { shallow: true });
    });

    it('should navigate to deck builder screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('deck');
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/deck', undefined, { shallow: true });
    });

    it('should navigate to profile screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.navigate('profile');
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/profile', undefined, { shallow: true });
    });
  });

  describe('Navigation Actions', () => {
    it('should go back to previous screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      // Add some history first
      act(() => {
        result.current.navigate('matchmaking');
      });

      act(() => {
        result.current.goBack();
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/', undefined, { shallow: true });
    });

    it('should replace current screen', () => {
      const { result } = renderHook(() => useNavigation());
      
      act(() => {
        result.current.replace('game', { matchId: 'new-match' });
      });

      expect(mockRouter.replace).toHaveBeenCalledWith('/game/new-match', undefined, { shallow: true });
    });

    it('should check if can go back', () => {
      const { result } = renderHook(() => useNavigation());
      
      // Initially should not be able to go back
      expect(result.current.canGoBack()).toBe(false);

      // Add some history
      act(() => {
        result.current.navigate('matchmaking');
      });

      // Now should be able to go back
      expect(result.current.canGoBack()).toBe(true);
    });
  });

  describe('Screen Detection', () => {
    it('should detect home screen from pathname', () => {
      mockRouter.pathname = '/';
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('home');
    });

    it('should detect matchmaking screen from pathname', () => {
      mockRouter.pathname = '/matchmaking';
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('matchmaking');
    });

    it('should detect game screen from pathname', () => {
      mockRouter.pathname = '/game/match-123';
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('game');
    });

    it('should detect deck screen from pathname', () => {
      mockRouter.pathname = '/deck';
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('deck');
    });

    it('should detect profile screen from pathname', () => {
      mockRouter.pathname = '/profile';
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('profile');
    });

    it('should default to home for unknown pathname', () => {
      mockRouter.pathname = '/unknown';
      const { result } = renderHook(() => useNavigation());
      
      expect(result.current.currentScreen).toBe('home');
    });
  });
});
