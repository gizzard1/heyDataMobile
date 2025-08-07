/**
 * HeyData Mobile - App Principal
 * 
 * @format
 */

import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

type CurrentScreen = 'login' | 'register' | 'forgotPassword';

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

  if (currentScreen === 'register') {
    return <RegisterScreen onBackToLogin={backToLogin} />;
  }

  if (currentScreen === 'forgotPassword') {
    return <ForgotPasswordScreen onBackToLogin={backToLogin} />;
  }

  return <LoginScreen onGoToRegister={goToRegister} onGoToForgotPassword={goToForgotPassword} />;
}

export default App;
