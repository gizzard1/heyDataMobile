/**
 * Styles for ResizableAppointmentCard
 * -----------------------------------
 * Se mantienen compactos para que el componente principal no
 * se sobrecargue. Nombres semánticos alineados con la lógica
 * (handles superior/inferior, contenido central, etc.).
 */
import { StyleSheet } from 'react-native';

export const appointmentCardStyles = StyleSheet.create({
  card: {
    position: 'absolute',
    borderRadius: 8,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderLeftWidth: 4,
    overflow: 'visible',
    userSelect: 'none' as any,
  },
  active: {
    shadowOpacity: 0.28,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)'
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingBottom: 10 },
  time: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 2 },
  title: { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2 },
  services: { width: '100%' },
  service: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
  more: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' },
  internalHandleTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10, pointerEvents: 'box-only' as any },
  internalHandleBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10, pointerEvents: 'box-only' as any },
  internalLine: { height: 5, borderRadius: 3, backgroundColor: '#FFFFFF', width: '55%', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 2, shadowOffset: { width:0, height:1 } },
});
