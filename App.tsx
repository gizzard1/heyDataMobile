/**
 * HeyData Mobile - App Principal
 * 
 * @format
 */

import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import CalendarScreen from './src/screens/CalendarScreen';

type CurrentScreen = 'login' | 'register' | 'forgotPassword' | 'calendar';

function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('login');

  const goToRegister = () => {
    setCurrentScreen('register');
  };

  const goToForgotPassword = () => {
    setCurrentScreen('forgotPassword');
  };

  const backToLogin = () => {
    setCurrentScreen('login');
  };

  const goToCalendar = () => {
    setCurrentScreen('calendar');
  };

  if (currentScreen === 'calendar') {
    return <CalendarScreen />;
  }

  if (currentScreen === 'register') {
    return <RegisterScreen onBackToLogin={backToLogin} />;
  }

  if (currentScreen === 'forgotPassword') {
    return <ForgotPasswordScreen onBackToLogin={backToLogin} />;
  }

  return <LoginScreen onGoToRegister={goToRegister} onGoToForgotPassword={goToForgotPassword} onLoginSuccess={goToCalendar} />;
}

export default App;
