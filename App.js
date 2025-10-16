import React, { useEffect } from 'react';
import AppNavigator from './src/AppNavigator';
import { initDB } from './src/db/sqlite';

export default function App() {
  useEffect(() => { initDB(); }, []);
  return <AppNavigator />;
}
