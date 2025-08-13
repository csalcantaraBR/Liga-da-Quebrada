export const tokens = {
  colors: {
    brand: {
      verde: '#00923F',
      amarelo: '#FFC400',
      azul: '#0A2A66',
      vermelho: '#C0392B',
      cinza: '#2E2E2E',
      offWhite: '#F4F4F4'
    },
    neutral: {
      900: '#121212',
      700: '#2E2E2E',
      500: '#6B6B6B',
      300: '#BDBDBD',
      100: '#EDEDED'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  elevation: {
    card: {
      idle: '0 2px 6px rgba(0, 0, 0, 0.15)',
      hover: '0 6px 18px rgba(0, 0, 0, 0.25)'
    },
    modal: '0 24px 48px rgba(0, 0, 0, 0.35)'
  },
  motion: {
    standard: [0.2, 0, 0, 1],
    decelerate: [0, 0, 0, 1],
    anticipate: [0.2, 0.8, 0.2, 1],
    duration: {
      fast: 150,
      base: 220,
      slow: 400
    }
  },
  typography: {
    display: {
      fontSize: 32,
      lineHeight: 1.2
    },
    h1: {
      fontSize: 24,
      lineHeight: 1.3
    },
    h2: {
      fontSize: 20,
      lineHeight: 1.4
    },
    body: {
      fontSize: 16,
      lineHeight: 1.5
    },
    caption: {
      fontSize: 14,
      lineHeight: 1.4
    },
    micro: {
      fontSize: 12,
      lineHeight: 1.3
    }
  }
};
