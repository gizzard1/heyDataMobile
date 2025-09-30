# Calendar Module - Estructura Refactorizada

## 📋 Resumen
Este módulo contiene todos los componentes, hooks, utilidades y estilos relacionados con el calendario de HeyData Mobile. Se ha refactorizado desde un archivo monolítico de 3444 líneas a una estructura modular y organizada.

## 📁 Estructura del Módulo

```
src/components/Calendar/
├── index.ts                     # Exportaciones principales
├── components/
│   ├── CalendarHeader.tsx       # Header con navegación y filtros
│   ├── CalendarFilter.tsx       # Modal de filtros por trabajador
│   ├── CalendarViews.tsx        # Vistas de día, semana y mes
│   └── CalendarIcons.tsx        # Iconos SVG del calendario
├── hooks/
│   ├── useCalendarState.ts      # Estado centralizado del calendario
│   └── useFloatingButtons.ts    # Lógica de botones flotantes
├── styles/
│   ├── calendarStyles.ts        # Estilos principales del calendario
│   └── filterStyles.ts          # Estilos del filtro
├── types/
│   └── index.ts                 # Interfaces TypeScript
└── utils/
    ├── calendarUtils.ts         # Funciones utilitarias
    └── constants.ts             # Datos y configuraciones
```

## 🔧 Componentes Principales

### CalendarHeader
- **Función**: Header con navegación de fechas y botón de filtros
- **Props**: `viewMode`, `currentDate`, `onNavigateDate`, `onViewModeChange`, etc.
- **Características**: Responsive, soporte para 3 vistas

### CalendarViews  
- **DayView**: Vista diaria con scroll sincronizado y gestión de citas
- **WeekView**: Vista semanal con navegación por días
- **MonthView**: Vista mensual con selector de fechas

### CalendarFilter
- **Función**: Modal para filtrar eventos por trabajador
- **Características**: Selección múltiple, botones "Todos" y "Limpiar"

### CalendarIcons
- **Exporta**: 20+ iconos SVG utilizados en todo el calendario
- **Iconos incluidos**: FilterIcon, CalendarIcon, UsersIcon, AddIcon, etc.

## 🎣 Hooks Personalizados

### useCalendarState
- **Propósito**: Estado centralizado del calendario
- **Gestiona**: Eventos, fechas, modales, trabajadores seleccionados
- **Funciones**: Navegación, filtros, CRUD de eventos

### useFloatingButtons
- **Propósito**: Lógica de animación y estado de botones flotantes
- **Características**: Animaciones paralelas, 3 botones (Cita, Venta, Productos)

## 🛠 Utilidades

### calendarUtils.ts
- **Funciones**: `formatDate`, `getEventsForDate`, `calculateDuration`
- **Propósito**: Manipulación de fechas y eventos

### constants.ts
- **Datos**: WORKERS, SERVICIOS, TIME_SLOTS
- **Configuración**: Trabajadores, servicios disponibles, horarios

## 📱 Uso del Módulo

```typescript
import { 
  CalendarHeader, 
  CalendarViews, 
  useCalendarState 
} from '../components/Calendar';

const MyCalendar = () => {
  const calendarState = useCalendarState();
  
  return (
    <View>
      <CalendarHeader {...calendarState} />
      <DayView {...calendarState} />
    </View>
  );
};
```

## 🔄 Migración desde Archivo Original

### Antes (CalendarScreenBackup.tsx)
- ❌ **3444 líneas** en un solo archivo
- ❌ Código duplicado y difícil de mantener  
- ❌ Componentes, tipos y estilos mezclados
- ❌ Difícil testing y reutilización

### Después (Estructura actual)
- ✅ **11 archivos modulares** bien organizados
- ✅ Separación clara de responsabilidades
- ✅ Reutilización de componentes y hooks
- ✅ Fácil testing y mantenimiento
- ✅ TypeScript con tipado completo

## 🚀 Funcionalidades Preservadas

✅ **Todas las funcionalidades originales están preservadas:**
- Navegación de calendario (día/semana/mes)
- Sistema de citas y eventos
- Filtros por trabajador
- Botones flotantes animados
- Pantallas modales (clientes, configuración, etc.)
- Redimensionamiento y movimiento de citas
- Sincronización de scroll en vista diaria

## 📝 Notas de Desarrollo

- **TypeScript**: Tipado completo en todos los componentes
- **React Native**: Compatible con iOS, Android y Web
- **Animaciones**: Usando Animated API nativo
- **SVG**: Iconos vectoriales con react-native-svg
- **Performance**: Hooks optimizados con useCallback y useMemo

## 🔍 Testing

Para probar los componentes individualmente:

```bash
# Compilar y verificar errores
npx tsc --noEmit

# Ejecutar la aplicación
npx react-native run-android
# o
npx react-native run-ios
```

---

**✨ Refactorización completada exitosamente manteniendo toda la funcionalidad original**