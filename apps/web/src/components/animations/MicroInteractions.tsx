import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroInteractionsProps {
  children: React.ReactNode;
}

export const MicroInteractions: React.FC<MicroInteractionsProps> = ({ children }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [hoverStates, setHoverStates] = useState<Set<string>>(new Set());
  const [focusStates, setFocusStates] = useState<Set<string>>(new Set());
  const rippleId = useRef(0);

  // Animações de ripple
  const rippleVariants = {
    initial: {
      scale: 0,
      opacity: 1
    },
    animate: {
      scale: 4,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  // Animações de hover
  const hoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  // Animações de progress
  const progressVariants = {
    animate: {
      width: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut" as const
      }
    }
  };

  // Animações de progress circular
  const circularProgressVariants = {
    animate: {
      strokeDasharray: [0, 283], // Circunferência do círculo
      transition: {
        duration: 2,
        ease: "easeInOut" as const
      }
    }
  };

  // Função para criar ripple effect
  const createRipple = (event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      id: rippleId.current++,
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove o ripple após a animação
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  // Função para gerenciar hover
  const handleMouseEnter = (event: React.MouseEvent) => {
    const elementId = event.currentTarget.getAttribute('data-testid') || 'unknown';
    setHoverStates(prev => new Set(prev).add(elementId));
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    const elementId = event.currentTarget.getAttribute('data-testid') || 'unknown';
    setHoverStates(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  };

  // Função para gerenciar focus
  const handleFocus = (event: React.FocusEvent) => {
    const elementId = event.currentTarget.getAttribute('data-testid') || 'unknown';
    setFocusStates(prev => new Set(prev).add(elementId));
  };

  const handleBlur = (event: React.FocusEvent) => {
    const elementId = event.currentTarget.getAttribute('data-testid') || 'unknown';
    setFocusStates(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  };

  // Clona os children e adiciona as animações
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const childProps = child.props;
    const elementId = childProps['data-testid'] || 'unknown';
    const isHovered = hoverStates.has(elementId);
    const isFocused = focusStates.has(elementId);

    // Adiciona classes de animação baseadas no estado
    const className = `${childProps.className || ''} ${
      isHovered ? 'button-hover-animation' : ''
    } ${
      isFocused ? 'label-focus-animation' : ''
    } ${
      childProps.className?.includes('notification-entrance') ? 'notification-entrance-animation' : ''
    } ${
      childProps.className?.includes('notification-exit') ? 'notification-exit-animation' : ''
    } ${
      childProps.className?.includes('loading') ? 'spinner-animation' : ''
    } ${
      childProps.className?.includes('skeleton') ? 'skeleton-animation' : ''
    } ${
      childProps.className?.includes('success') ? 'success-animation' : ''
    } ${
      childProps.className?.includes('error') ? 'error-animation' : ''
    } ${
      childProps.className?.includes('warning') ? 'warning-animation' : ''
    } ${
      childProps.className?.includes('progress') ? 'progress-animation' : ''
    } ${
      childProps.className?.includes('circular-progress') ? 'circular-progress-animation' : ''
    } ${
      childProps.className?.includes('hardware-accelerated') ? 'hardware-accelerated' : ''
    }`.trim();

    // Adiciona event handlers para botões
    const enhancedProps = {
      ...childProps,
      className,
      onMouseEnter: (e: React.MouseEvent) => {
        handleMouseEnter(e);
        childProps.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        handleMouseLeave(e);
        childProps.onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        handleFocus(e);
        childProps.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        handleBlur(e);
        childProps.onBlur?.(e);
      },
      onClick: (e: React.MouseEvent) => {
        // Adiciona ripple effect para botões
        if (child.type === 'button' || childProps.role === 'button') {
          createRipple(e);
        }
        childProps.onClick?.(e);
      }
    };

    // Adiciona ripple effects para botões
    if (child.type === 'button' || childProps.role === 'button') {
      return (
        <motion.div
          key={elementId}
          className="button-container"
          style={{ position: 'relative', overflow: 'hidden' }}
          variants={hoverVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {React.cloneElement(child, enhancedProps)}
          
          {/* Ripple effects */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                data-testid="ripple-effect"
                className="ripple-effect ripple-animation"
                variants={rippleVariants}
                initial="initial"
                animate="animate"
                exit="initial"
                style={{
                  position: 'absolute',
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  pointerEvents: 'none',
                  transform: 'translate3d(0, 0, 0)' // Hardware acceleration
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      );
    }

    // Adiciona animações específicas para outros elementos
    if (childProps.className?.includes('progress') && !childProps.className?.includes('circular-progress')) {
      return (
        <motion.div
          key={elementId}
          className="progress-container"
          style={{ position: 'relative' }}
        >
          {React.cloneElement(child, enhancedProps)}
          <motion.div
            data-testid="progress-fill"
            className="progress-fill progress-fill-animation"
            variants={progressVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              backgroundColor: '#4CAF50',
              borderRadius: 'inherit',
              transform: 'translate3d(0, 0, 0)' // Hardware acceleration
            }}
          />
        </motion.div>
      );
    }

    if (childProps.className?.includes('circular-progress')) {
      return (
        <motion.div
          key={elementId}
          className="circular-progress-container"
          style={{ position: 'relative' }}
        >
          {React.cloneElement(child, enhancedProps)}
          <motion.svg
            data-testid="progress-circle"
            className="progress-circle progress-circle-animation"
            variants={circularProgressVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center'
            }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="40"
              stroke="#4CAF50"
              strokeWidth="4"
              fill="none"
              strokeDasharray="0 283"
              style={{
                transform: 'translate3d(0, 0, 0)' // Hardware acceleration
              }}
            />
          </motion.svg>
        </motion.div>
      );
    }

    // Adiciona hardware acceleration para elementos específicos
    if (childProps.className?.includes('hardware-accelerated')) {
      return React.cloneElement(child, {
        ...enhancedProps,
        style: {
          ...childProps.style,
          transform: 'translate3d(0, 0, 0)' // Hardware acceleration
        }
      });
    }

    return React.cloneElement(child, enhancedProps);
  });

  return (
    <div className="micro-interactions-container">
      {enhancedChildren}
    </div>
  );
};
