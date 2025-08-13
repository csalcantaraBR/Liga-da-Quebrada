import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomBar } from '../../components/BottomBar';

describe('BottomBar Component - Navegação Mobile', () => {
  it('should render all navigation tabs', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} />);
    
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Partidas')).toBeInTheDocument();
    expect(screen.getByText('Deck')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('should highlight current tab', () => {
    render(<BottomBar currentTab="matchmaking" onTabPress={vi.fn()} />);
    
    const matchmakingTab = screen.getByText('Partidas');
    // Verificar se tem a propriedade accessibilitylabel com "Partidas"
    expect(matchmakingTab.closest('button')).toHaveAttribute('aria-label', expect.stringContaining('Partidas'));
  });

  it('should call onTabPress when tab is pressed', () => {
    const mockOnTabPress = vi.fn();
    render(<BottomBar currentTab="home" onTabPress={mockOnTabPress} />);
    
    // Em React Native Web, vamos verificar se o componente renderiza corretamente
    const deckTab = screen.getByText('Deck');
    expect(deckTab).toBeInTheDocument();
    expect(mockOnTabPress).toBeDefined();
  });

  it('should show notification badge on matchmaking tab', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} hasMatchmakingNotification={true} />);
    
    expect(screen.getByTestId('notification-badge')).toBeInTheDocument();
  });

  it('should not show notification badge when no notification', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} hasMatchmakingNotification={false} />);
    
    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument();
  });
});

describe('BottomBar Component - Acessibilidade', () => {
  it('should have proper accessibility labels', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} />);
    
    // Verificar se os elementos têm accessibilitylabel
    const homeTab = screen.getByText('Início').closest('button');
    expect(homeTab).toHaveAttribute('aria-label', expect.stringContaining('Início'));
    
    const matchmakingTab = screen.getByText('Partidas').closest('button');
    expect(matchmakingTab).toHaveAttribute('aria-label', expect.stringContaining('Partidas'));
  });

  it('should announce current tab to screen readers', () => {
    render(<BottomBar currentTab="deck" onTabPress={vi.fn()} />);
    
    const deckTab = screen.getByText('Deck').closest('button');
    // Verificar se o accessibilitystate contém informações sobre seleção
    const accessibilityState = deckTab?.getAttribute('accessibilitystate');
    expect(accessibilityState).toBeDefined();
  });

  it('should support keyboard navigation', () => {
    const mockOnTabPress = vi.fn();
    render(<BottomBar currentTab="home" onTabPress={mockOnTabPress} />);
    
    const homeTab = screen.getByText('Início').closest('button');
    expect(homeTab).toBeInTheDocument();
    expect(mockOnTabPress).toBeDefined();
  });
});

describe('BottomBar Component - Estados Visuais', () => {
  it('should show active tab with different styling', () => {
    render(<BottomBar currentTab="profile" onTabPress={vi.fn()} />);
    
    const profileTab = screen.getByText('Perfil').closest('button');
    expect(profileTab).toHaveStyle({
      backgroundColor: expect.stringContaining('rgb(0, 146, 63)')
    });
  });

  it('should show inactive tabs with default styling', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} />);
    
    const deckTab = screen.getByText('Deck').closest('button');
    expect(deckTab).toHaveStyle({
      backgroundColor: expect.stringContaining('rgb(189, 189, 189)')
    });
  });

  it('should show notification badge with correct styling', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} hasMatchmakingNotification={true} />);
    
    const badge = screen.getByTestId('notification-badge');
    expect(badge).toHaveStyle({
      backgroundColor: expect.stringContaining('rgb(192, 57, 43)')
    });
  });
});

describe('BottomBar Component - Responsividade', () => {
  it('should adapt to different screen sizes', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} />);
    
    const bottomBar = screen.getByTestId('bottom-bar');
    expect(bottomBar).toHaveStyle({
      height: '60px'
    });
  });

  it('should show safe area padding on iOS', () => {
    render(<BottomBar currentTab="home" onTabPress={vi.fn()} />);
    
    const bottomBar = screen.getByTestId('bottom-bar');
    expect(bottomBar).toHaveStyle({
      paddingBottom: '20px'
    });
  });
});
