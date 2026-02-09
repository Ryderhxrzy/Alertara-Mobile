import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const { isDarkMode } = useTheme();

  if (isDarkMode && props.dark) {
    return props.dark;
  }

  if (!isDarkMode && props.light) {
    return props.light;
  }

  return isDarkMode ? Colors.dark[colorName] : Colors.light[colorName];
}
