import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Web fallback: react-native-maps native internals not supported in your current export
// This file is only bundled for web because of the .web.jsx platform suffix.
// Mobile platforms (iOS/Android) will continue to use map.jsx with the full MapView experience.

export default function MapScreenWebFallback() {
  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Map View Unavailable on Web</Text>
        <Text style={styles.subtitle}>The interactive native map (react-native-maps) is disabled in the web build.</Text>
        <Text style={styles.info}>To enable a web map later you can integrate a web library (e.g. Mapbox GL JS, Leaflet, or Google Maps JS) inside this fallback component.</Text>
        <Text style={styles.tip}>Tip: You can still test all other tabs and functionality in the web export.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f2fe' },
  panel: {
    maxWidth: 520,
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 28,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#dbeafe'
  },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 14, lineHeight: 22, textAlign: 'center' },
  info: { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 16, textAlign: 'center' },
  tip: { fontSize: 12, color: '#0369a1', fontWeight: '600', textAlign: 'center' }
});
