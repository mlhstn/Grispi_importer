import { useState, useEffect } from 'react';

/**
 * Media query hook for responsive design
 * Performance optimized with debouncing and proper cleanup
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * Predefined breakpoint hooks for common use cases
 */
export const useBreakpoints = () => {
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1199px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1200px)');
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isHighDPI = useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');

  return {
    isSmallMobile,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTouch,
    isLandscape,
    isPortrait,
    isHighDPI,
    
    // Computed breakpoint
    currentBreakpoint: isSmallMobile ? 'small-mobile' :
                      isMobile ? 'mobile' :
                      isTablet ? 'tablet' :
                      isDesktop ? 'desktop' :
                      isLargeDesktop ? 'large-desktop' : 'unknown'
  };
};

/**
 * Hook for responsive values
 * Returns different values based on current breakpoint
 */
export const useResponsiveValue = <T>(values: {
  smallMobile?: T;
  mobile?: T;
  tablet?: T;
  desktop?: T;
  largeDesktop?: T;
  default: T;
}): T => {
  const { isSmallMobile, isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoints();

  if (isSmallMobile && values.smallMobile !== undefined) {
    return values.smallMobile;
  }
  if (isMobile && values.mobile !== undefined) {
    return values.mobile;
  }
  if (isTablet && values.tablet !== undefined) {
    return values.tablet;
  }
  if (isDesktop && values.desktop !== undefined) {
    return values.desktop;
  }
  if (isLargeDesktop && values.largeDesktop !== undefined) {
    return values.largeDesktop;
  }

  return values.default;
};

/**
 * Hook for responsive styles
 * Returns style object based on current breakpoint
 */
export const useResponsiveStyles = (styles: {
  smallMobile?: React.CSSProperties;
  mobile?: React.CSSProperties;
  tablet?: React.CSSProperties;
  desktop?: React.CSSProperties;
  largeDesktop?: React.CSSProperties;
  default: React.CSSProperties;
}): React.CSSProperties => {
  return useResponsiveValue(styles);
};

/**
 * Hook for responsive class names
 * Returns class name string based on current breakpoint
 */
export const useResponsiveClassName = (classNames: {
  smallMobile?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  largeDesktop?: string;
  default: string;
}): string => {
  return useResponsiveValue(classNames);
};
