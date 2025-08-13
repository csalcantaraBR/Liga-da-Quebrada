import React from 'react';

interface EnergySliderProps {
  value: number;
  max: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export const EnergySlider: React.FC<EnergySliderProps> = ({ 
  value, 
  max, 
  onValueChange, 
  disabled = false 
}) => {
  const handleIncrement = () => {
    if (!disabled && value < max) {
      onValueChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (!disabled && value > 0) {
      onValueChange(value - 1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    }}>
      <button
        onClick={handleDecrement}
        disabled={disabled || value === 0}
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: '#BDBDBD',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: (disabled || value === 0) ? 0.5 : 1,
          cursor: (disabled || value === 0) ? 'default' : 'pointer',
          fontSize: 20,
          fontWeight: 'bold'
        }}
      >
        -
      </button>

      <div style={{
        flex: 1,
        height: 8,
        backgroundColor: '#BDBDBD',
        borderRadius: 4,
        margin: '0 16px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(value / max) * 100}%`,
          height: '100%',
          backgroundColor: '#FFC400'
        }} />
      </div>

      <div style={{
        fontSize: 16,
        fontWeight: 'bold',
        margin: '0 16px',
        minWidth: 30,
        textAlign: 'center'
      }}>
        {value}
      </div>

      <button
        onClick={handleIncrement}
        disabled={disabled || value === max}
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: '#BDBDBD',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: (disabled || value === max) ? 0.5 : 1,
          cursor: (disabled || value === max) ? 'default' : 'pointer',
          fontSize: 20,
          fontWeight: 'bold'
        }}
      >
        +
      </button>
    </div>
  );
};
