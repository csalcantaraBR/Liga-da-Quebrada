import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@lq/shared';

interface CardAnimationsProps {
  card: Card;
  isSelected?: boolean;
  isDisabled?: boolean;
  showTooltip?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const CardAnimations: React.FC<CardAnimationsProps> = ({
  card,
  isSelected = false,
  isDisabled = false,
  showTooltip = false,
  delay = 0,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [powerChanged, setPowerChanged] = useState(false);

  // Animações de entrada
  const entranceVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut" as const
      }
    }
  };



  // Animações de tooltip
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animações de mudança de poder
  const powerChangeVariants = {
    initial: { scale: 1 },
    changed: {
      scale: [1, 1.2, 1],
      color: ["#fff", "#ffd700", "#fff"],
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (showTooltip) {
      setShowTooltipState(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltipState(false);
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    setIsClicked(true);
    onClick?.();
    
    // Remove a animação de click após 300ms
    setTimeout(() => setIsClicked(false), 300);
  };

  // Detecta mudança de poder
  useEffect(() => {
    setPowerChanged(true);
    const timer = setTimeout(() => setPowerChanged(false), 500);
    return () => clearTimeout(timer);
  }, [card.power]);

  return (
    <motion.div
      data-testid="card-animation"
      className={`
        card-animation
        ${isHovered ? 'hover-animation' : ''}
        ${isClicked ? 'click-animation' : ''}
        ${isSelected ? 'selected-animation' : ''}
        ${isDisabled ? 'disabled-animation' : ''}
        entrance-animation
      `}
      variants={entranceVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isDisabled ? "hover" : undefined}
      whileTap={!isDisabled ? "tap" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)', // Hardware acceleration
        animationDelay: `${delay}s`
      }}
    >
      {/* Conteúdo da carta */}
      <div className="card-content">
        <h3>{card.name}</h3>
        
        <motion.div
          data-testid="power-indicator"
          className={`power-indicator ${powerChanged ? 'power-change-animation' : ''}`}
          variants={powerChangeVariants}
          initial="initial"
          animate={powerChanged ? "changed" : "initial"}
          key={card.power} // Força re-animação quando o poder muda
        >
          Poder: {card.power}
        </motion.div>
        
        <p>Dano: {card.damage}</p>
        <p>{card.text}</p>
        
        <div className="keywords">
          {card.keywords.map((keyword, index) => (
            <span key={index} className="keyword">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Tooltip animado */}
      <AnimatePresence>
        {showTooltipState && showTooltip && (
          <motion.div
            data-testid="card-tooltip"
            className="card-tooltip tooltip-animation"
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <h4>{card.name}</h4>
            <p>{card.text}</p>
            <div className="tooltip-stats">
              <span>Poder: {card.power}</span>
              <span>Dano: {card.damage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efeito de ripple para click */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            data-testid="ripple-effect"
            className="ripple-effect"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
