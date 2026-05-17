import { LanguageOption } from "@/context/preferences-context";

type LangMap = Record<LanguageOption, string>;

const translations: Record<string, LangMap> = {
  // Navigation
  "nav.home": { en: "Home", es: "Inicio", fr: "Accueil", tl: "Home" },
  "nav.map": { en: "Map", es: "Mapa", fr: "Carte", tl: "Mapa" },
  "nav.call": { en: "Call", es: "Llamar", fr: "Appel", tl: "Tawag" },
  "nav.report": { en: "Report", es: "Reporte", fr: "Signalement", tl: "Ulat" },
  "nav.profile": { en: "Profile", es: "Perfil", fr: "Profil", tl: "Profile" },

  // Generic actions
  "action.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", tl: "Kanselahin" },
  "action.change": { en: "Change", es: "Cambiar", fr: "Changer", tl: "Palitan" },
  "action.confirm": { en: "Confirm", es: "Confirmar", fr: "Confirmer", tl: "Kumpirmahin" },
  "action.logout": { en: "Logout", es: "Cerrar sesión", fr: "Se déconnecter", tl: "Mag-logout" },
  "action.clear": { en: "Clear", es: "Borrar", fr: "Effacer", tl: "Burahin" },

  // Language settings
  "settings.language.label": { en: "Language", es: "Idioma", fr: "Langue", tl: "Wika" },
  "settings.language.description": {
    en: "Choose your preferred language",
    es: "Elige tu idioma preferido",
    fr: "Choisissez votre langue préférée",
    tl: "Piliin ang nais na wika",
  },
  "settings.language.confirmTitle": {
    en: "Change language?",
    es: "¿Cambiar idioma?",
    fr: "Changer de langue ?",
    tl: "Palitan ang wika?",
  },
  "settings.language.confirmMessage": {
    en: "Switch app language to {language}? The app will reload text instantly.",
    es: "¿Cambiar el idioma de la app a {language}? La app actualizará los textos al instante.",
    fr: "Passer l’app en {language} ? Les textes seront mis à jour immédiatement.",
    tl: "Lumipat ng wika sa {language}? Agad maa-update ang mga teksto.",
  },
  "settings.language.updated": {
    en: "Language updated",
    es: "Idioma actualizado",
    fr: "Langue mise à jour",
    tl: "Na-update ang wika",
  },
  "settings.language.updateError": {
    en: "Could not change language. Please try again.",
    es: "No se pudo cambiar el idioma. Inténtalo de nuevo.",
    fr: "Impossible de changer la langue. Réessayez.",
    tl: "Hindi napalitan ang wika. Pakiulit.",
  },

  // Language names
  "language.english": { en: "English", es: "Inglés", fr: "Anglais", tl: "Ingles" },
  "language.spanish": { en: "Spanish", es: "Español", fr: "Espagnol", tl: "Español" },
  "language.french": { en: "French", es: "Francés", fr: "Français", tl: "Pranses" },
  "language.tagalog": { en: "Tagalog", es: "Tagalo", fr: "Tagalog", tl: "Tagalog" },

  // Report screen
  "report.title": {
    en: "Report an Incident",
    es: "Reportar un incidente",
    fr: "Signaler un incident",
    tl: "Mag-ulat ng insidente",
  },
  "report.subtitle": {
    en: "Send location, type, and severity so dispatch can respond faster.",
    es: "Envía ubicación, tipo y gravedad para una respuesta más rápida.",
    fr: "Envoyez la localisation, le type et la gravité pour accélérer l'intervention.",
    tl: "Ipadala ang lokasyon, uri, at tindi para mas mabilis ang tugon.",
  },
  "report.historyButton": {
    en: "View report history",
    es: "Ver historial de reportes",
    fr: "Voir l'historique des signalements",
    tl: "Tingnan ang kasaysayan ng ulat",
  },
  "report.incidentType": { en: "Incident Type", es: "Tipo de incidente", fr: "Type d'incident", tl: "Uri ng insidente" },
  "report.location": { en: "Location", es: "Ubicación", fr: "Localisation", tl: "Lokasyon" },
  "report.currentLocation": { en: "Current location", es: "Ubicación actual", fr: "Localisation actuelle", tl: "Kasalukuyang lokasyon" },
  "report.refresh": { en: "Refresh", es: "Actualizar", fr: "Rafraîchir", tl: "I-refresh" },
  "report.manualPin": { en: "Manual pin", es: "Fijar manual", fr: "Position manuelle", tl: "Manwal na pin" },
  "report.autoGPS": { en: "Auto GPS", es: "GPS automático", fr: "GPS auto", tl: "Auto GPS" },
  "report.severity": { en: "Severity", es: "Gravedad", fr: "Gravité", tl: "Tindi" },
  "report.details": { en: "Add Details", es: "Agregar detalles", fr: "Ajouter des détails", tl: "Magdagdag ng detalye" },
  "report.shortSummary": { en: "Short summary", es: "Resumen breve", fr: "Brève description", tl: "Maikling buod" },
  "report.optionalNotes": { en: "Optional notes", es: "Notas opcionales", fr: "Notes optionnelles", tl: "Opsyonal na tala" },
  "report.helper": {
    en: "Include who/what, visible hazards, people affected, and access points.",
    es: "Incluye quién/quiénes, riesgos visibles, personas afectadas y puntos de acceso.",
    fr: "Incluez qui/quoi, dangers visibles, personnes touchées et points d'accès.",
    tl: "Isama ang sino/ano, nakikitang panganib, apektadong tao, at mga daanan.",
  },
  "report.attach": { en: "Attach photo / video", es: "Adjuntar foto / video", fr: "Joindre photo / vidéo", tl: "Mag-attach ng larawan / video" },
  "report.hideMedia": { en: "Hide media", es: "Ocultar medios", fr: "Masquer les médias", tl: "Itago ang media" },
  "report.attachNote": {
    en: "Camera ready · files stored locally until submit",
    es: "Cámara lista · archivos locales hasta enviar",
    fr: "Caméra prête · fichiers stockés localement jusqu'à l'envoi",
    tl: "Handa ang kamera · lokal na nakaimbak ang files hanggang isumite",
  },
  "report.submit": { en: "Submit Report", es: "Enviar reporte", fr: "Envoyer le rapport", tl: "Isumite ang ulat" },
  "report.addSummary": { en: "Add summary to submit", es: "Agrega un resumen para enviar", fr: "Ajoutez un résumé pour envoyer", tl: "Magdagdag ng buod para isumite" },
  "report.sending": { en: "Sending...", es: "Enviando...", fr: "Envoi...", tl: "Ipinapadala..." },
  "report.confirmationOk": {
    en: "Report sent to dispatch. Responders notified.",
    es: "Reporte enviado a despacho. Respondedores notificados.",
    fr: "Signalement envoyé au dispatch. Secours notifiés.",
    tl: "Naipadala ang ulat sa dispatch. Naabisuhan ang responders.",
  },
  "report.confirmationFail": {
    en: "Couldn't send report. Please try again.",
    es: "No se pudo enviar el reporte. Inténtalo de nuevo.",
    fr: "Impossible d'envoyer le signalement. Réessayez.",
    tl: "Hindi naipadala ang ulat. Pakiulit.",
  },
  "report.resumeChip": {
    en: "Resume last incident chat",
    es: "Reanudar último chat de incidente",
    fr: "Reprendre le dernier chat d'incident",
    tl: "Ituloy ang huling chat ng insidente",
  },
  "report.openChat": {
    en: "Open chat",
    es: "Abrir chat",
    fr: "Ouvrir le chat",
    tl: "Buksan ang chat",
  },
  "report.quickFire": { en: "Report Fire Now", es: "Reportar incendio ahora", fr: "Signaler un incendie", tl: "Iulat ang sunog ngayon" },
  "report.quickMedical": { en: "Medical Alert", es: "Alerta médica", fr: "Alerte médicale", tl: "Medikal na alerto" },
  "report.quickNote": {
    en: "Auto-filled template; add location notes if needed.",
    es: "Plantilla auto-rellena; añade notas de ubicación si es necesario.",
    fr: "Modèle prérempli; ajoutez des notes de localisation si besoin.",
    tl: "Auto-filled na template; magdagdag ng tala sa lokasyon kung kailangan.",
  },

  // History screen
  "history.title": { en: "Report History", es: "Historial de reportes", fr: "Historique des rapports", tl: "Kasaysayan ng ulat" },
  "history.empty": { en: "No past reports yet.", es: "Aún no hay reportes.", fr: "Aucun rapport pour l'instant.", tl: "Wala pang naunang ulat." },
  "history.updated": { en: "Updated:", es: "Actualizado:", fr: "Mis à jour :", tl: "Na-update:" },
  "history.openConversation": { en: "Open conversation", es: "Abrir conversación", fr: "Ouvrir la conversation", tl: "Buksan ang usapan" },
  "history.clear": { en: "Clear", es: "Borrar", fr: "Effacer", tl: "Burahin" },

  // Shared status & severities
  "status.pending": { en: "Pending", es: "Pendiente", fr: "En attente", tl: "Nakahold" },
  "status.received": { en: "Received", es: "Recibido", fr: "Reçu", tl: "Natanggap" },
  "status.inProgress": { en: "In progress", es: "En progreso", fr: "En cours", tl: "Isinasagawa" },
  "status.resolved": { en: "Resolved", es: "Resuelto", fr: "Résolu", tl: "Nalutas" },
  "severity.low": { en: "Low", es: "Baja", fr: "Faible", tl: "Mababa" },
  "severity.medium": { en: "Medium", es: "Media", fr: "Moyenne", tl: "Katamtaman" },
  "severity.high": { en: "High", es: "Alta", fr: "Élevée", tl: "Mataas" },

  // Types
  "type.fire": { en: "Fire", es: "Incendio", fr: "Incendie", tl: "Sunog" },
  "type.medical": { en: "Medical", es: "Médico", fr: "Médical", tl: "Medikal" },
  "type.crime": { en: "Crime", es: "Crimen", fr: "Crime", tl: "Krimen" },
  "type.accident": { en: "Accident", es: "Accidente", fr: "Accident", tl: "Aksidente" },
  "type.flood": { en: "Flood", es: "Inundación", fr: "Inondation", tl: "Baha" },
};

export default translations;
