/**
 * Below are the colors that are used in the app. Light mode only.
 */

import { Platform } from 'react-native';

// Primary Color Palette - Teal
export const PrimaryColors = {
  50: '#f0f9f8',
  100: '#ddf2f0',
  200: '#bfe5e2',
  300: '#9dd4cc',
  400: '#75bbb3',
  500: '#3a7675',
  600: '#2f5f5e',
  700: '#274d4c',
  800: '#214040',
  900: '#1c3636',
};

// Named Teal Color Variables
export const TealColors = {
  primary: PrimaryColors[500],      // #3a7675
  primaryDark: PrimaryColors[600],  // #2f5f5e
  primaryDarker: PrimaryColors[700], // #274d4c
  primaryLight: PrimaryColors[400],  // #75bbb3
  primaryLighter: PrimaryColors[300], // #9dd4cc
};

// Light Mode Colors
export const LIGHT_TEXT = '#11181C';
export const LIGHT_BACKGROUND = '#fff';
export const LIGHT_ICON = '#687076';
export const LIGHT_TINT_COLOR = TealColors.primary;
export const LIGHT_BORDER = '#e0e0e0';
export const LIGHT_CARD_BG = '#f5f5f5';

// Dark Mode Colors
export const DARK_TEXT = '#d4d4d4';
export const DARK_BACKGROUND = '#1a1a1a';
export const DARK_ICON = '#b0b0b0';
export const DARK_TINT_COLOR = TealColors.primaryLight;
export const DARK_BORDER = '#333333';
export const DARK_CARD_BG = '#2a2a2a';

// Backward compatibility
const lightText = LIGHT_TEXT;
const lightBackground = LIGHT_BACKGROUND;
const lightIcon = LIGHT_ICON;
const lightTintColor = LIGHT_TINT_COLOR;

const darkText = DARK_TEXT;
const darkBackground = DARK_BACKGROUND;
const darkIcon = DARK_ICON;
const darkTintColor = DARK_TINT_COLOR;

export const Colors = {
  light: {
    text: lightText,
    background: lightBackground,
    tint: lightTintColor,
    icon: lightIcon,
    tabIconDefault: lightIcon,
    tabIconSelected: lightTintColor,
  },
  dark: {
    text: darkText,
    background: darkBackground,
    tint: darkTintColor,
    icon: darkIcon,
    tabIconDefault: darkIcon,
    tabIconSelected: darkTintColor,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
