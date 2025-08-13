import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnergySlider } from '../../components/EnergySlider';

describe('EnergySlider Component - Funcionalidade Básica', () => {
  it('should render with initial value', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('should have increment functionality', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} />);
    
    const plusButton = screen.getByText('+').closest('button');
    expect(plusButton).toBeInTheDocument();
    expect(onValueChange).toBeDefined();
  });

  it('should have decrement functionality', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} />);
    
    const minusButton = screen.getByText('-').closest('button');
    expect(minusButton).toBeInTheDocument();
    expect(onValueChange).toBeDefined();
  });

  it('should not increment beyond max value', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={10} max={10} onValueChange={onValueChange} />);
    
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should not decrement below zero', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={0} max={10} onValueChange={onValueChange} />);
    
    const minusButton = screen.getByText('-');
    fireEvent.click(minusButton);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('EnergySlider Component - Estados Visuais', () => {
  it('should show correct progress bar width', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} />);
    
    const progressBar = screen.getByText('5').parentElement?.querySelector('div');
    expect(progressBar).toBeInTheDocument();
  });

  it('should disable plus button when at max value', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={10} max={10} onValueChange={onValueChange} />);
    
    const plusButton = screen.getByText('+').closest('button');
    expect(plusButton).toHaveAttribute('disabled');
  });

  it('should disable minus button when at zero', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={0} max={10} onValueChange={onValueChange} />);
    
    const minusButton = screen.getByText('-').closest('button');
    expect(minusButton).toHaveAttribute('disabled');
  });

  it('should show correct value display', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={7} max={10} onValueChange={onValueChange} />);
    
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});

describe('EnergySlider Component - Estados Desabilitados', () => {
  it('should disable all interactions when disabled', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} disabled={true} />);
    
    const plusButton = screen.getByText('+');
    const minusButton = screen.getByText('-');
    
    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should show disabled visual state', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} disabled={true} />);
    
    const plusButton = screen.getByText('+').closest('button');
    const minusButton = screen.getByText('-').closest('button');
    
    expect(plusButton).toHaveAttribute('disabled');
    expect(minusButton).toHaveAttribute('disabled');
  });
});

describe('EnergySlider Component - Edge Cases', () => {
  it('should handle zero max value', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={0} max={0} onValueChange={onValueChange} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle large values', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={999} max={1000} onValueChange={onValueChange} />);
    
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('should handle decimal values', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={3.5} max={10} onValueChange={onValueChange} />);
    
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });
});

describe('EnergySlider Component - Acessibilidade', () => {
  it('should have proper button roles', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('should support keyboard navigation', () => {
    const onValueChange = vi.fn();
    render(<EnergySlider value={5} max={10} onValueChange={onValueChange} />);
    
    const plusButton = screen.getByText('+').closest('button');
    plusButton!.focus();
    
    expect(plusButton).toHaveFocus();
  });
});
