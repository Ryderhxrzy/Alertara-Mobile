// Fallback for using Ionicons on Android and web (modern icon library).

import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof Ionicons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Ionicons mappings here.
 * - see Ionicons in the [Icons Directory](https://ionicons.com).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'paper-plane',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-forward',
  'house': 'home-outline',
  'info': 'information-circle-outline',
  'bell': 'notifications-outline',
  'gear': 'settings-outline',
  'person': 'person-circle-outline',
  'menu': 'menu',
  'menu-outline': 'menu-outline',
  'search': 'search',
  'location': 'location',
  'chatbubble': 'chatbubble',
  'moon': 'moon',
  'sun': 'sunny',
  'arrow.left': 'chevron-back',
  'map': 'map-outline',
  'flame': 'flame',
  'shield': 'shield',
  'clock': 'time',
  'info.circle': 'information-circle',
  'checkmark': 'checkmark-done',
  'exclamationmark': 'alert-circle',
  'xmark': 'close-circle',
  'building': 'business',
  'phone': 'call',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Ionicons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Ionicons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <Ionicons color={color} size={size} name={MAPPING[name]} style={style} />;
}
