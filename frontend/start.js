const { spawn } = require('child_process');

const child = spawn('npx', ['react-scripts', 'start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    BROWSER: 'none',
    WDS_SOCKET_HOST: 'localhost',
    WDS_SOCKET_PORT: '3000'
  }
});

child.on('error', (error) => {
  console.error('Error starting React app:', error);
}); 