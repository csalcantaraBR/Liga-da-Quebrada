import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HUD } from '../../components/HUD';

describe('HUD Component - Renderização Básica', () => {
  it('should render all HUD elements', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    expect(screen.getByText('Respeito')).toBeInTheDocument();
    expect(screen.getByText('Energia')).toBeInTheDocument();
    expect(screen.getByText('Rodada')).toBeInTheDocument();
  });

  it('should display respect value correctly', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    expect(screen.getByText('8/12')).toBeInTheDocument();
  });

  it('should display energy value correctly', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display round information correctly', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    expect(screen.getByText('2/4')).toBeInTheDocument();
  });
});

describe('HUD Component - Estados de Respeito', () => {
  it('should handle zero respect', () => {
    render(<HUD respect={0} energy={5} round={2} />);
    
    expect(screen.getByText('0/12')).toBeInTheDocument();
  });

  it('should handle maximum respect', () => {
    render(<HUD respect={12} energy={5} round={2} />);
    
    expect(screen.getByText('12/12')).toBeInTheDocument();
  });

  it('should handle partial respect', () => {
    render(<HUD respect={6} energy={5} round={2} />);
    
    expect(screen.getByText('6/12')).toBeInTheDocument();
  });

  it('should handle respect overflow', () => {
    render(<HUD respect={15} energy={5} round={2} />);
    
    expect(screen.getByText('15/12')).toBeInTheDocument();
  });
});

describe('HUD Component - Estados de Energia', () => {
  it('should handle zero energy', () => {
    render(<HUD respect={8} energy={0} round={2} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle high energy', () => {
    render(<HUD respect={8} energy={10} round={2} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle negative energy', () => {
    render(<HUD respect={8} energy={-2} round={2} />);
    
    expect(screen.getByText('-2')).toBeInTheDocument();
  });
});

describe('HUD Component - Estados de Rodada', () => {
  it('should use default max round when not provided', () => {
    render(<HUD respect={8} energy={5} round={1} />);
    
    expect(screen.getByText('1/4')).toBeInTheDocument();
  });

  it('should use custom max round', () => {
    render(<HUD respect={8} energy={5} round={3} maxRound={6} />);
    
    expect(screen.getByText('3/6')).toBeInTheDocument();
  });

  it('should handle first round', () => {
    render(<HUD respect={8} energy={5} round={1} maxRound={5} />);
    
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('should handle last round', () => {
    render(<HUD respect={8} energy={5} round={5} maxRound={5} />);
    
    expect(screen.getByText('5/5')).toBeInTheDocument();
  });

  it('should handle round overflow', () => {
    render(<HUD respect={8} energy={5} round={7} maxRound={5} />);
    
    expect(screen.getByText('7/5')).toBeInTheDocument();
  });
});

describe('HUD Component - Layout e Estrutura', () => {
  it('should have correct container structure', () => {
    const { container } = render(<HUD respect={8} energy={5} round={2} />);
    
    const hudContainer = container.firstChild;
    expect(hudContainer).toBeInTheDocument();
  });

  it('should display all three sections', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    const respectSection = screen.getByText('Respeito').closest('div');
    const energySection = screen.getByText('Energia').closest('div');
    const roundSection = screen.getByText('Rodada').closest('div');
    
    expect(respectSection).toBeInTheDocument();
    expect(energySection).toBeInTheDocument();
    expect(roundSection).toBeInTheDocument();
  });
});

describe('HUD Component - Edge Cases', () => {
  it('should handle all zero values', () => {
    render(<HUD respect={0} energy={0} round={0} />);
    
    expect(screen.getByText('0/12')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0/4')).toBeInTheDocument();
  });

  it('should handle very large values', () => {
    render(<HUD respect={999} energy={999} round={999} maxRound={1000} />);
    
    expect(screen.getByText('999/12')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('999/1000')).toBeInTheDocument();
  });

  it('should handle decimal values', () => {
    render(<HUD respect={5.5} energy={3.7} round={2.1} maxRound={4.5} />);
    
    expect(screen.getByText('5.5/12')).toBeInTheDocument();
    expect(screen.getByText('3.7')).toBeInTheDocument();
    expect(screen.getByText('2.1/4.5')).toBeInTheDocument();
  });
});

describe('HUD Component - Acessibilidade', () => {
  it('should have semantic structure', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    // Verificar se os textos estão sendo renderizados corretamente
    expect(screen.getByText('Respeito')).toBeInTheDocument();
    expect(screen.getByText('Energia')).toBeInTheDocument();
    expect(screen.getByText('Rodada')).toBeInTheDocument();
  });

  it('should display values clearly', () => {
    render(<HUD respect={8} energy={5} round={2} />);
    
    // Verificar se os valores estão sendo exibidos claramente
    expect(screen.getByText('8/12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2/4')).toBeInTheDocument();
  });
});
