import { describe, it, expect } from 'vitest';
import { tokens } from '../tokens';

describe('Tokens - Cores da Marca', () => {
  it('should have all brand colors defined', () => {
    expect(tokens.colors.brand.verde).toBe('#00923F');
    expect(tokens.colors.brand.amarelo).toBe('#FFC400');
    expect(tokens.colors.brand.azul).toBe('#0A2A66');
    expect(tokens.colors.brand.vermelho).toBe('#C0392B');
    expect(tokens.colors.brand.cinza).toBe('#2E2E2E');
    expect(tokens.colors.brand.offWhite).toBe('#F4F4F4');
  });

  it('should have valid hex color format', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    
    Object.values(tokens.colors.brand).forEach(color => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});

describe('Tokens - Cores Neutras', () => {
  it('should have all neutral colors defined', () => {
    expect(tokens.colors.neutral[900]).toBe('#121212');
    expect(tokens.colors.neutral[700]).toBe('#2E2E2E');
    expect(tokens.colors.neutral[500]).toBe('#6B6B6B');
    expect(tokens.colors.neutral[300]).toBe('#BDBDBD');
    expect(tokens.colors.neutral[100]).toBe('#EDEDED');
  });

  it('should have valid hex color format for neutral colors', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    
    Object.values(tokens.colors.neutral).forEach(color => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});

describe('Tokens - Espaçamento', () => {
  it('should have all spacing values defined', () => {
    expect(tokens.spacing.xs).toBe(4);
    expect(tokens.spacing.sm).toBe(8);
    expect(tokens.spacing.md).toBe(12);
    expect(tokens.spacing.lg).toBe(16);
    expect(tokens.spacing.xl).toBe(24);
    expect(tokens.spacing.xxl).toBe(32);
  });

  it('should have positive spacing values', () => {
    Object.values(tokens.spacing).forEach(spacing => {
      expect(spacing).toBeGreaterThan(0);
    });
  });

  it('should have increasing spacing values', () => {
    const spacingValues = Object.values(tokens.spacing);
    for (let i = 1; i < spacingValues.length; i++) {
      expect(spacingValues[i]).toBeGreaterThan(spacingValues[i - 1]);
    }
  });
});

describe('Tokens - Raio de Borda', () => {
  it('should have all radius values defined', () => {
    expect(tokens.radius.sm).toBe(8);
    expect(tokens.radius.md).toBe(12);
    expect(tokens.radius.lg).toBe(16);
  });

  it('should have positive radius values', () => {
    Object.values(tokens.radius).forEach(radius => {
      expect(radius).toBeGreaterThan(0);
    });
  });

  it('should have increasing radius values', () => {
    expect(tokens.radius.md).toBeGreaterThan(tokens.radius.sm);
    expect(tokens.radius.lg).toBeGreaterThan(tokens.radius.md);
  });
});

describe('Tokens - Elevação', () => {
  it('should have card elevation defined', () => {
    expect(tokens.elevation.card.idle).toBeDefined();
    expect(tokens.elevation.card.hover).toBeDefined();
  });

  it('should have modal elevation defined', () => {
    expect(tokens.elevation.modal).toBeDefined();
  });

  it('should have valid shadow format', () => {
    const shadowRegex = /^0 \d+px \d+px rgba\(0, 0, 0, 0\.\d+\)$/;
    
    expect(tokens.elevation.card.idle).toMatch(shadowRegex);
    expect(tokens.elevation.card.hover).toMatch(shadowRegex);
    expect(tokens.elevation.modal).toMatch(shadowRegex);
  });
});

describe('Tokens - Movimento', () => {
  it('should have motion curves defined', () => {
    expect(tokens.motion.standard).toEqual([0.2, 0, 0, 1]);
    expect(tokens.motion.decelerate).toEqual([0, 0, 0, 1]);
    expect(tokens.motion.anticipate).toEqual([0.2, 0.8, 0.2, 1]);
  });

  it('should have duration values defined', () => {
    expect(tokens.motion.duration.fast).toBe(150);
    expect(tokens.motion.duration.base).toBe(220);
    expect(tokens.motion.duration.slow).toBe(400);
  });

  it('should have positive duration values', () => {
    Object.values(tokens.motion.duration).forEach(duration => {
      expect(duration).toBeGreaterThan(0);
    });
  });

  it('should have increasing duration values', () => {
    expect(tokens.motion.duration.base).toBeGreaterThan(tokens.motion.duration.fast);
    expect(tokens.motion.duration.slow).toBeGreaterThan(tokens.motion.duration.base);
  });
});

describe('Tokens - Tipografia', () => {
  it('should have all typography styles defined', () => {
    expect(tokens.typography.display).toBeDefined();
    expect(tokens.typography.h1).toBeDefined();
    expect(tokens.typography.h2).toBeDefined();
    expect(tokens.typography.body).toBeDefined();
    expect(tokens.typography.caption).toBeDefined();
    expect(tokens.typography.micro).toBeDefined();
  });

  it('should have correct font sizes', () => {
    expect(tokens.typography.display.fontSize).toBe(32);
    expect(tokens.typography.h1.fontSize).toBe(24);
    expect(tokens.typography.h2.fontSize).toBe(20);
    expect(tokens.typography.body.fontSize).toBe(16);
    expect(tokens.typography.caption.fontSize).toBe(14);
    expect(tokens.typography.micro.fontSize).toBe(12);
  });

  it('should have correct line heights', () => {
    expect(tokens.typography.display.lineHeight).toBe(1.2);
    expect(tokens.typography.h1.lineHeight).toBe(1.3);
    expect(tokens.typography.h2.lineHeight).toBe(1.4);
    expect(tokens.typography.body.lineHeight).toBe(1.5);
    expect(tokens.typography.caption.lineHeight).toBe(1.4);
    expect(tokens.typography.micro.lineHeight).toBe(1.3);
  });

  it('should have positive font sizes', () => {
    Object.values(tokens.typography).forEach(style => {
      expect(style.fontSize).toBeGreaterThan(0);
    });
  });

  it('should have positive line heights', () => {
    Object.values(tokens.typography).forEach(style => {
      expect(style.lineHeight).toBeGreaterThan(0);
    });
  });
});

describe('Tokens - Estrutura Geral', () => {
  it('should have all main categories defined', () => {
    expect(tokens.colors).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.radius).toBeDefined();
    expect(tokens.elevation).toBeDefined();
    expect(tokens.motion).toBeDefined();
    expect(tokens.typography).toBeDefined();
  });

  it('should have consistent structure', () => {
    expect(tokens).toBeDefined();
    expect(typeof tokens).toBe('object');
    expect(tokens).not.toBeNull();
  });
});
