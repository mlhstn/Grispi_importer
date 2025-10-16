/**
 * Responsive utility functions
 * Helper functions for responsive design calculations
 */

export const breakpoints = {
  smallMobile: 480,
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
  largeDesktop: 1400
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get responsive spacing values
 */
export const getResponsiveSpacing = (base: number, multiplier: number = 1) => ({
  smallMobile: Math.max(base * 0.5, 8),
  mobile: Math.max(base * 0.75, 12),
  tablet: base,
  desktop: base * 1.25,
  largeDesktop: base * 1.5
});

/**
 * Get responsive font sizes
 */
export const getResponsiveFontSize = (base: number) => ({
  smallMobile: Math.max(base * 0.75, 12),
  mobile: Math.max(base * 0.875, 14),
  tablet: base,
  desktop: base * 1.125,
  largeDesktop: base * 1.25
});

/**
 * Get responsive container widths
 */
export const getResponsiveContainerWidth = () => ({
  smallMobile: '100%',
  mobile: '100%',
  tablet: '100%',
  desktop: '1200px',
  largeDesktop: '1400px'
});

/**
 * Get responsive grid columns
 */
export const getResponsiveGridColumns = () => ({
  smallMobile: 1,
  mobile: 1,
  tablet: 2,
  desktop: 3,
  largeDesktop: 4
});

/**
 * Check if current width is within breakpoint range
 */
export const isWithinBreakpoint = (width: number, breakpoint: Breakpoint): boolean => {
  const breakpointValue = breakpoints[breakpoint];
  
  switch (breakpoint) {
    case 'smallMobile':
      return width <= breakpointValue;
    case 'mobile':
      return width <= breakpointValue;
    case 'tablet':
      return width > breakpoints.mobile && width <= breakpointValue;
    case 'desktop':
      return width > breakpoints.tablet && width <= breakpointValue;
    case 'largeDesktop':
      return width > breakpointValue;
    default:
      return false;
  }
};

/**
 * Get current breakpoint based on width
 */
export const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width <= breakpoints.smallMobile) return 'smallMobile';
  if (width <= breakpoints.mobile) return 'mobile';
  if (width <= breakpoints.tablet) return 'tablet';
  if (width <= breakpoints.desktop) return 'desktop';
  return 'largeDesktop';
};

/**
 * Responsive value selector
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint,
  defaultValue: T
): T => {
  return values[currentBreakpoint] ?? defaultValue;
};

/**
 * Generate responsive CSS custom properties
 */
export const generateResponsiveCSS = (baseValues: Record<string, number>) => {
  const css: Record<string, Record<string, string>> = {};
  
  Object.entries(baseValues).forEach(([key, value]) => {
    css[key] = {
      '--small-mobile': `${Math.max(value * 0.5, 8)}px`,
      '--mobile': `${Math.max(value * 0.75, 12)}px`,
      '--tablet': `${value}px`,
      '--desktop': `${value * 1.25}px`,
      '--large-desktop': `${value * 1.5}px`
    };
  });
  
  return css;
};

/**
 * Responsive image sizes
 */
export const getResponsiveImageSizes = () => ({
  smallMobile: '100vw',
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw',
  largeDesktop: '25vw'
});

/**
 * Responsive modal sizes
 */
export const getResponsiveModalSize = () => ({
  smallMobile: '95%',
  mobile: '90%',
  tablet: '80%',
  desktop: '600px',
  largeDesktop: '800px'
});

/**
 * Responsive table configuration
 */
export const getResponsiveTableConfig = () => ({
  smallMobile: {
    scroll: { x: 'max-content' },
    size: 'small' as const,
    pagination: { pageSize: 5 }
  },
  mobile: {
    scroll: { x: 'max-content' },
    size: 'small' as const,
    pagination: { pageSize: 10 }
  },
  tablet: {
    scroll: { x: 'max-content' },
    size: 'middle' as const,
    pagination: { pageSize: 15 }
  },
  desktop: {
    scroll: { x: 'max-content' },
    size: 'middle' as const,
    pagination: { pageSize: 20 }
  },
  largeDesktop: {
    scroll: { x: 'max-content' },
    size: 'large' as const,
    pagination: { pageSize: 25 }
  }
});

/**
 * Responsive form layout
 */
export const getResponsiveFormLayout = () => ({
  smallMobile: {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
  },
  mobile: {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
  },
  tablet: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  },
  desktop: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  },
  largeDesktop: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
});
