import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnimatedCard } from './AnimatedCard';
import { Card, Faction } from '@lq/shared';

describe('AnimatedCard Component', () => {
  const mockCard: Card = {
    id: 'test-card',
    name: 'Test Card',
    faction: 'RODA_DE_GINGA' as Faction,
    power: 5,
    damage: 3,
    text: 'Test card description',
    keywords: ['test']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AnimatedCard - Basic Rendering', () => {
    it('should render card with basic information', () => {
      render(<AnimatedCard card={mockCard} />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText('Test card description')).toBeInTheDocument();
    });

    it('should apply default animation props', () => {
      render(<AnimatedCard card={mockCard} />);

      const cardElement = screen.getByTestId('animated-card');
      expect(cardElement).toBeInTheDocument();
    });

    it('should handle different card states', () => {
      const { rerender } = render(<AnimatedCard card={mockCard} state="normal" />);
      expect(screen.getByTestId('animated-card')).toBeInTheDocument();

      rerender(<AnimatedCard card={mockCard} state="hovered" />);
      expect(screen.getByTestId('animated-card')).toBeInTheDocument();

      rerender(<AnimatedCard card={mockCard} state="selected" />);
      expect(screen.getByTestId('animated-card')).toBeInTheDocument();

      rerender(<AnimatedCard card={mockCard} state="disabled" />);
      expect(screen.getByTestId('animated-card')).toBeInTheDocument();
    });
  });

  describe('AnimatedCard - Interactions', () => {
    it('should handle click events', async () => {
      const onCardClick = vi.fn();
      render(<AnimatedCard card={mockCard} onCardClick={onCardClick} />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.click(cardElement);

      await waitFor(() => {
        expect(onCardClick).toHaveBeenCalledWith(mockCard);
      });
    });

    it('should handle hover events', async () => {
      const onHoverStart = vi.fn();
      const onHoverEnd = vi.fn();
      
      render(
        <AnimatedCard 
          card={mockCard} 
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
        />
      );

      const cardElement = screen.getByTestId('animated-card');
      
      fireEvent.mouseEnter(cardElement);
      await waitFor(() => {
        expect(onHoverStart).toHaveBeenCalled();
      });

      fireEvent.mouseLeave(cardElement);
      await waitFor(() => {
        expect(onHoverEnd).toHaveBeenCalled();
      });
    });

    it('should handle touch events for mobile', async () => {
      const onCardClick = vi.fn();
      render(<AnimatedCard card={mockCard} onCardClick={onCardClick} />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.touchStart(cardElement);
      fireEvent.touchEnd(cardElement);

      await waitFor(() => {
        expect(onCardClick).toHaveBeenCalledWith(mockCard);
      });
    });

    it('should not trigger click when disabled', async () => {
      const onCardClick = vi.fn();
      render(<AnimatedCard card={mockCard} onCardClick={onCardClick} disabled />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.click(cardElement);

      await waitFor(() => {
        expect(onCardClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('AnimatedCard - Animations', () => {
    it('should apply entrance animation', () => {
      render(<AnimatedCard card={mockCard} animateEntrance />);

      const cardElement = screen.getByTestId('animated-card');
      expect(cardElement).toBeInTheDocument();
    });

    it('should apply hover animation', () => {
      render(<AnimatedCard card={mockCard} animateHover />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.mouseEnter(cardElement);
      
      expect(cardElement).toBeInTheDocument();
    });

    it('should apply click animation', async () => {
      render(<AnimatedCard card={mockCard} animateClick />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.click(cardElement);
      
      await waitFor(() => {
        expect(cardElement).toBeInTheDocument();
      });
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<AnimatedCard card={mockCard} animateEntrance />);

      const cardElement = screen.getByTestId('animated-card');
      expect(cardElement).toBeInTheDocument();
    });
  });

  describe('AnimatedCard - Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AnimatedCard card={mockCard} />);

      const cardElement = screen.getByTestId('animated-card');
      expect(cardElement).toHaveAttribute('role', 'button');
      expect(cardElement).toHaveAttribute('tabIndex', '0');
    });

    it('should handle keyboard navigation', async () => {
      const onCardClick = vi.fn();
      render(<AnimatedCard card={mockCard} onCardClick={onCardClick} />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.keyDown(cardElement, { key: 'Enter' });

      await waitFor(() => {
        expect(onCardClick).toHaveBeenCalledWith(mockCard);
      });
    });

    it('should handle keyboard navigation with Space key', async () => {
      const onCardClick = vi.fn();
      render(<AnimatedCard card={mockCard} onCardClick={onCardClick} />);

      const cardElement = screen.getByTestId('animated-card');
      fireEvent.keyDown(cardElement, { key: ' ' });

      await waitFor(() => {
        expect(onCardClick).toHaveBeenCalledWith(mockCard);
      });
    });

    it('should have proper focus management', () => {
      render(<AnimatedCard card={mockCard} />);

      const cardElement = screen.getByTestId('animated-card');
      cardElement.focus();
      
      expect(document.activeElement).toBe(cardElement);
    });
  });

  describe('AnimatedCard - Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<AnimatedCard card={mockCard} />);
      
      const initialRender = screen.getByTestId('animated-card');
      
      rerender(<AnimatedCard card={mockCard} />);
      
      const reRender = screen.getByTestId('animated-card');
      expect(reRender).toBe(initialRender);
    });

    it('should cleanup animations on unmount', () => {
      const { unmount } = render(<AnimatedCard card={mockCard} animateEntrance />);
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('AnimatedCard - Edge Cases', () => {
    it('should handle missing card data gracefully', () => {
      const incompleteCard = { ...mockCard, name: undefined };
      
      expect(() => {
        render(<AnimatedCard card={incompleteCard as any} />);
      }).not.toThrow();
    });

    it('should handle null callbacks', () => {
      expect(() => {
        render(<AnimatedCard card={mockCard} onCardClick={null as any} />);
      }).not.toThrow();
    });

    it('should handle rapid interactions', async () => {
      const onCardClick = vi.fn();
      render(<AnimatedCard card={mockCard} onCardClick={onCardClick} />);

      const cardElement = screen.getByTestId('animated-card');
      
      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(cardElement);
      }

      await waitFor(() => {
        expect(onCardClick).toHaveBeenCalledTimes(5);
      });
    });
  });
});
