import { AppRegistry } from 'react-native';
import App from './App';

// Registrar la aplicación para web
AppRegistry.registerComponent('heyDataMobile', () => App);

// Ejecutar la aplicación en el DOM
AppRegistry.runApplication('heyDataMobile', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
