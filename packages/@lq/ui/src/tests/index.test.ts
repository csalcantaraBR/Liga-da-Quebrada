import { describe, it, expect } from 'vitest';

describe('UI Package Exports', () => {
  it('should export all components', async () => {
    const ui = await import('../index');
    
    // Verificar se todos os componentes estão sendo exportados
    expect(ui.Card).toBeDefined();
    expect(ui.HUD).toBeDefined();
    expect(ui.EnergySlider).toBeDefined();
    expect(ui.BottomBar).toBeDefined();
    expect(ui.TopBar).toBeDefined();
    expect(ui.AnimatedCard).toBeDefined();
  });

  it('should export hooks', async () => {
    const ui = await import('../index');
    
    expect(ui.useAnimation).toBeDefined();
  });

  it('should export tokens', async () => {
    const ui = await import('../index');
    
    expect(ui.tokens).toBeDefined();
  });

  it('should have correct number of exports', async () => {
    const ui = await import('../index');
    
    const exports = Object.keys(ui);
    expect(exports).toHaveLength(8); // 6 componentes + 1 hook + 1 tokens
  });
});
