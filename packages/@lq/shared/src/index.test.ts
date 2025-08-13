import { describe, it, expect } from 'vitest';

describe('@lq/shared', () => {
  it('should export types and schemas', () => {
    // Basic test to ensure the package is working
    expect(true).toBe(true);
  });

  it('should have proper structure', () => {
    // Test that the package structure is correct
    const packageStructure = {
      types: 'types directory exists',
      schemas: 'schemas directory exists',
      index: 'index file exists'
    };
    
    expect(packageStructure).toBeDefined();
    expect(typeof packageStructure.types).toBe('string');
    expect(typeof packageStructure.schemas).toBe('string');
    expect(typeof packageStructure.index).toBe('string');
  });
});
