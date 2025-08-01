// Nardo Gray Color System
// A sophisticated palette revolving around #92a6b0 with cyan, black, white, and grey accents

export const nardoGrayColors = {
  // Primary Color - Based on #92a6b0
  primary: {
    50: '#f8f9fa',   // Lightest variation
    100: '#f1f3f4',  // Very light variation
    200: '#e8eaed',  // Light variation
    300: '#dadce0',  // Medium light variation
    400: '#bdc1c6',  // Medium variation
    500: '#92a6b0',  // Main color
    600: '#7a8a93',  // Medium dark variation
    700: '#5f6b73',  // Dark variation
    800: '#3c4043',  // Very dark variation
    900: '#202124',  // Darkest variation
  },

  // Accent Colors
  accent: {
    cyan: '#00bcd4',      // Bright cyan
    cyanLight: '#4dd0e1', // Light cyan
    cyanDark: '#0097a7',  // Dark cyan
    black: '#000000',     // Pure black
    white: '#ffffff',     // Pure white
    grey: '#9e9e9e',      // Medium grey
    greyLight: '#e0e0e0', // Light grey
    greyDark: '#616161',  // Dark grey
    cream: '#fafafa',     // Off-white
    charcoal: '#424242',  // Charcoal grey
  },

  // Neutral Shades
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic Colors
  semantic: {
    success: '#00bcd4',    // Cyan success
    warning: '#ff9800',    // Orange warning
    error: '#f44336',      // Red error
    info: '#2196f3',       // Blue info
  },

  // Background Colors
  background: {
    primary: '#92a6b0',    // Main background color
    secondary: '#f8f9fa',  // Light background
    tertiary: '#e8eaed',   // Medium background
    dark: '#202124',       // Dark background
  },

  // Text Colors
  text: {
    primary: '#202124',    // Dark text
    secondary: '#3c4043',  // Medium text
    tertiary: '#5f6b73',   // Light text
    muted: '#9e9e9e',      // Muted text
    inverse: '#ffffff',     // Light text on dark backgrounds
  },

  // Border Colors
  border: {
    light: '#e8eaed',
    medium: '#dadce0',
    dark: '#92a6b0',
  },

  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #92a6b0 0%, #7a8a93 100%)',
    secondary: 'linear-gradient(135deg, #f8f9fa 0%, #e8eaed 100%)',
    accent: 'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)',
  },
};

// CSS Custom Properties for easy use in CSS
export const nardoGrayCSSVars = {
  '--color-primary-50': nardoGrayColors.primary[50],
  '--color-primary-100': nardoGrayColors.primary[100],
  '--color-primary-200': nardoGrayColors.primary[200],
  '--color-primary-300': nardoGrayColors.primary[300],
  '--color-primary-400': nardoGrayColors.primary[400],
  '--color-primary-500': nardoGrayColors.primary[500],
  '--color-primary-600': nardoGrayColors.primary[600],
  '--color-primary-700': nardoGrayColors.primary[700],
  '--color-primary-800': nardoGrayColors.primary[800],
  '--color-primary-900': nardoGrayColors.primary[900],
  
  '--color-accent-cyan': nardoGrayColors.accent.cyan,
  '--color-accent-cyanLight': nardoGrayColors.accent.cyanLight,
  '--color-accent-cyanDark': nardoGrayColors.accent.cyanDark,
  '--color-accent-black': nardoGrayColors.accent.black,
  '--color-accent-white': nardoGrayColors.accent.white,
  '--color-accent-grey': nardoGrayColors.accent.grey,
  '--color-accent-greyLight': nardoGrayColors.accent.greyLight,
  '--color-accent-greyDark': nardoGrayColors.accent.greyDark,
  '--color-accent-cream': nardoGrayColors.accent.cream,
  '--color-accent-charcoal': nardoGrayColors.accent.charcoal,
  
  '--color-background-primary': nardoGrayColors.background.primary,
  '--color-background-secondary': nardoGrayColors.background.secondary,
  '--color-background-tertiary': nardoGrayColors.background.tertiary,
  '--color-background-dark': nardoGrayColors.background.dark,
  
  '--color-text-primary': nardoGrayColors.text.primary,
  '--color-text-secondary': nardoGrayColors.text.secondary,
  '--color-text-tertiary': nardoGrayColors.text.tertiary,
  '--color-text-muted': nardoGrayColors.text.muted,
  '--color-text-inverse': nardoGrayColors.text.inverse,
};

// Tailwind CSS configuration for nardo gray colors
export const nardoGrayTailwindConfig = {
  theme: {
    extend: {
      colors: {
        nardo: nardoGrayColors.primary,
        accent: nardoGrayColors.accent,
        semantic: nardoGrayColors.semantic,
      },
    },
  },
};

// Export the main color object for backward compatibility
export const pickleMilkColors = nardoGrayColors;
