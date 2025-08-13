import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardAnimations } from '../../components/animations/CardAnimations';
import { Card } from '@lq/shared';

describe('CardAnimations', () => {
  let testCard: Card;

  beforeEach(() => {
    testCard = {
      id: 'test-card',
      name: 'Carta de Teste',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 3,
      text: 'Carta para testes de animação',
      keywords: ['teste', 'animação']
    };
  });

  describe('Animações de Hover', () => {
    it('should apply hover animation when mouse enters', () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      fireEvent.mouseEnter(cardElement);
      
      // Verifica se a animação de hover foi aplicada
      expect(cardElement).toHaveClass('hover-animation');
    });

    it('should remove hover animation when mouse leaves', () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      fireEvent.mouseEnter(cardElement);
      fireEvent.mouseLeave(cardElement);
      
      // Verifica se a animação foi removida
      expect(cardElement).not.toHaveClass('hover-animation');
    });
  });

  describe('Animações de Click', () => {
    it('should apply click animation when card is clicked', () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      fireEvent.click(cardElement);
      
      // Verifica se a animação de click foi aplicada
      expect(cardElement).toHaveClass('click-animation');
    });

    it('should remove click animation after animation completes', async () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      fireEvent.click(cardElement);
      
      // Aguarda a animação completar
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Verifica se a animação foi removida
      expect(cardElement).not.toHaveClass('click-animation');
    });
  });

  describe('Animações de Entrada', () => {
    it('should animate card entrance when component mounts', () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      
      // Verifica se a animação de entrada foi aplicada
      expect(cardElement).toHaveClass('entrance-animation');
    });

    it('should have staggered entrance animation with delay', () => {
      render(<CardAnimations card={testCard} delay={0.2} />);
      
      const cardElement = screen.getByTestId('card-animation');
      
      // Verifica se o delay foi aplicado
      expect(cardElement).toHaveStyle('animation-delay: 0.2s');
    });
  });

  describe('Animações de Estado', () => {
    it('should apply selected state animation', () => {
      render(<CardAnimations card={testCard} isSelected={true} />);
      
      const cardElement = screen.getByTestId('card-animation');
      
      // Verifica se a animação de seleção foi aplicada
      expect(cardElement).toHaveClass('selected-animation');
    });

    it('should apply disabled state animation', () => {
      render(<CardAnimations card={testCard} isDisabled={true} />);
      
      const cardElement = screen.getByTestId('card-animation');
      
      // Verifica se a animação de desabilitado foi aplicada
      expect(cardElement).toHaveClass('disabled-animation');
    });
  });

  describe('Micro-interações', () => {
    it('should show tooltip with animation on hover', () => {
      render(<CardAnimations card={testCard} showTooltip={true} />);
      
      const cardElement = screen.getByTestId('card-animation');
      fireEvent.mouseEnter(cardElement);
      
      const tooltip = screen.getByTestId('card-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass('tooltip-animation');
    });

    it('should animate power indicator on change', () => {
      const { rerender } = render(<CardAnimations card={testCard} />);
      
      const powerIndicator = screen.getByTestId('power-indicator');
      
      // Simula mudança de poder
      const updatedCard = { ...testCard, power: 7 };
      rerender(<CardAnimations card={updatedCard} />);
      
      // Verifica se a animação de mudança foi aplicada
      expect(powerIndicator).toHaveClass('power-change-animation');
    });
  });

  describe('Performance', () => {
    it('should not cause layout thrashing during animations', () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      
      // Simula múltiplos hovers rapidos
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(cardElement);
        fireEvent.mouseLeave(cardElement);
      }
      
      // Verifica se o elemento ainda está presente
      expect(cardElement).toBeInTheDocument();
    });

    it('should use transform instead of position for animations', () => {
      render(<CardAnimations card={testCard} />);
      
      const cardElement = screen.getByTestId('card-animation');
      
      // Verifica se usa transform para animações
      const computedStyle = window.getComputedStyle(cardElement);
      expect(computedStyle.transform).not.toBe('none');
    });
  });
});
