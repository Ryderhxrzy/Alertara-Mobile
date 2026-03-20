import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const modules = [
  { title: "Mass Notification", icon: "antenna.radiowaves.left.and.right", route: "/central-command/emergency-communication/mass-notification", desc: "Create and send alerts across SMS, Email, PA." },
  { title: "Alert Catalog", icon: "tray.full", route: "/central-command/emergency-communication/alert-catalog", desc: "Reusable alert templates and categorizations." },
  { title: "Two-Way Feedback", icon: "bubble.left.and.bubble.right", route: "/central-command/emergency-communication/citizen-feedback", desc: "Collect acknowledgements and citizen status." },
  { title: "Language Support", icon: "globe", route: "/central-command/emergency-communication/language-support", desc: "Manage translations and multilingual delivery." },
  { title: "Subscriptions", icon: "person.crop.circle.badge.checkmark", route: "/central-command/emergency-communication/subscriptions", desc: "Opt-ins, channels, and preferences." },
  { title: "Audit Log", icon: "doc.text.magnifyingglass", route: "/central-command/emergency-communication/audit-log", desc: "Delivery history, status, and accountability." },
];

export default function EcsHome() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const bg = isDarkMode ? Colors.dark.background : Colors.light.background;
  const cardBg = isDarkMode ? "#1f2933" : "#ffffff";
  const text = isDarkMode ? Colors.dark.text : Colors.light.text;
  const muted = isDarkMode ? "#cbd5e1" : "#555";
  const border = isDarkMode ? "#334155" : "#e2e5ea";
  const accent = "#16a34a";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <Header />
      <ScrollView
        contentContainerStyle={[styles.content, { backgroundColor: bg }]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={[styles.backText, { color: accent }]}>‹ Back</ThemedText>
        </Pressable>

        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: accent }]}>
            <IconSymbol name="antenna.radiowaves.left.and.right" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="title" style={[styles.title, { color: text }]}>
              Emergency Communication System
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Mass notifications, multilingual delivery, two-way feedback, and auditability.
            </ThemedText>
          </View>
        </View>

        <View style={styles.grid}>
          {modules.map((m) => (
            <Pressable
              key={m.route}
              style={[styles.card, { backgroundColor: cardBg, borderColor: border, shadowColor: "#000" }]}
              onPress={() => router.push(m.route)}
            >
              <View style={[styles.cardIcon, { backgroundColor: isDarkMode ? "rgba(22,163,74,0.16)" : "#e8f1ff" }]}>
                <IconSymbol name={m.icon as any} size={20} color={accent} />
              </View>
              <ThemedText style={[styles.cardTitle, { color: text }]}>{m.title}</ThemedText>
              <ThemedText style={[styles.cardDesc, { color: muted }]}>{m.desc}</ThemedText>
              <ThemedText style={[styles.cardAction, { color: accent }]}>Open</ThemedText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  backBtn: { alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 6 },
  backText: { fontSize: 16, fontWeight: "600" },
  hero: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 4 },
  heroIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "48%", borderRadius: 16, borderWidth: 1, padding: 12, gap: 6 },
  cardIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardDesc: { fontSize: 12 },
  cardAction: { fontSize: 12, fontWeight: "600" },
});
