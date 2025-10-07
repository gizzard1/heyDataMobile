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
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderLeftWidth: 4,
    overflow: 'visible',
    userSelect: 'none' as any,
    backgroundColor: '#FFFFFF',
    zIndex: 950,
  },
  active: {
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    elevation: 6,
    zIndex: 960,
  },
  content: { 
    flex: 1, 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    paddingTop: 4, 
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  time: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#333333', 
    marginBottom: 6,
    width: '100%',
  },
  title: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#1a1a1a', 
    marginBottom: 3,
    width: '100%',
  },
  services: { 
    width: '100%',
    marginTop: 2,
  },
  service: { 
    fontSize: 11, 
    color: '#666666',
    marginBottom: 1,
  },
  more: { 
    fontSize: 10, 
    color: '#999999', 
    fontStyle: 'italic',
    marginTop: 2,
  },
  internalHandleTop: { 
    position: 'absolute', 
    top: -8, 
    left: 0, 
    right: 0, 
    height: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    zIndex: 10, 
    pointerEvents: 'box-only' as any,
  },
  internalHandleBottom: { 
    position: 'absolute', 
    bottom: -8, 
    left: 0, 
    right: 0, 
    height: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    zIndex: 10, 
    pointerEvents: 'box-only' as any,
  },
  internalLine: { 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#007AFF', 
    width: '45%', 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  handleHidden: {
    opacity: 0,
    pointerEvents: 'none' as any,
  },
  handleVisible: {
    opacity: 1,
    pointerEvents: 'box-only' as any,
  },
});
