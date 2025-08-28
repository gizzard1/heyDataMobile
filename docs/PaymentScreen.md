# PaymentScreen - Documentación

Esta es la nueva pantalla de "Pagos" que has solicitado. Está diseñada para mostrar el resumen de una cita y permitir la gestión de pagos cuando el usuario hace clic en el botón "Cobrar".

## Características

### Vista de Pagos
- **Header**: Incluye botón de regreso y título "Pagos"
- **Información del Cliente**: Card con el nombre del cliente
- **Detalles de Servicios**: Lista de todos los servicios de la cita con horarios y empleados
- **Botón flotante**: Botón "+" para agregar servicios adicionales
- **Footer con Totales**: Muestra el total y el restante
- **Botón Editar Cita**: Para navegar a la pantalla de edición

### Integración con CalendarScreen

La pantalla ya está integrada con el `CalendarScreen.tsx`. Cuando el usuario hace clic en el botón "Cobrar" en el modal de detalles de cita, se abre la nueva pantalla de pagos.

## Flujo de Navegación

```
CalendarScreen 
    ↓ (clic en cita)
Modal de Detalles 
    ↓ (clic en "Cobrar")
PaymentScreen
    ↓ (clic en "Editar Cita")
AppointmentDetailScreen
```

## Uso

```tsx
import { PaymentScreen } from './src/screens';

// En tu componente padre
const [showPaymentScreen, setShowPaymentScreen] = useState(false);
const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

// Abrir la pantalla de pagos
const openPaymentScreen = (appointment: CalendarEvent) => {
  setSelectedEvent(appointment);
  setShowPaymentScreen(true);
};

// Renderizar
{showPaymentScreen && selectedEvent && (
  <PaymentScreen
    appointment={selectedEvent}
    onGoBack={() => setShowPaymentScreen(false)}
    onEditAppointment={() => {
      setShowPaymentScreen(false);
      setShowAppointmentDetail(true);
    }}
    onPaymentComplete={(paymentData) => {
      // Procesar pago
      console.log('Pago:', paymentData);
      setShowPaymentScreen(false);
    }}
  />
)}
```

## Props

### PaymentScreenProps
- `appointment: CalendarEvent` - Datos de la cita
- `onGoBack: () => void` - Función para regresar
- `onEditAppointment: () => void` - Función para editar la cita
- `onPaymentComplete?: (paymentData: any) => void` - Callback para el pago

## Características Implementadas

### ✅ **Diseño según la imagen:**
1. **Header limpio** con botón de regreso y título "Pagos"
2. **Card del cliente** con fondo blanco y sombra sutil
3. **Card de detalles** con lista de servicios
4. **Botón flotante** azul con ícono "+" en la esquina inferior derecha
5. **Footer** con totales (Total y Restante)
6. **Botón "Editar Cita"** con fondo azul oscuro

### 🎨 **Estilos:**
- **Colores**: Fondo gris claro (#F5F5F5), cards blancos, botones azul oscuro (#2E4B69)
- **Typography**: Diferentes pesos y tamaños según la jerarquía
- **Sombras**: Sombras sutiles en las cards para profundidad
- **Bordes**: Esquinas redondeadas (16px para cards, 12px para botones)

### 🔄 **Navegación:**
- **Integrada** con el sistema de modales existente
- **Transiciones suaves** con animaciones de slide
- **Navegación bidireccional** entre pantallas de pagos y edición

## Funcionalidades Futuras

1. **Métodos de pago**: Efectivo, tarjeta, transferencia
2. **Cálculo de cambio**: Si el pago es en efectivo
3. **Historial de pagos**: Registro de pagos parciales
4. **Descuentos**: Aplicación de descuentos o promociones
5. **Impresión de recibos**: Generar recibos de pago
6. **Agregar servicios**: Funcionalidad para el botón "+"

## Archivos

- 📁 `src/screens/PaymentScreen.tsx` - Componente principal
- 📁 `src/screens/index.ts` - Exportación agregada
- 📁 `src/screens/CalendarScreen.tsx` - Integración añadida
- 📁 `docs/PaymentScreen.md` - Esta documentación

## Estados de Pago

```tsx
interface PaymentData {
  appointmentId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: string;
}
```

¡La pantalla está lista para usar y completamente integrada con el flujo existente!
