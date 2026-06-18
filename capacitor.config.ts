import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.washu.tictactoepro',
  appName: 'Washu Tic Tac Toe Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
