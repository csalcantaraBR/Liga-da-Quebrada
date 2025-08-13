import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageTransitions } from '../../components/animations/PageTransitions';

describe('PageTransitions', () => {
  describe('Animações de Entrada', () => {
    it('should animate page entrance when component mounts', () => {
      render(
        <PageTransitions>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const pageElement = screen.getByTestId('page-transition');
      
      // Verifica se a animação de entrada foi aplicada
      expect(pageElement).toHaveClass('page-entrance-animation');
    });

    it('should have different entrance animations for different pages', () => {
      const { rerender } = render(
        <PageTransitions pageType="home">
          <div data-testid="page-content">Home</div>
        </PageTransitions>
      );
      
      let pageElement = screen.getByTestId('page-transition');
      expect(pageElement).toHaveClass('home-entrance');
      
      rerender(
        <PageTransitions pageType="game">
          <div data-testid="page-content">Game</div>
        </PageTransitions>
      );
      
      pageElement = screen.getByTestId('page-transition');
      expect(pageElement).toHaveClass('game-entrance');
    });
  });

  describe('Animações de Saída', () => {
    it('should animate page exit when unmounting', () => {
      const { unmount } = render(
        <PageTransitions>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const pageElement = screen.getByTestId('page-transition');
      
      // Simula saída da página
      unmount();
      
      // Verifica se a animação de saída foi aplicada
      expect(pageElement).toHaveClass('page-exit-animation');
    });
  });

  describe('Animações de Loading', () => {
    it('should show loading animation when page is loading', () => {
      render(
        <PageTransitions isLoading={true}>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const loadingElement = screen.getByTestId('page-loading');
      expect(loadingElement).toBeInTheDocument();
      expect(loadingElement).toHaveClass('loading-animation');
    });

    it('should hide loading animation when page is loaded', () => {
      const { rerender } = render(
        <PageTransitions isLoading={true}>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      rerender(
        <PageTransitions isLoading={false}>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const loadingElement = screen.queryByTestId('page-loading');
      expect(loadingElement).not.toBeInTheDocument();
    });
  });

  describe('Animações de Erro', () => {
    it('should show error animation when page has error', () => {
      render(
        <PageTransitions hasError={true}>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const errorElement = screen.getByTestId('page-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass('error-animation');
    });
  });

  describe('Performance', () => {
    it('should use will-change for performance optimization', () => {
      render(
        <PageTransitions>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const pageElement = screen.getByTestId('page-transition');
      
      // Verifica se will-change foi aplicado
      const computedStyle = window.getComputedStyle(pageElement);
      expect(computedStyle.willChange).toContain('transform');
    });

    it('should not cause layout thrashing during transitions', () => {
      render(
        <PageTransitions>
          <div data-testid="page-content">Conteúdo da página</div>
        </PageTransitions>
      );
      
      const pageElement = screen.getByTestId('page-transition');
      
      // Verifica se usa transform para animações
      const computedStyle = window.getComputedStyle(pageElement);
      expect(computedStyle.transform).not.toBe('none');
    });
  });
});
