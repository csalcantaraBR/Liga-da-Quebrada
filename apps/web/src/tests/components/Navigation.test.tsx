import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { Navigation } from '../../components/Navigation';
import * as useNavigationModule from '../../hooks/useNavigation';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

describe('Navigation Component', () => {
  const mockNavigate = vi.fn();
  const mockGoBack = vi.fn();
  const mockCanGoBack = vi.fn();

  const mockUseNavigation = {
    currentScreen: 'home' as const,
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
    history: [],
    params: {},
    replace: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      pathname: '/',
      query: {},
      push: vi.fn(),
      replace: vi.fn()
    });
    
    vi.spyOn(useNavigationModule, 'useNavigation').mockReturnValue(mockUseNavigation);
  });

  describe('Navigation UI Components', () => {
    it('should render navigation menu', () => {
      render(<Navigation />);
      
      expect(screen.getByText('Início')).toBeInTheDocument();
      expect(screen.getByText('Jogar')).toBeInTheDocument();
      expect(screen.getByText('Deck')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });

    it('should show active navigation item', () => {
      render(<Navigation />);
      
      const homeButton = screen.getByText('Início').closest('button');
      expect(homeButton).toHaveAttribute('aria-current', 'page');
    });

    it('should handle navigation clicks', () => {
      render(<Navigation />);
      
      const playButton = screen.getByText('Jogar');
      fireEvent.click(playButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('matchmaking');
    });

    it('should support keyboard navigation', () => {
      render(<Navigation />);
      
      const deckButton = screen.getByText('Deck').closest('button');
      deckButton?.focus();
      
      expect(deckButton).toHaveFocus();
    });
  });

  describe('Back Button Functionality', () => {
    it('should show back button when showBackButton is true', () => {
      render(<Navigation showBackButton={true} />);
      
      expect(screen.getByLabelText('Voltar')).toBeInTheDocument();
    });

    it('should not show back button by default', () => {
      render(<Navigation />);
      
      expect(screen.queryByLabelText('Voltar')).not.toBeInTheDocument();
    });

    it('should handle back button click', () => {
      mockCanGoBack.mockReturnValue(true);
      render(<Navigation showBackButton={true} />);
      
      const backButton = screen.getByLabelText('Voltar');
      fireEvent.click(backButton);
      
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should disable back button when cannot go back', () => {
      mockCanGoBack.mockReturnValue(false);
      render(<Navigation showBackButton={true} />);
      
      const backButton = screen.getByLabelText('Voltar');
      expect(backButton).toBeDisabled();
    });

    it('should call custom onBackClick when provided', () => {
      const customBackClick = vi.fn();
      mockCanGoBack.mockReturnValue(true);
      render(<Navigation showBackButton={true} onBackClick={customBackClick} />);
      
      const backButton = screen.getByLabelText('Voltar');
      fireEvent.click(backButton);
      
      expect(customBackClick).toHaveBeenCalled();
      expect(mockGoBack).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Items', () => {
    it('should render all navigation items with icons', () => {
      render(<Navigation />);
      
      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('⚔️')).toBeInTheDocument();
      expect(screen.getByText('🃏')).toBeInTheDocument();
      expect(screen.getByText('👤')).toBeInTheDocument();
    });

    it('should navigate to correct screens', () => {
      render(<Navigation />);
      
      fireEvent.click(screen.getByText('Início'));
      expect(mockNavigate).toHaveBeenCalledWith('home');
      
      fireEvent.click(screen.getByText('Jogar'));
      expect(mockNavigate).toHaveBeenCalledWith('matchmaking');
      
      fireEvent.click(screen.getByText('Deck'));
      expect(mockNavigate).toHaveBeenCalledWith('deck');
      
      fireEvent.click(screen.getByText('Perfil'));
      expect(mockNavigate).toHaveBeenCalledWith('profile');
    });

    it('should show active state for current screen', () => {
      vi.spyOn(useNavigationModule, 'useNavigation').mockReturnValue({
        ...mockUseNavigation,
        currentScreen: 'deck'
      });
      
      render(<Navigation />);
      
      const deckButton = screen.getByText('Deck').closest('button');
      expect(deckButton).toHaveAttribute('aria-current', 'page');
      
      const homeButton = screen.getByText('Início').closest('button');
      expect(homeButton).not.toHaveAttribute('aria-current');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Navigation />);
      
      expect(screen.getByLabelText('Início')).toBeInTheDocument();
      expect(screen.getByLabelText('Jogar')).toBeInTheDocument();
      expect(screen.getByLabelText('Deck')).toBeInTheDocument();
      expect(screen.getByLabelText('Perfil')).toBeInTheDocument();
    });

    it('should have proper ARIA current for active item', () => {
      render(<Navigation />);
      
      const homeButton = screen.getByLabelText('Início');
      expect(homeButton).toHaveAttribute('aria-current', 'page');
    });

    it('should have proper button roles', () => {
      render(<Navigation />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // 4 navigation items
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom className', () => {
      render(<Navigation className="custom-nav" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('navigation custom-nav');
    });

    it('should render navigation container', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });
});
