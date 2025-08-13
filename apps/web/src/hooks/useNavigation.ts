import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export type Screen = 'home' | 'matchmaking' | 'game' | 'deck' | 'profile';

export interface NavigationEntry {
  screen: Screen;
  params?: Record<string, any>;
  timestamp: number;
}

export interface NavigationState {
  currentScreen: Screen;
  params?: Record<string, any>;
  history: NavigationEntry[];
}

export interface NavigationActions {
  navigate: (screen: Screen, params?: Record<string, any>) => void;
  goBack: () => void;
  replace: (screen: Screen, params?: Record<string, any>) => void;
  canGoBack: () => boolean;
}

export function useNavigation(): NavigationState & NavigationActions {
  const router = useRouter();
  const [history, setHistory] = useState<NavigationEntry[]>([]);
  
  // Determine current screen from router pathname
  const getCurrentScreen = useCallback((): Screen => {
    const pathname = router.pathname;
    
    if (pathname === '/') return 'home';
    if (pathname === '/matchmaking') return 'matchmaking';
    if (pathname.startsWith('/game/')) return 'game';
    if (pathname === '/deck') return 'deck';
    if (pathname === '/profile') return 'profile';
    
    return 'home';
  }, [router.pathname]);

  const currentScreen = getCurrentScreen();
  const params = router.query;

  const navigate = useCallback((screen: Screen, params?: Record<string, any>) => {
    const entry: NavigationEntry = {
      screen: currentScreen,
      params: router.query,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, entry]);

    // Map screen to route
    let route = '/';
    switch (screen) {
      case 'home':
        route = '/';
        break;
      case 'matchmaking':
        route = '/matchmaking';
        break;
      case 'game':
        route = `/game/${params?.matchId || 'new'}`;
        break;
      case 'deck':
        route = '/deck';
        break;
      case 'profile':
        route = '/profile';
        break;
    }

    router.push(route, undefined, { shallow: true });
  }, [currentScreen, router]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const previousEntry = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      
      // Map screen to route
      let route = '/';
      switch (previousEntry.screen) {
        case 'home':
          route = '/';
          break;
        case 'matchmaking':
          route = '/matchmaking';
          break;
        case 'game':
          route = `/game/${previousEntry.params?.matchId || 'new'}`;
          break;
        case 'deck':
          route = '/deck';
          break;
        case 'profile':
          route = '/profile';
          break;
      }

      router.push(route, undefined, { shallow: true });
    } else {
      router.back();
    }
  }, [history, router]);

  const replace = useCallback((screen: Screen, params?: Record<string, any>) => {
    // Map screen to route
    let route = '/';
    switch (screen) {
      case 'home':
        route = '/';
        break;
      case 'matchmaking':
        route = '/matchmaking';
        break;
      case 'game':
        route = `/game/${params?.matchId || 'new'}`;
        break;
      case 'deck':
        route = '/deck';
        break;
      case 'profile':
        route = '/profile';
        break;
    }

    router.replace(route, undefined, { shallow: true });
  }, [router]);

  const canGoBack = useCallback(() => {
    return history.length > 0;
  }, [history]);

  return {
    currentScreen,
    params,
    history,
    navigate,
    goBack,
    replace,
    canGoBack
  };
}
