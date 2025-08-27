/**
 * Calendar Screen - HeyData Mobile
 * Vista completa del calendario con navegación de días, semanas y meses
 * 
 * @format
 */

import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
  Modal,
  Easing,
} from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Componente del ícono de filtro
const FilterIcon = ({ color = '#007AFF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M20.058 9.72255C21.0065 9.18858 21.4808 8.9216 21.7404 8.49142C22 8.06124 22 7.54232 22 6.50448V5.81466C22 4.48782 22 3.8244 21.5607 3.4122C21.1213 3 20.4142 3 19 3H5C3.58579 3 2.87868 3 2.43934 3.4122C2 3.8244 2 4.48782 2 5.81466V6.50448C2 7.54232 2 8.06124 2.2596 8.49142C2.5192 8.9216 2.99347 9.18858 3.94202 9.72255L6.85504 11.3624C7.49146 11.7206 7.80967 11.8998 8.03751 12.0976C8.51199 12.5095 8.80408 12.9935 8.93644 13.5872C9 13.8722 9 14.2058 9 14.8729L9 17.5424C9 18.452 9 18.9067 9.25192 19.2613C9.50385 19.6158 9.95128 19.7907 10.8462 20.1406C12.7248 20.875 13.6641 21.2422 14.3321 20.8244C15 20.4066 15 19.4519 15 17.5424V14.8729C15 14.2058 15 13.8722 15.0636 13.5872C15.1959 12.9935 15.488 12.5095 15.9625 12.0976" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </Svg>
);

// Componente del ícono de calendario
const CalendarIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Componente del ícono de usuarios/clientes
const UsersIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 19.9999C21 18.2583 19.3304 16.7767 17 16.2275M15 20C15 17.7909 12.3137 16 9 16C5.68629 16 3 17.7909 3 20M15 13C17.2091 13 19 11.2091 19 9C19 6.79086 17.2091 5 15 5M9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9C13 11.2091 11.2091 13 9 13Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Componente del ícono de agregar
const AddIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M8 12H12M12 12H16M12 12V16M12 12V8M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Componente del ícono de alertas/notificaciones
const BellIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M11.7258 7.34056C12.1397 7.32632 12.4638 6.97919 12.4495 6.56522C12.4353 6.15125 12.0882 5.8272 11.6742 5.84144L11.7258 7.34056ZM7.15843 11.562L6.40879 11.585C6.40906 11.5938 6.40948 11.6026 6.41006 11.6114L7.15843 11.562ZM5.87826 14.979L6.36787 15.5471C6.38128 15.5356 6.39428 15.5236 6.40684 15.5111L5.87826 14.979ZM5.43951 15.342L5.88007 15.949C5.89245 15.94 5.90455 15.9306 5.91636 15.9209L5.43951 15.342ZM9.74998 17.75C10.1642 17.75 10.5 17.4142 10.5 17C10.5 16.5858 10.1642 16.25 9.74998 16.25V17.75ZM11.7258 5.84144C11.3118 5.8272 10.9647 6.15125 10.9504 6.56522C10.9362 6.97919 11.2602 7.32632 11.6742 7.34056L11.7258 5.84144ZM16.2415 11.562L16.9899 11.6113C16.9905 11.6025 16.9909 11.5938 16.9912 11.585L16.2415 11.562ZM17.5217 14.978L16.9931 15.5101C17.0057 15.5225 17.0187 15.5346 17.0321 15.5461L17.5217 14.978ZM17.9605 15.341L17.4836 15.9199C17.4952 15.9294 17.507 15.9386 17.5191 15.9474L17.9605 15.341ZM13.65 16.25C13.2358 16.25 12.9 16.5858 12.9 17C12.9 17.4142 13.2358 17.75 13.65 17.75V16.25ZM10.95 6.591C10.95 7.00521 11.2858 7.341 11.7 7.341C12.1142 7.341 12.45 7.00521 12.45 6.591H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM9.74998 16.25C9.33577 16.25 8.99998 16.5858 8.99998 17C8.99998 17.4142 9.33577 17.75 9.74998 17.75V16.25ZM13.65 17.75C14.0642 17.75 14.4 17.4142 14.4 17C14.4 16.5858 14.0642 16.25 13.65 16.25V17.75ZM10.5 17C10.5 16.5858 10.1642 16.25 9.74998 16.25C9.33577 16.25 8.99998 16.5858 8.99998 17H10.5ZM14.4 17C14.4 16.5858 14.0642 16.25 13.65 16.25C13.2358 16.25 12.9 16.5858 12.9 17H14.4ZM11.6742 5.84144C8.65236 5.94538 6.31509 8.53201 6.40879 11.585L7.90808 11.539C7.83863 9.27613 9.56498 7.41488 11.7258 7.34056L11.6742 5.84144ZM6.41006 11.6114C6.48029 12.6748 6.08967 13.7118 5.34968 14.4469L6.40684 15.5111C7.45921 14.4656 8.00521 13.0026 7.9068 11.5126L6.41006 11.6114ZM5.38865 14.4109C5.23196 14.5459 5.10026 14.6498 4.96265 14.7631L5.91636 15.9209C6.0264 15.8302 6.195 15.6961 6.36787 15.5471L5.38865 14.4109ZM4.99895 14.735C4.77969 14.8942 4.58045 15.1216 4.43193 15.3617C4.28525 15.5987 4.14491 15.9178 4.12693 16.2708C4.10726 16.6569 4.24026 17.0863 4.63537 17.3884C4.98885 17.6588 5.45464 17.75 5.94748 17.75V16.25C5.78415 16.25 5.67611 16.234 5.60983 16.2171C5.54411 16.2004 5.53242 16.1861 5.54658 16.1969C5.56492 16.211 5.59211 16.2408 5.61004 16.2837C5.62632 16.3228 5.62492 16.3484 5.62499 16.3472C5.62513 16.3443 5.62712 16.3233 5.6414 16.2839C5.65535 16.2454 5.67733 16.1997 5.70749 16.151C5.73748 16.1025 5.77159 16.0574 5.80538 16.0198C5.84013 15.981 5.86714 15.9583 5.88007 15.949L4.99895 14.735ZM5.94748 17.75H9.74998V16.25H5.94748V17.75ZM11.6742 7.34056C13.835 7.41488 15.5613 9.27613 15.4919 11.539L16.9912 11.585C17.0849 8.53201 14.7476 5.94538 11.7258 5.84144L11.6742 7.34056ZM15.4932 11.5127C15.3951 13.0024 15.9411 14.4649 16.9931 15.5101L18.0503 14.4459C17.3105 13.711 16.9199 12.6744 16.9899 11.6113L15.4932 11.5127ZM17.0321 15.5461C17.205 15.6951 17.3736 15.8292 17.4836 15.9199L18.4373 14.7621C18.2997 14.6488 18.168 14.5449 18.0113 14.4099L17.0321 15.5461ZM17.5191 15.9474C17.5325 15.9571 17.5599 15.9802 17.5949 16.0193C17.629 16.0573 17.6634 16.1026 17.6937 16.1514C17.7241 16.2004 17.7463 16.2463 17.7604 16.285C17.7748 16.3246 17.7769 16.3457 17.777 16.3485C17.7771 16.3497 17.7756 16.3238 17.792 16.2844C17.81 16.241 17.8375 16.211 17.856 16.1968C17.8702 16.1859 17.8585 16.2002 17.7925 16.217C17.7259 16.234 17.6174 16.25 17.4535 16.25V17.75C17.9468 17.75 18.4132 17.6589 18.7669 17.3885C19.1628 17.0859 19.2954 16.6557 19.2749 16.2693C19.2562 15.9161 19.1151 15.5972 18.9682 15.3604C18.8194 15.1206 18.6202 14.8936 18.4018 14.7346L17.5191 15.9474ZM17.4535 16.25H13.65V17.75H17.4535V16.25ZM12.45 6.591V5H10.95V6.591H12.45ZM9.74998 17.75H13.65V16.25H9.74998V17.75ZM8.99998 17C8.99998 18.5008 10.191 19.75 11.7 19.75V18.25C11.055 18.25 10.5 17.7084 10.5 17H8.99998ZM11.7 19.75C13.2089 19.75 14.4 18.5008 14.4 17H12.9C12.9 17.7084 12.3449 18.25 11.7 18.25V19.75Z" 
      fill={color}
    />
  </Svg>
);

// Componente del ícono de configuración
const SettingsIcon = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path 
      clipRule="evenodd" 
      d="M14 20C17.3137 20 20 17.3137 20 14C20 10.6863 17.3137 8 14 8C10.6863 8 8 10.6863 8 14C8 17.3137 10.6863 20 14 20ZM18 14C18 16.2091 16.2091 18 14 18C11.7909 18 10 16.2091 10 14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14Z" 
      fill={color} 
      fillRule="evenodd"
    />
    <Path 
      clipRule="evenodd" 
      d="M0 12.9996V14.9996C0 16.5478 1.17261 17.822 2.67809 17.9826C2.80588 18.3459 2.95062 18.7011 3.11133 19.0473C2.12484 20.226 2.18536 21.984 3.29291 23.0916L4.70712 24.5058C5.78946 25.5881 7.49305 25.6706 8.67003 24.7531C9.1044 24.9688 9.55383 25.159 10.0163 25.3218C10.1769 26.8273 11.4511 28 12.9993 28H14.9993C16.5471 28 17.8211 26.8279 17.9821 25.3228C18.4024 25.175 18.8119 25.0046 19.2091 24.8129C20.3823 25.6664 22.0344 25.564 23.0926 24.5058L24.5068 23.0916C25.565 22.0334 25.6674 20.3813 24.814 19.2081C25.0054 18.8113 25.1757 18.4023 25.3234 17.9824C26.8282 17.8211 28 16.5472 28 14.9996V12.9996C28 11.452 26.8282 10.1782 25.3234 10.0169C25.1605 9.55375 24.9701 9.10374 24.7541 8.66883C25.6708 7.49189 25.5882 5.78888 24.5061 4.70681L23.0919 3.29259C21.9846 2.18531 20.2271 2.12455 19.0485 3.1103C18.7017 2.94935 18.3459 2.80441 17.982 2.67647C17.8207 1.17177 16.5468 0 14.9993 0H12.9993C11.4514 0 10.1773 1.17231 10.0164 2.6775C9.60779 2.8213 9.20936 2.98653 8.82251 3.17181C7.64444 2.12251 5.83764 2.16276 4.70782 3.29259L3.2936 4.7068C2.16377 5.83664 2.12352 7.64345 3.17285 8.82152C2.98737 9.20877 2.82199 9.60763 2.67809 10.0167C1.17261 10.1773 0 11.4515 0 12.9996ZM15.9993 3C15.9993 2.44772 15.5516 2 14.9993 2H12.9993C12.447 2 11.9993 2.44772 11.9993 3V3.38269C11.9993 3.85823 11.6626 4.26276 11.2059 4.39542C10.4966 4.60148 9.81974 4.88401 9.18495 5.23348C8.76836 5.46282 8.24425 5.41481 7.90799 5.07855L7.53624 4.70681C7.14572 4.31628 6.51256 4.31628 6.12203 4.7068L4.70782 6.12102C4.31729 6.51154 4.31729 7.14471 4.70782 7.53523L5.07958 7.90699C5.41584 8.24325 5.46385 8.76736 5.23451 9.18395C4.88485 9.8191 4.6022 10.4963 4.39611 11.2061C4.2635 11.6629 3.85894 11.9996 3.38334 11.9996H3C2.44772 11.9996 2 12.4474 2 12.9996V14.9996C2 15.5519 2.44772 15.9996 3 15.9996H3.38334C3.85894 15.9996 4.26349 16.3364 4.39611 16.7931C4.58954 17.4594 4.85042 18.0969 5.17085 18.6979C5.39202 19.1127 5.34095 19.6293 5.00855 19.9617L4.70712 20.2632C4.3166 20.6537 4.3166 21.2868 4.70712 21.6774L6.12134 23.0916C6.51186 23.4821 7.14503 23.4821 7.53555 23.0916L7.77887 22.8483C8.11899 22.5081 8.65055 22.4633 9.06879 22.7008C9.73695 23.0804 10.4531 23.3852 11.2059 23.6039C11.6626 23.7365 11.9993 24.1411 11.9993 24.6166V25C11.9993 25.5523 12.447 26 12.9993 26H14.9993C15.5516 26 15.9993 25.5523 15.9993 25V24.6174C15.9993 24.1418 16.3361 23.7372 16.7929 23.6046C17.5032 23.3985 18.1809 23.1157 18.8164 22.7658C19.233 22.5365 19.7571 22.5845 20.0934 22.9208L20.2642 23.0916C20.6547 23.4821 21.2879 23.4821 21.6784 23.0916L23.0926 21.6774C23.4831 21.2868 23.4831 20.6537 23.0926 20.2632L22.9218 20.0924C22.5855 19.7561 22.5375 19.232 22.7669 18.8154C23.1166 18.1802 23.3992 17.503 23.6053 16.7931C23.7379 16.3364 24.1425 15.9996 24.6181 15.9996H25C25.5523 15.9996 26 15.5519 26 14.9996V12.9996C26 12.4474 25.5523 11.9996 25 11.9996H24.6181C24.1425 11.9996 23.7379 11.6629 23.6053 11.2061C23.3866 10.4529 23.0817 9.73627 22.7019 9.06773C22.4643 8.64949 22.5092 8.11793 22.8493 7.77781L23.0919 7.53523C23.4824 7.14471 23.4824 6.51154 23.0919 6.12102L21.6777 4.7068C21.2872 4.31628 20.654 4.31628 20.2635 4.7068L19.9628 5.00748C19.6304 5.33988 19.1137 5.39096 18.6989 5.16979C18.0976 4.84915 17.4596 4.58815 16.7929 4.39467C16.3361 4.2621 15.9993 3.85752 15.9993 3.38187V3Z" 
      fill={color} 
      fillRule="evenodd"
    />
  </Svg>
);

// Componente del ícono de papelera
const TrashIcon = ({ color = '#FF3B30', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Componente del ícono de editar
const EditIcon = ({ color = '#007AFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2"
    />
    <Polygon 
      fill="none" 
      points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2"
    />
  </Svg>
);

// Componente del ícono de regresar
const BackIcon = ({ color = '#007AFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 12H5M12 19l-7-7 7-7" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

interface Cliente {
  id: string;
  nombre: string;
  telefono?: string;
}

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracionMinutos: number;
}

interface DetalleCita {
  id: string;
  servicioId: string;
  servicio: Servicio;
  empleadoId: string;
  empleado: Worker;
  inicioServicio: string; // HH:MM
  duracionMinutos: number;
  precio: number;
}

interface CalendarEvent {
  id: string;
  clienteId: string;
  cliente: Cliente;
  startTime: string; // Inicio de toda la cita
  endTime: string;   // Fin de toda la cita
  date: string; // YYYY-MM-DD format
  detalles: DetalleCita[]; // Array de servicios/empleados
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  total: number;
  // Para compatibilidad con el código actual
  title?: string;
  color?: string;
  worker?: string;
}

interface Worker {
  id: string;
  name: string;
  color: string;
}

const CalendarScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState('Agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day'); // Cambiar default a 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Estados para filtro
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(['1', '2', '3', '4', '5']); // Inicializar con todas las trabajadoras
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  
  // Estados para detalles de cita
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);



  // Referencias para sincronizar scroll (estilo Excel)
  const headerScrollRef = useRef<ScrollView>(null);
  const timeScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);

  // Banderas para evitar sincronización circular
  const isScrollingFromHeader = useRef(false);
  const isScrollingFromContent = useRef(false);
  const isScrollingFromTime = useRef(false);
  const isScrollingFromMain = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Funciones helper para scroll suave
  const smoothScrollToTime = (hour: number) => {
    const targetY = (hour - 6) * 140; // 35px * 4 rows per hour
    if (mainScrollRef.current && timeScrollRef.current) {
      mainScrollRef.current.scrollTo({ y: targetY, animated: true });
      timeScrollRef.current.scrollTo({ y: targetY, animated: true });
    }
  };

  const smoothScrollToWorker = (workerIndex: number) => {
    const targetX = workerIndex * 120; // Ancho de columna de trabajadora
    if (headerScrollRef.current && contentScrollRef.current) {
      headerScrollRef.current.scrollTo({ x: targetX, animated: true });
      contentScrollRef.current.scrollTo({ x: targetX, animated: true });
    }
  };





  // Trabajadoras
  const workers: Worker[] = [
    { id: '1', name: 'Norma', color: '#3498db' },     // Azul
    { id: '2', name: 'Brenda', color: '#e74c3c' },    // Rojo
    { id: '3', name: 'Susana', color: '#9b59b6' },    // Púrpura
    { id: '4', name: 'Andrea', color: '#2ecc71' },    // Verde
    { id: '5', name: 'Isabel', color: '#f39c12' },    // Naranja
  ];

  // Funciones para el filtro
  const handleWorkerToggle = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const applyFilters = () => {
    // Si no hay trabajadoras seleccionadas, seleccionar todas por defecto
    if (selectedWorkers.length === 0) {
      setSelectedWorkers(workers.map(w => w.id));
    }
    setShowFilterModal(false);
  };

  const setAllWorkers = () => {
    setSelectedWorkers(workers.map(w => w.id));
  };

  const clearAllWorkers = () => {
    setSelectedWorkers([]);
  };

  // Funciones para detalles de cita
  const openEventDetails = (event: CalendarEvent) => {
    console.log('Opening event details:', event);
    // Validar que el evento tenga los campos requeridos
    const validEvent = {
      ...event,
      title: event.title || 'Sin título',
      worker: event.worker || 'Sin asignar',
      startTime: event.startTime || '00:00',
      endTime: event.endTime || '01:00',
      date: event.date || '2025-08-21'
    };
    setSelectedEvent(validEvent);
    setShowEventModal(true);
  };

  const closeEventDetails = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Función para calcular la duración
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '1 hora';
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '1 hora';
    
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    }
    
    return '30 min';
  };

  // Función para formatear fecha de manera segura
  const formatEventDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha no disponible';
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getVisibleWorkers = () => {
    if (selectedWorkers.length === 0) {
      return workers; // Si no hay trabajadoras seleccionadas, mostrar todas
    }
    return workers.filter(worker => selectedWorkers.includes(worker.id));
  };

  // Calcular ancho dinámico de columnas basándose en trabajadoras visibles
  const getColumnWidth = () => {
    const visibleWorkers = getVisibleWorkers();
    const minWidth = 200; // Aumentado de 160 a 200 (+25% más ancho)
    const maxWidth = 280; // Aumentado de 220 a 280 (+27% más ancho)
    const availableWidth = width - 80; // Restamos espacio para la columna de tiempo
    
    if (visibleWorkers.length === 0) return minWidth;
    
    const calculatedWidth = availableWidth / visibleWorkers.length;
    return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
  };

  // Horarios del día (solo horas completas para agenda limpia)
  const mainTimeSlots = [
    '9:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Generar filas con espacios vacíos entre horas
  const timeSlots = mainTimeSlots.reduce((acc, time, index) => {
    // Agregar la fila de la hora principal
    acc.push({ time, isMainHour: true });
    
    // Agregar 3 filas vacías después de cada hora (excepto la última)
    if (index < mainTimeSlots.length - 1) {
      for (let i = 1; i <= 3; i++) {
        acc.push({ time: `${time}-empty-${i}`, isMainHour: false });
      }
    }
    
    return acc;
  }, [] as { time: string; isMainHour: boolean }[]);

  // Servicios disponibles
  const servicios: Servicio[] = [
    { id: '1', nombre: 'Corte de cabello', precio: 300, duracionMinutos: 60 },
    { id: '2', nombre: 'Tinte', precio: 500, duracionMinutos: 90 },
    { id: '3', nombre: 'Luces', precio: 800, duracionMinutos: 120 },
    { id: '4', nombre: 'Peinado', precio: 250, duracionMinutos: 45 },
    { id: '5', nombre: 'Manicure', precio: 200, duracionMinutos: 60 },
    { id: '6', nombre: 'Pedicure', precio: 250, duracionMinutos: 60 },
  ];

  // Eventos de ejemplo con nueva estructura
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      clienteId: 'c1',
      cliente: { id: 'c1', nombre: 'Ixchel García', telefono: '555-0001' },
      startTime: '10:00',
      endTime: '12:00',
      date: '2025-08-21',
      estado: 'confirmada',
      total: 800,
      detalles: [
        {
          id: 'd1',
          servicioId: '3',
          servicio: servicios[2], // Luces
          empleadoId: '1',
          empleado: workers[0], // Norma
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
      date: '2025-08-21',
      estado: 'confirmada',
      total: 550,
      detalles: [
        {
          id: 'd2',
          servicioId: '1',
          servicio: servicios[0], // Corte
          empleadoId: '2',
          empleado: workers[1], // Brenda
          inicioServicio: '11:00',
          duracionMinutos: 60,
          precio: 300,
        },
        {
          id: 'd3',
          servicioId: '4',
          servicio: servicios[3], // Peinado
          empleadoId: '2',
          empleado: workers[1], // Brenda
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
      date: '2025-08-21',
      estado: 'pendiente',
      total: 250,
      detalles: [
        {
          id: 'd4',
          servicioId: '4',
          servicio: servicios[3], // Peinado
          empleadoId: '3',
          empleado: workers[2], // Susana
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
  ]);



  // Obtener información del mes actual
  const getMonthInfo = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return { firstDay, lastDay, days };
  };

  // Navegación de fechas
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Formatear mes y año
  const formatMonthYear = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Navegar entre meses
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Verificar si una fecha es hoy
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar si una fecha está seleccionada
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Verificar si una fecha está en el mes actual
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      // Filtrar por fecha
      if (event.date !== dateString) return false;
      
      // Aplicar filtros de trabajadoras
      if (selectedWorkers.length > 0) {
        const workerName = event.worker;
        const workerId = workers.find(w => w.name === workerName)?.id;
        if (workerId && !selectedWorkers.includes(workerId)) {
          return false;
        }
      }
      
      return true;
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {viewMode === 'day' ? (
        // Header para vista diaria con selector de mes
        <>
          <TouchableOpacity 
            style={styles.monthSelector}
            onPress={() => setShowMonthPicker(!showMonthPicker)}
          >
            <Text style={styles.monthSelectorText}>
              {formatMonthYear(currentDate)}
            </Text>
            <Text style={styles.monthSelectorArrow}>▼</Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <FilterIcon color="#007AFF" size={18} />
              <Text style={styles.filterButtonText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Header original para otras vistas
        <>
          <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {formatMonthYear(currentDate)}
            </Text>
            <View style={styles.viewModeSelector}>
              {(['day', 'week', 'month'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.viewModeButton, viewMode === mode && styles.activeViewMode]}
                  onPress={() => setViewMode(mode)}
                >
                  <Text style={[styles.viewModeText, viewMode === mode && styles.activeViewModeText]}>
                    {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    // Función para obtener eventos de una trabajadora en un horario específico
    const getEventForWorkerAtTime = (workerName: string, time: string) => {
      return dayEvents.find(event => {
        if (event.worker !== workerName) return false;
        
        // Convertir horarios a minutos para comparación más precisa
        const [eventStartHour, eventStartMin] = event.startTime.split(':').map(Number);
        const [eventEndHour, eventEndMin] = event.endTime.split(':').map(Number);
        const [slotHour, slotMin] = time.split(':').map(Number);
        
        const eventStartTotal = eventStartHour * 60 + eventStartMin;
        const eventEndTotal = eventEndHour * 60 + eventEndMin;
        const slotTotal = slotHour * 60 + slotMin;
        
        // El evento se muestra si el slot está dentro del rango del evento
        return slotTotal >= eventStartTotal && slotTotal < eventEndTotal;
      });
    };

    // Función mejorada para verificar si un evento comienza en este slot específico
    const isEventStart = (event: CalendarEvent, time: string) => {
      return event.startTime === time;
    };

    // Función para calcular la altura del evento basado en duración
    const getEventHeight = (startTime: string, endTime: string) => {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startTotalMin = startHour * 60 + startMin;
      const endTotalMin = endHour * 60 + endMin;
      const durationMin = endTotalMin - startTotalMin;
      
      // Cada slot de 15 min = 35px, así que cada minuto = 35/15 ≈ 2.33px
      const heightPerMinute = 35 / 15;
      return Math.max(durationMin * heightPerMinute - 4, 30); // Mínimo 30px, restar 4px para el margen
    };

    // Función para calcular la posición superior del evento
    const getEventTopPosition = (startTime: string) => {
      const [startHour, startMin] = startTime.split(':').map(Number);
      
      // Encontrar el índice del slot de la hora de inicio
      const startHourSlotIndex = timeSlots.findIndex(slot => 
        slot.isMainHour && slot.time === `${startHour}:00`
      );
      
      if (startHourSlotIndex === -1) return 0;
      
      // Calcular los minutos adicionales después de la hora
      const additionalMinutes = startMin;
      const rowHeight = 35;
      
      // Cada 15 minutos = 1 fila, así que dividimos los minutos adicionales entre 15
      const additionalRows = Math.floor(additionalMinutes / 15);
      const pixelsPerMinute = rowHeight / 15;
      const remainingMinutes = additionalMinutes % 15;
      
      return (startHourSlotIndex + additionalRows) * rowHeight + (remainingMinutes * pixelsPerMinute);
    };

    return (
      <View style={styles.dayViewContainer}>
        {/* Header con trabajadoras - FIJO */}
        <View style={styles.workersHeaderFixed}>
          <View style={styles.timeColumnHeaderFixed} />
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={headerScrollRef}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            directionalLockEnabled={true}
            decelerationRate="fast"
            bounces={false}
            pagingEnabled={false}
            onScroll={(event) => {
              if (isScrollingFromContent.current) return;
              
              const scrollX = event.nativeEvent.contentOffset.x;
              isScrollingFromHeader.current = true;
              
              if (contentScrollRef.current) {
                contentScrollRef.current.scrollTo({ x: scrollX, animated: false });
              }
              
              // Limpiar la bandera después de un breve delay
              if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
              scrollTimeout.current = setTimeout(() => {
                isScrollingFromHeader.current = false;
              }, 50);
            }}
          >
            <View style={styles.workersHeaderContent}>
              {getVisibleWorkers().map(worker => (
                <View key={worker.id} style={[styles.workerColumnFixed, { width: getColumnWidth() }]}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>



        {/* Contenido principal con scroll bidireccional */}
        <View style={styles.mainContentContainer}>
          {/* Columna de horarios fija a la izquierda */}
          <View style={styles.timeColumnContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={timeScrollRef}
              scrollEventThrottle={16}
              removeClippedSubviews={true}
              decelerationRate="fast"
              bounces={true}
              onScroll={(event) => {
                if (isScrollingFromMain.current) return;
                
                const scrollY = event.nativeEvent.contentOffset.y;
                isScrollingFromTime.current = true;
                
                if (mainScrollRef.current) {
                  mainScrollRef.current.scrollTo({ y: scrollY, animated: false });
                }
                
                // Limpiar la bandera más rápido para mejor sincronización
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                  isScrollingFromTime.current = false;
                }, 16);
              }}
            >
              {timeSlots.map((timeSlot, index) => (
                <View key={timeSlot.time} style={[
                  styles.timeSlotFixed,
                  timeSlot.isMainHour ? styles.mainHourSlot : styles.emptyHourSlot
                ]}>
                  <Text style={[
                    styles.timeLabel,
                    timeSlot.isMainHour ? styles.mainHourLabel : styles.emptyHourLabel
                  ]}>
                    {timeSlot.isMainHour ? timeSlot.time : ''}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Área de contenido scrollable */}
          <ScrollView
            style={styles.contentScrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ref={mainScrollRef}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            decelerationRate="fast"
            bounces={true}
            nestedScrollEnabled={true}
            onScroll={(event) => {
              if (isScrollingFromTime.current) return;
              
              const scrollY = event.nativeEvent.contentOffset.y;
              isScrollingFromMain.current = true;
              
              if (timeScrollRef.current) {
                timeScrollRef.current.scrollTo({ y: scrollY, animated: false });
              }
              
              // Limpiar la bandera más rápido para mejor sincronización
              if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
              scrollTimeout.current = setTimeout(() => {
                isScrollingFromMain.current = false;
              }, 16);
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={contentScrollRef}
              scrollEventThrottle={16}
              removeClippedSubviews={true}
              directionalLockEnabled={true}
              decelerationRate="fast"
              bounces={false}
              nestedScrollEnabled={true}
              onScroll={(event) => {
                if (isScrollingFromHeader.current) return;
                
                const scrollX = event.nativeEvent.contentOffset.x;
                isScrollingFromContent.current = true;
                
                if (headerScrollRef.current) {
                  headerScrollRef.current.scrollTo({ x: scrollX, animated: false });
                }
                
                // Limpiar la bandera después de un breve delay
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                  isScrollingFromContent.current = false;
                }, 50);
              }}
            >
              <View style={styles.calendarGrid}>
                  {timeSlots.map((timeSlot, index) => (
                    <View key={timeSlot.time} style={[
                      styles.timeRowContent,
                      timeSlot.isMainHour ? styles.mainHourRow : styles.emptyHourRow
                    ]}>
                      {getVisibleWorkers().map(worker => {
                        return (
                          <View key={worker.id} style={[styles.workerTimeSlotFixed, { width: getColumnWidth() }]}>
                            {/* Las citas se renderizarán en un contenedor superior */}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                  
                  {/* Contenedor absoluto para las citas */}
                  <View style={styles.eventsContainer}>
                    {getVisibleWorkers().map((worker, workerIndex) => {
                      const workerEvents = dayEvents.filter(event => event.worker === worker.name);
                      return workerEvents.map(event => (
                        <TouchableOpacity 
                          key={event.id}
                          style={[
                            styles.appointmentCard,
                            { 
                              left: workerIndex * getColumnWidth(),
                              width: getColumnWidth() - 12, // Restamos la separación derecha
                              top: getEventTopPosition(event.startTime),
                              height: getEventHeight(event.startTime, event.endTime),
                            }
                          ]}
                          onPress={() => openEventDetails(event)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.appointmentTime}>
                            {event.startTime} - {event.endTime}
                          </Text>
                          <Text style={styles.appointmentTitle}>
                            {event.cliente.nombre}
                          </Text>
                          <View style={styles.servicesList}>
                            {event.detalles.map((detalle, index) => (
                              <Text key={index} style={styles.serviceItem}>
                                • {detalle.servicio.nombre}
                              </Text>
                            ))}
                          </View>
                        </TouchableOpacity>
                      ));
                    })}
                  </View>
                </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <View style={styles.weekView}>
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.weekDayHeader}
              onPress={() => {
                setSelectedDate(day);
                setViewMode('day');
                setCurrentDate(day);
              }}
            >
              <Text style={styles.weekDayName}>
                {day.toLocaleDateString('es-ES', { weekday: 'short' })}
              </Text>
              <Text style={[styles.weekDayNumber, isToday(day) && styles.todayNumber]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView 
          style={styles.weekContent} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={true}
        >
          {Array.from({ length: 17 }, (_, i) => i + 6).map(hour => (
            <View key={hour} style={styles.weekHourRow}>
              <Text style={styles.weekHourLabel}>{`${hour}:00`}</Text>
              <View style={styles.weekHourContent}>
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day).filter(
                    event => parseInt(event.startTime.split(':')[0]) === hour
                  );
                  return (
                    <View key={dayIndex} style={styles.weekDayColumn}>
                      {dayEvents.map(event => (
                        <TouchableOpacity key={event.id} style={[styles.weekEventCard, { backgroundColor: event.color }]}>
                          <Text style={styles.weekEventTitle} numberOfLines={2}>{event.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMonthView = () => {
    const { days } = getMonthInfo(currentDate);
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <ScrollView 
        style={styles.monthView} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={true}
      >
        <View style={styles.monthHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.monthWeekDay}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.monthGrid}>
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDay,
                  !isCurrentMonth(day) && styles.otherMonthDay,
                  isToday(day) && styles.todayDay,
                  isSelected(day) && styles.selectedDay,
                ]}
                onPress={() => {
                  setSelectedDate(day);
                  setCurrentDate(day);
                  if (showMonthPicker) {
                    setViewMode('day');
                    setShowMonthPicker(false);
                  } else if (dayEvents.length > 0) {
                    setViewMode('day');
                  }
                }}
              >
                <Text style={[
                  styles.monthDayText,
                  !isCurrentMonth(day) && styles.otherMonthDayText,
                  isToday(day) && styles.todayDayText,
                  isSelected(day) && styles.selectedDayText,
                ]}>
                  {day.getDate()}
                </Text>
                {dayEvents.length > 0 && (
                  <View style={styles.eventIndicator}>
                    <Text style={styles.eventCount}>{dayEvents.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderMonthView();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <View style={styles.contentContainer}>
        {renderHeader()}
        {renderCalendarContent()}
      </View>

      {/* Dropdown selector de mes */}
      {showMonthPicker && (
        <>
          {/* Overlay transparente para cerrar */}
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            onPress={() => setShowMonthPicker(false)}
            activeOpacity={1}
          />
          {/* Dropdown calendar */}
          <View style={styles.monthDropdown}>
            <View style={styles.dropdownHeader}>
              <TouchableOpacity 
                onPress={() => navigateMonth(-1)}
                style={styles.monthNavButton}
              >
                <Text style={styles.monthNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.dropdownTitle}>
                {formatMonthYear(currentDate)}
              </Text>
              <TouchableOpacity 
                onPress={() => navigateMonth(1)}
                style={styles.monthNavButton}
              >
                <Text style={styles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>
            {renderMonthView()}
          </View>
        </>
      )}

      {/* Modal de Filtro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterHeader}>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.filterBackButton}
              >
                <FilterIcon color="#007AFF" size={18} />
                <Text style={styles.filterBackButtonText}>Filtrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterContent}>
              {/* Solo yo */}
              <View style={styles.filterOption}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setOnlyMyTasks(!onlyMyTasks)}
                >
                  <Text style={styles.checkboxIcon}>
                    {onlyMyTasks ? '☑' : '☐'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.filterOptionText}>Sólo yo</Text>
              </View>

              {/* Todos los empleados */}
              <View style={styles.filterOption}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => {
                    if (selectedWorkers.length === workers.length) {
                      clearAllWorkers();
                    } else {
                      setAllWorkers();
                    }
                  }}
                >
                  <Text style={styles.checkboxIcon}>
                    {selectedWorkers.length === workers.length ? '☑' : '☐'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.filterOptionText}>Todos los empleados</Text>
              </View>

              {/* Lista de trabajadoras */}
              {workers.map((worker) => (
                <View key={worker.id} style={styles.filterOption}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => handleWorkerToggle(worker.id)}
                  >
                    <Text style={styles.checkboxIcon}>
                      {selectedWorkers.includes(worker.id) ? '☑' : '☐'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.filterOptionText}>{worker.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.filterButtons}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  setAllWorkers();
                  setOnlyMyTasks(false);
                }}
              >
                <Text style={styles.presetButtonText}>Predeterminado</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalles de Cita */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showEventModal}
        onRequestClose={closeEventDetails}
      >
        <View style={styles.appointmentDetailContainer}>
          {/* Header */}
          <View style={styles.appointmentDetailHeader}>
            <TouchableOpacity 
              onPress={closeEventDetails}
              style={styles.backButton}
            >
              <BackIcon color="#007AFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.appointmentDetailTitle}>
              Cita agendada #{selectedEvent?.id || ''}
            </Text>
            <TouchableOpacity style={styles.editIconButton}>
              <EditIcon color="#007AFF" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentDetailContent}>
            {selectedEvent ? (
              <>
                {/* Horario y Fecha */}
                <View style={styles.appointmentDetailCard}>
                  <View style={styles.appointmentDetailRow}>
                    <View style={styles.appointmentDetailColumn}>
                      <Text style={styles.appointmentDetailLabel}>Horario</Text>
                      <Text style={styles.appointmentDetailValue}>
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </Text>
                    </View>
                    <View style={styles.appointmentDetailColumn}>
                      <Text style={styles.appointmentDetailLabel}>Fecha</Text>
                      <Text style={styles.appointmentDetailValue}>Hoy</Text>
                    </View>
                  </View>
                </View>

                {/* Cliente */}
                <View style={styles.appointmentDetailCard}>
                  <Text style={styles.appointmentDetailLabel}>Cliente</Text>
                  <Text style={styles.appointmentDetailClientName}>
                    {selectedEvent.cliente?.nombre || selectedEvent.title || 'Sin cliente'}
                  </Text>
                </View>

                {/* Detalles de Servicios */}
                <View style={styles.appointmentDetailCard}>
                  <Text style={styles.appointmentDetailSectionTitle}>Detalles</Text>
                  {selectedEvent.detalles?.map((detalle, index) => (
                    <View key={detalle.id || index} style={styles.serviceDetailItem}>
                      <View style={styles.serviceDetailBorder} />
                      <View style={styles.serviceDetailContent}>
                        <Text style={styles.serviceDetailTitle}>
                          {detalle.servicio?.nombre || 'Servicio'}
                        </Text>
                        <Text style={styles.serviceDetailTime}>
                          {detalle.inicioServicio} - {(() => {
                            const [hour, min] = detalle.inicioServicio.split(':').map(Number);
                            const endMinutes = hour * 60 + min + (detalle.duracionMinutos || 0);
                            const endHour = Math.floor(endMinutes / 60);
                            const endMin = endMinutes % 60;
                            return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
                          })()}
                        </Text>
                        <Text style={styles.serviceDetailEmployee}>
                          Atiende {detalle.empleado?.name || 'Sin asignar'}
                        </Text>
                      </View>
                      <Text style={styles.serviceDetailPrice}>
                        ${detalle.precio || 0}
                      </Text>
                    </View>
                  )) || (
                    <Text style={styles.noServicesText}>No hay servicios registrados</Text>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando detalles...</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.appointmentDetailFooter}>
            <View style={styles.totalSection}>
              <View style={styles.totalColumn}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  ${selectedEvent?.total || 0}.00
                </Text>
              </View>
              <View style={styles.remainingColumn}>
                <Text style={styles.remainingLabel}>Restante</Text>
                <Text style={styles.remainingAmount}>
                  ${selectedEvent?.total || 0}.00
                </Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.deleteIconButton}>
                <TrashIcon color="#FF3B30" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chargeButtonNew}>
                <Text style={styles.chargeButtonNewText}>Cobrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[
        styles.bottomNavigation,
        Platform.OS === 'web' && { position: 'fixed' as any }
      ]}>
        {[
          { component: CalendarIcon, label: 'Agenda', active: true },
          { component: UsersIcon, label: 'Clientes', active: false },
          { component: AddIcon, label: 'Agregar', active: false },
          { component: BellIcon, label: 'Alertas', active: false },
          { component: SettingsIcon, label: 'Config', active: false },
        ].map((item, index) => {
          const IconComponent = item.component;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.navItem, item.active && styles.activeNavItem]}
              onPress={() => setActiveTab(item.label)}
            >
              <IconComponent 
                color={item.active ? '#ECF0F1' : '#BDC3C7'} 
                size={20} 
              />
              <Text style={[styles.navLabel, item.active && styles.activeNavLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    // Eliminar marginBottom para que el contenido use toda la pantalla
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  navButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeViewMode: {
    backgroundColor: '#2c3e50',
  },
  viewModeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  activeViewModeText: {
    color: '#ffffff',
  },
  // Day View Styles
  dayView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  dayViewDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hourRow: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hourLabel: {
    width: 60,
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  hourContent: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  eventCard: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
  },
  // Week View Styles
  weekView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  weekDayName: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 5,
  },
  weekDayNumber: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  todayNumber: {
    color: '#2c3e50',
    backgroundColor: '#3498db',
    borderRadius: 15,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    overflow: 'hidden',
  },
  weekContent: {
    flex: 1,
  },
  weekHourRow: {
    flexDirection: 'row',
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekHourLabel: {
    width: 50,
    paddingTop: 5,
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  weekHourContent: {
    flex: 1,
    flexDirection: 'row',
  },
  weekDayColumn: {
    flex: 1,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  weekEventCard: {
    padding: 4,
    borderRadius: 4,
    marginVertical: 1,
  },
  weekEventTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  monthView: {
    backgroundColor: '#ffffff',
    maxHeight: 280, // Reducido para que no necesite scroll
    borderBottomLeftRadius: 20, // Esquinas inferiores redondeadas
    borderBottomRightRadius: 20, // Esquinas inferiores redondeadas
    overflow: 'hidden', // Para que las esquinas se vean correctamente
  },
  monthHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0, // Quitado el borde inferior
  },
  monthWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12, // Reducido de 14 a 12
    fontWeight: 'bold',
    color: '#666666',
    paddingVertical: 10, // Reducido de 15 a 10
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10, // Padding inferior para mejor apariencia con esquinas redondeadas
  },
  monthDay: {
    width: '14.28%', // 100% / 7 días = 14.28%
    height: 40, // Reducido de 50 a 40
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0, // Quitado el borde
    position: 'relative',
  },
  otherMonthDay: {
    backgroundColor: '#fafafa',
  },
  todayDay: {
    backgroundColor: '#6c63ff', // Color púrpura como en la imagen
    borderRadius: 20, // Más redondeado
  },
  selectedDay: {
    backgroundColor: '#6c63ff', // Mismo color para seleccionado
    borderRadius: 20, // Más redondeado
  },
  monthDayText: {
    fontSize: 14, // Reducido de 16 a 14
    color: '#333333',
    fontWeight: '500',
  },
  otherMonthDayText: {
    color: '#cccccc',
  },
  todayDayText: {
    color: '#ffffff', // Texto blanco para el fondo púrpura
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 62, 80, 0.95)', // Semi-transparente para efecto flotante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Redondeado completo
    position: 'absolute',
    bottom: 20, // Separado del borde inferior
    left: 20, // Separado del borde izquierdo
    right: 20, // Separado del borde derecho
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 100, // Elevación muy alta para Android
    zIndex: 999999,
    height: 70,
    minHeight: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
  },
  navLabel: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#ECF0F1',
    fontWeight: '600',
  },

  // Estilos para la vista de horarios diarios
  dayViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  workersHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  timeColumnHeader: {
    width: 60,
    backgroundColor: '#f8f9fa',
  },
  workerColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  timeScrollView: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    minHeight: 60, // Reducido para acomodar más intervalos de tiempo
    borderBottomWidth: 0.5, // Línea más sutil
    borderBottomColor: '#f5f5f5', // Color más claro
    zIndex: 1, // Debajo de las tarjetas
  },
  timeColumn: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  workerTimeSlot: {
    flex: 1,
    minHeight: 60, // Reducido para acomodar más intervalos de tiempo
    position: 'relative',
    borderRightWidth: 0.5, // Línea más sutil
    borderRightColor: '#f5f5f5', // Color más claro
    paddingHorizontal: 2,
    zIndex: 1, // Debajo de las tarjetas
  },
  appointmentCard: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 8, // Esquinas redondeadas
    padding: 12, // Ajustado para las celdas más pequeñas
    marginTop: 2, // Solo margen superior
    marginBottom: 2, // Solo margen inferior
    backgroundColor: '#ffffff',
    elevation: 0, // Sin sombra en Android
    borderWidth: 2, // Borde más grueso general
    borderLeftWidth: 5, // Borde izquierdo aún más grueso
    borderStyle: 'solid', // Línea continua
    borderColor: '#3498db', // Color azul más marcado para el borde
    borderLeftColor: '#2980b9', // Color azul más oscuro para el borde izquierdo
    // Ocultar las líneas de la cuadrícula
    overflow: 'hidden',
    zIndex: 100, // Aumentado significativamente para estar siempre encima
  },
  appointmentTime: {
    fontSize: 13, // Aumentado de 11 a 13
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 4, // Revertido a tamaño original
    textAlign: 'center',
  },
  appointmentTitle: {
    fontSize: 14, // Aumentado de 12 a 14
    color: '#2c3e50',
    fontWeight: '600', // Reducido de 700 a 600 para menos peso
    lineHeight: 16, // Ajustado proporcionalmente
    textAlign: 'center',
    marginTop: 2, // Revertido a tamaño original
    marginBottom: 4, // Espacio antes de la lista de servicios
  },
  servicesList: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  serviceItem: {
    fontSize: 12, // Aumentado de 10 a 12
    color: '#34495e',
    lineHeight: 16, // Ajustado proporcionalmente
    marginBottom: 2,
    textAlign: 'left',
  },

  // Estilos para el header de vista diaria
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 5,
  },
  monthSelectorArrow: {
    fontSize: 12,
    color: '#666666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },

  // Estilos para el modal de selector de mes
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  monthPickerModal: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalCloseButton: {
    backgroundColor: '#E63946',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 15,
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  gestureContainer: {
    flex: 1,
  },
  gestureWrapper: {
    flex: 1,
  },
  horizontalScrollContent: {
    flexGrow: 1,
  },
  calendarContent: {
    minWidth: width, // Asegurar que tenga un ancho mínimo
  },

  // Estilos para layout tipo Excel
  workersHeaderFixed: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
    zIndex: 10,
  },
  timeColumnHeaderFixed: {
    width: 60,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 2,
    borderRightColor: '#e0e0e0',
  },
  workersHeaderContent: {
    flexDirection: 'row',
  },
  workerColumnFixed: {
    width: 200, // Aumentado de 160 a 200 para coincidir con el nuevo minWidth
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  mainContentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timeColumnContainer: {
    width: 60,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 2,
    borderRightColor: '#e0e0e0',
    zIndex: 5,
  },
  timeSlotFixed: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainHourSlot: {
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emptyHourSlot: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainHourLabel: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  emptyHourLabel: {
    fontSize: 12,
    color: 'transparent',
  },
  contentScrollView: {
    flex: 1,
  },
  calendarGrid: {
    flex: 1,
  },
  eventsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  timeRowContent: {
    flexDirection: 'row',
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainHourRow: {
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
  },
  emptyHourRow: {
    backgroundColor: 'transparent',
  },
  workerTimeSlotFixed: {
    width: 200, // Aumentado de 160 a 200 para coincidir con el nuevo minWidth
    height: 35,
    position: 'relative',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingHorizontal: 2,
  },

  // Estilos para dropdown del calendario
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  monthDropdown: {
    position: 'absolute',
    top: 70, // Debajo del header
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20, // Más redondeado (era 12)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 1000,
    maxHeight: 350, // Ligeramente reducido
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12, // Reducido de 16 a 12
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderTopLeftRadius: 20, // Esquinas superiores redondeadas
    borderTopRightRadius: 20, // Esquinas superiores redondeadas
    backgroundColor: '#ffffff', // Asegurar fondo blanco
  },
  monthNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Más redondeado
    backgroundColor: '#f8f9fa',
  },
  monthNavText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  dropdownTitle: {
    fontSize: 16, // Reducido de 18 a 16
    fontWeight: '600',
    color: '#2c3e50',
  },

  // Estilos para el modal de filtro
  filterModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  filterHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterBackButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  checkbox: {
    marginRight: 15,
  },
  checkboxIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  filterOptionText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  presetButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },

  // Estilos para el modal de detalles de cita
  appointmentDetailContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appointmentDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentDetailContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  appointmentDetailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentDetailRow: {
    flexDirection: 'row',
  },
  appointmentDetailColumn: {
    flex: 1,
  },
  appointmentDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentDetailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  appointmentDetailClientName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  appointmentDetailSectionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 16,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceDetailBorder: {
    width: 4,
    backgroundColor: '#007AFF',
    marginRight: 12,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  serviceDetailContent: {
    flex: 1,
  },
  serviceDetailTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDetailTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  serviceDetailEmployee: {
    fontSize: 14,
    color: '#666',
  },
  serviceDetailPrice: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  noServicesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  appointmentDetailFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  totalColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  remainingColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  remainingLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  remainingAmount: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  chargeButtonNew: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeButtonNewText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },

  // Estilos obsoletos mantenidos para compatibilidad
  eventModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    bottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  eventModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  eventModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  eventModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventDetailRow: {
    marginBottom: 20,
  },
  eventDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  eventDetailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '400',
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  eventModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },

  // Estilos para detalles de servicios
  serviceDetailsSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  serviceDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  serviceDetailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  serviceDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceDetailName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  serviceDetailInfo: {
    gap: 4,
  },
  serviceDetailText: {
    fontSize: 13,
    color: '#666666',
  },

  // Botón de cobro
  chargeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#27ae60',
    alignItems: 'center',
  },
  chargeButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CalendarScreen;
