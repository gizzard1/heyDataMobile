# AppointmentDetailScreen - Documentación

Esta es la nueva pantalla de detalles de cita que has solicitado. Está diseñada para mostrar y editar los detalles de una cita específica cuando el usuario hace clic en el botón "Editar" en el modal de detalles de cita.

## Características

### Vista de Edición de Cita
- **Header**: Incluye botón de regreso y título "Editar cita"
- **Formulario**: Campos para editar fecha, hora de inicio, cliente y servicio
- **Dropdowns**: Cada campo tiene un dropdown con opciones disponibles
- **Sección de Servicios**: Muestra los servicios seleccionados con precios y descuentos
- **Total**: Muestra el total de la cita
- **Botón Guardar**: Para guardar los cambios

### Integración con CalendarScreen

La pantalla ya está integrada con el `CalendarScreen.tsx`. Cuando el usuario hace clic en el ícono de edición en el modal de detalles de cita, se abre la nueva pantalla.

## Uso

```tsx
import { AppointmentDetailScreen } from './src/screens';

// En tu componente padre
const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

// Abrir la pantalla de detalles
const openAppointmentDetail = (appointment: CalendarEvent) => {
  setSelectedEvent(appointment);
  setShowAppointmentDetail(true);
};

// Renderizar
{showAppointmentDetail && selectedEvent && (
  <AppointmentDetailScreen
    appointment={selectedEvent}
    onGoBack={() => setShowAppointmentDetail(false)}
    onSave={(updatedAppointment) => {
      // Actualizar el evento en tu estado
      updateAppointment(updatedAppointment);
      setShowAppointmentDetail(false);
    }}
  />
)}
```

## Datos de Ejemplo

La pantalla funciona con los mismos datos que el `CalendarScreen`:

```tsx
// Ejemplo de cita
const appointmentExample: CalendarEvent = {
  id: '1',
  clienteId: 'c1',
  cliente: { id: 'c1', nombre: 'Adriana Hernández', telefono: '555-0001' },
  startTime: '11:00',
  endTime: '12:30',
  date: '2025-08-21',
  estado: 'confirmada',
  total: 300,
  detalles: [
    {
      id: 'd1',
      servicioId: '1',
      servicio: { id: '1', nombre: 'Corte de dama', precio: 300, duracionMinutos: 60 },
      empleadoId: '2',
      empleado: { id: '2', name: 'Brenda', color: '#e74c3c' },
      inicioServicio: '11:00',
      duracionMinutos: 60,
      precio: 300,
    }
  ],
};
```

## Personalización

### Estilos
Todos los estilos están definidos en el archivo y pueden ser personalizados según las necesidades del diseño.

### Opciones de Dropdown
Las opciones de los dropdowns se pueden modificar en las constantes:
- `dateOptions`: Opciones de fecha
- `timeOptions`: Opciones de hora
- `clientOptions`: Lista de clientes
- `serviceOptions`: Lista de servicios

### Funcionalidad de Guardado
La función `onSave` permite manejar la lógica de guardado personalizada. Actualmente recibe el objeto de cita actualizado y lo pasa al componente padre.

## Navegación

La pantalla está diseñada como un modal o pantalla completa que se superpone sobre el contenido actual. Incluye:
- Botón de regreso en el header
- Gestión de estado para abrir/cerrar
- Integración fluida con el calendario principal

## Próximos Pasos

1. **Validación**: Agregar validación de formularios
2. **API Integration**: Conectar con endpoints para guardar cambios
3. **Estados de carga**: Agregar indicadores de carga durante las operaciones
4. **Notificaciones**: Mostrar mensajes de éxito/error
5. **Campos adicionales**: Agregar más campos según las necesidades del negocio
