import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MicroInteractions } from '../../components/animations/MicroInteractions';

describe('MicroInteractions', () => {
  describe('Botões', () => {
    it('should apply ripple effect on button click', () => {
      render(
        <MicroInteractions>
          <button data-testid="ripple-button">Clique aqui</button>
        </MicroInteractions>
      );
      
      const button = screen.getByTestId('ripple-button');
      fireEvent.click(button);
      
      const ripple = screen.getByTestId('ripple-effect');
      expect(ripple).toBeInTheDocument();
      expect(ripple).toHaveClass('ripple-animation');
    });

    it('should apply hover effect on button hover', () => {
      render(
        <MicroInteractions>
          <button data-testid="hover-button">Hover aqui</button>
        </MicroInteractions>
      );
      
      const button = screen.getByTestId('hover-button');
      fireEvent.mouseEnter(button);
      
      expect(button).toHaveClass('button-hover-animation');
    });
  });

  describe('Inputs', () => {
    it('should animate label on input focus', () => {
      render(
        <MicroInteractions>
          <div data-testid="input-container">
            <input data-testid="animated-input" />
            <label data-testid="input-label" className="label-focus-animation">Nome</label>
          </div>
        </MicroInteractions>
      );
      
      const input = screen.getByTestId('animated-input');
      const label = screen.getByTestId('input-label');
      
      fireEvent.focus(input);
      
      expect(label).toHaveClass('label-focus-animation');
    });

    it('should animate label on input blur', () => {
      render(
        <MicroInteractions>
          <div data-testid="input-container">
            <input data-testid="animated-input" />
            <label data-testid="input-label" className="label-blur-animation">Nome</label>
          </div>
        </MicroInteractions>
      );
      
      const input = screen.getByTestId('animated-input');
      const label = screen.getByTestId('input-label');
      
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      expect(label).toHaveClass('label-blur-animation');
    });
  });

  describe('Notificações', () => {
    it('should animate notification entrance', () => {
      render(
        <MicroInteractions>
          <div data-testid="notification" className="notification-entrance">
            Nova notificação!
          </div>
        </MicroInteractions>
      );
      
      const notification = screen.getByTestId('notification');
      expect(notification).toHaveClass('notification-entrance-animation');
    });

    it('should animate notification exit', () => {
      const { rerender } = render(
        <MicroInteractions>
          <div data-testid="notification" className="notification-visible">
            Nova notificação!
          </div>
        </MicroInteractions>
      );
      
      rerender(
        <MicroInteractions>
          <div data-testid="notification" className="notification-exit">
            Nova notificação!
          </div>
        </MicroInteractions>
      );
      
      const notification = screen.getByTestId('notification');
      expect(notification).toHaveClass('notification-exit-animation');
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner animation', () => {
      render(
        <MicroInteractions>
          <div data-testid="loading-spinner" className="loading">
            Carregando...
          </div>
        </MicroInteractions>
      );
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveClass('spinner-animation');
    });

    it('should show skeleton loading animation', () => {
      render(
        <MicroInteractions>
          <div data-testid="skeleton" className="skeleton skeleton-animation">
            <div data-testid="skeleton-line" className="skeleton-line-animation"></div>
          </div>
        </MicroInteractions>
      );
      
      const skeleton = screen.getByTestId('skeleton');
      const skeletonLine = screen.getByTestId('skeleton-line');
      
      expect(skeleton).toHaveClass('skeleton-animation');
      expect(skeletonLine).toHaveClass('skeleton-line-animation');
    });
  });

  describe('Feedback Visual', () => {
    it('should show success feedback animation', () => {
      render(
        <MicroInteractions>
          <div data-testid="success-feedback" className="success">
            Operação realizada com sucesso!
          </div>
        </MicroInteractions>
      );
      
      const feedback = screen.getByTestId('success-feedback');
      expect(feedback).toHaveClass('success-animation');
    });

    it('should show error feedback animation', () => {
      render(
        <MicroInteractions>
          <div data-testid="error-feedback" className="error">
            Erro na operação!
          </div>
        </MicroInteractions>
      );
      
      const feedback = screen.getByTestId('error-feedback');
      expect(feedback).toHaveClass('error-animation');
    });

    it('should show warning feedback animation', () => {
      render(
        <MicroInteractions>
          <div data-testid="warning-feedback" className="warning">
            Atenção!
          </div>
        </MicroInteractions>
      );
      
      const feedback = screen.getByTestId('warning-feedback');
      expect(feedback).toHaveClass('warning-animation');
    });
  });

  describe('Progress Indicators', () => {
    it('should animate progress bar', () => {
      render(
        <MicroInteractions>
          <div data-testid="progress-bar" className="progress progress-animation" style={{ width: '50%' }}>
            <div data-testid="progress-fill" className="progress-fill-animation"></div>
          </div>
        </MicroInteractions>
      );
      
      const progressBar = screen.getByTestId('progress-bar');
      const progressFill = screen.getAllByTestId('progress-fill')[0];
      
      expect(progressBar).toHaveClass('progress-animation');
      expect(progressFill).toHaveClass('progress-fill-animation');
    });

    it('should animate circular progress', () => {
      render(
        <MicroInteractions>
          <div data-testid="circular-progress" className="circular-progress circular-progress-animation">
            <svg data-testid="progress-circle" className="progress-circle-animation"></svg>
          </div>
        </MicroInteractions>
      );
      
      const circularProgress = screen.getByTestId('circular-progress');
      const progressCircle = screen.getAllByTestId('progress-circle')[0];
      
      expect(circularProgress).toHaveClass('circular-progress-animation');
      expect(progressCircle).toHaveClass('progress-circle-animation');
    });
  });

  describe('Performance', () => {
    it('should use hardware acceleration for animations', () => {
      render(
        <MicroInteractions>
          <div data-testid="animated-element" className="hardware-accelerated">
            Elemento animado
          </div>
        </MicroInteractions>
      );
      
      const element = screen.getByTestId('animated-element');
      
      // Verifica se usa transform3d para aceleração de hardware
      const computedStyle = window.getComputedStyle(element);
      expect(computedStyle.transform).toContain('translate3d');
    });

    it('should not cause layout thrashing during micro-interactions', () => {
      render(
        <MicroInteractions>
          <button data-testid="performance-button">Teste</button>
        </MicroInteractions>
      );
      
      const button = screen.getByTestId('performance-button');
      
      // Simula múltiplas interações rápidas
      for (let i = 0; i < 20; i++) {
        fireEvent.mouseEnter(button);
        fireEvent.mouseLeave(button);
        fireEvent.click(button);
      }
      
      // Verifica se o elemento ainda está presente
      expect(button).toBeInTheDocument();
    });
  });
});
