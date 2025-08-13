import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionsProps {
  children: React.ReactNode;
  pageType?: 'home' | 'game' | 'profile' | 'deck' | 'matchmaking';
  isLoading?: boolean;
  hasError?: boolean;
  onAnimationComplete?: () => void;
}

export const PageTransitions: React.FC<PageTransitionsProps> = ({
  children,
  pageType = 'home',
  isLoading = false,
  hasError = false,
  onAnimationComplete
}) => {


  // Animações de entrada específicas por página
  const pageEntranceVariants = {
    home: {
      hidden: { opacity: 0, x: -100 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut" as const
        }
      }
    },
    game: {
      hidden: { opacity: 0, scale: 0.8, y: 50 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut" as const
        }
      }
    },
    profile: {
      hidden: { opacity: 0, y: 100 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut" as const
        }
      }
    },
    deck: {
      hidden: { opacity: 0, rotateY: -90 },
      visible: { 
        opacity: 1, 
        rotateY: 0,
        transition: {
          duration: 0.7,
          ease: "easeOut" as const
        }
      }
    },
    matchmaking: {
      hidden: { opacity: 0, scale: 1.2 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut" as const
        }
      }
    }
  };



  // Animações de loading
  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animações de erro
  const errorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  // Animações de spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  // Animações de skeleton
  const skeletonVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };



  return (
    <div className="page-transitions-container">
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            data-testid="page-loading"
            className="page-loading loading-animation"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="loading-spinner"
              variants={spinnerVariants}
              animate="animate"
            >
              <div className="spinner"></div>
            </motion.div>
            <p>Carregando...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            data-testid="page-error"
            className="page-error error-animation"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="error-icon">⚠️</div>
            <h3>Erro ao carregar página</h3>
            <p>Tente novamente mais tarde</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal da página */}
      <motion.div
        data-testid="page-transition"
        className={`
          page-transition
          page-entrance-animation
          ${pageType}-entrance
  
        `}
        variants={pageEntranceVariants[pageType]}
        initial="hidden"
        animate="visible"
        exit="exit"
        onAnimationComplete={onAnimationComplete}
        style={{
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)' // Hardware acceleration
        }}
      >
        {children}
      </motion.div>

      {/* Skeleton loading para conteúdo */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="skeleton-container"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              data-testid="skeleton"
              className="skeleton skeleton-animation"
              variants={skeletonVariants}
              animate="animate"
            >
              <motion.div
                data-testid="skeleton-line"
                className="skeleton-line skeleton-line-animation"
                variants={skeletonVariants}
                animate="animate"
              />
              <motion.div
                className="skeleton-line skeleton-line-animation"
                variants={skeletonVariants}
                animate="animate"
              />
              <motion.div
                className="skeleton-line skeleton-line-animation"
                variants={skeletonVariants}
                animate="animate"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
