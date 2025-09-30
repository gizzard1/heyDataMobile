/**
 * Calendar Constants - HeyData Mobile
 * Constantes y datos mock para el calendario
 * 
 * @format
 */

import { Worker, Servicio, CalendarEvent } from '../types';

// Trabajadoras
export const WORKERS: Worker[] = [
  { id: '1', name: 'Norma', color: '#3498db' },     // Azul
  { id: '2', name: 'Brenda', color: '#e74c3c' },    // Rojo
  { id: '3', name: 'Susana', color: '#9b59b6' },    // Púrpura
  { id: '4', name: 'Andrea', color: '#2ecc71' },    // Verde
  { id: '5', name: 'Isabel', color: '#f39c12' },    // Naranja
];

// Servicios disponibles
export const SERVICIOS: Servicio[] = [
  { id: '1', nombre: 'Corte de cabello', precio: 300, duracionMinutos: 60 },
  { id: '2', nombre: 'Tinte', precio: 500, duracionMinutos: 90 },
  { id: '3', nombre: 'Luces', precio: 800, duracionMinutos: 120 },
  { id: '4', nombre: 'Peinado', precio: 250, duracionMinutos: 45 },
  { id: '5', nombre: 'Manicure', precio: 200, duracionMinutos: 60 },
  { id: '6', nombre: 'Pedicure', precio: 250, duracionMinutos: 60 },
];

// Horarios del día (solo horas completas para agenda limpia)
export const MAIN_TIME_SLOTS = [
  '9:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Generar filas con espacios vacíos entre horas
export const TIME_SLOTS = MAIN_TIME_SLOTS.reduce((acc, time, index) => {
  // Agregar la fila de la hora principal
  acc.push({ time, isMainHour: true });
  
  // Agregar 3 filas vacías después de cada hora (incluyendo la última)
  for (let i = 1; i <= 3; i++) {
    acc.push({ time: `${time}-empty-${i}`, isMainHour: false });
  }
  
  return acc;
}, [] as { time: string; isMainHour: boolean }[]);

// Eventos de ejemplo con nueva estructura
export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    clienteId: 'c1',
    cliente: { id: 'c1', nombre: 'Ixchel García', telefono: '555-0001' },
    startTime: '10:00',
    endTime: '12:00',
    date: '2025-09-21',
    estado: 'confirmada',
    total: 800,
    detalles: [
      {
        id: 'd1',
        servicioId: '3',
        servicio: SERVICIOS[2], // Luces
        empleadoId: '1',
        empleado: WORKERS[0], // Norma
        inicioServicio: '10:00',
        duracionMinutos: 120,
        precio: 800,
      }
    ],
    // Compatibilidad
    title: 'Ixchel García - Luces',
    color: '#3498db',
    worker: 'Norma',
  },
  {
    id: '2',
    clienteId: 'c2',
    cliente: { id: 'c2', nombre: 'Adriana Hernández', telefono: '555-0002' },
    startTime: '11:00',
    endTime: '12:30',
    date: '2025-09-21',
    estado: 'confirmada',
    total: 550,
    detalles: [
      {
        id: 'd2',
        servicioId: '1',
        servicio: SERVICIOS[0], // Corte
        empleadoId: '2',
        empleado: WORKERS[1], // Brenda
        inicioServicio: '11:00',
        duracionMinutos: 60,
        precio: 300,
      },
      {
        id: 'd3',
        servicioId: '4',
        servicio: SERVICIOS[3], // Peinado
        empleadoId: '2',
        empleado: WORKERS[1], // Brenda
        inicioServicio: '12:00',
        duracionMinutos: 45,
        precio: 250,
      }
    ],
    // Compatibilidad
    title: 'Adriana Hernández - Corte + Peinado',
    color: '#e74c3c',
    worker: 'Brenda',
  },
  {
    id: '3',
    clienteId: 'c3',
    cliente: { id: 'c3', nombre: 'Sandra López', telefono: '555-0003' },
    startTime: '14:00',
    endTime: '15:00',
    date: '2025-09-21',
    estado: 'pendiente',
    total: 250,
    detalles: [
      {
        id: 'd4',
        servicioId: '4',
        servicio: SERVICIOS[3], // Peinado
        empleadoId: '3',
        empleado: WORKERS[2], // Susana
        inicioServicio: '14:00',
        duracionMinutos: 45,
        precio: 250,
      }
    ],
    // Compatibilidad
    title: 'Sandra López - Peinado',
    color: '#9b59b6',
    worker: 'Susana',
  },
];

// Configuración de columnas
export const COLUMN_CONFIG = {
  MIN_WIDTH: 200,
  MAX_WIDTH: 280,
  TIME_COLUMN_WIDTH: 60,
};

// Configuración de filas de tiempo
export const TIME_CONFIG = {
  SLOT_HEIGHT: 35,
  MAIN_HOUR_BORDER_WIDTH: 2,
  EMPTY_HOUR_BORDER_WIDTH: 1,
};

// Configuración de auto-scroll (vertical principal)
export const AUTO_SCROLL_CONFIG = {
  EDGE_THRESHOLD: 60,   // px desde el borde superior/inferior donde se activa
  SPEED: 26,            // px por frame (aprox) de desplazamiento mientras se arrastra
  SHADE_FADE_MS: 140,   // tiempo para ocultar el sombreado tras el último delta
};

// Configuración de navegación
export const NAV_CONFIG = {
  ITEMS: [
    { component: 'CalendarIcon', label: 'Agenda', active: true },
    { component: 'UsersIcon', label: 'Clientes', active: false },
    { component: 'AddIcon', label: 'Agregar', active: false },
    { component: 'BellIcon', label: 'Alertas', active: false },
    { component: 'SettingsIcon', label: 'Config', active: false },
  ]
};

// Configuración de botones flotantes
export const FLOATING_BUTTONS_CONFIG = [
  {
    id: 'appointment',
    component: 'ClockIcon',
    backgroundColor: '#4CAF50',
    label: 'Crear nueva cita',
    animation: 'left',
  },
  {
    id: 'sale',
    component: 'DollarIcon',
    backgroundColor: '#FF9500',
    label: 'Crear nueva venta',
    animation: 'center',
  },
  {
    id: 'product',
    component: 'BoxIcon',
    backgroundColor: '#9C27B0',
    label: 'Ver productos',
    animation: 'right',
  },
];
