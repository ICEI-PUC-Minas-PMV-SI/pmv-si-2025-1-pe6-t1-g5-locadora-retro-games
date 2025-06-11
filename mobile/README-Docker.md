# Mobile App Docker Setup

This folder contains the Docker configuration for the React Native/Expo mobile application.

## Files Overview

- `Dockerfile` - Development Docker configuration
- `Dockerfile.prod` - Production Docker configuration  
- `docker-compose.yml` - Development compose configuration
- `docker-compose.prod.yml` - Production compose configuration
- `.dockerignore` - Files to ignore when building Docker images

## Prerequisites

1. **Docker Desktop** - Install from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. **Expo Go App** - Install on your mobile device from App Store/Play Store

## Development Setup

### Option 1: Using Docker Compose (Recommended)

1. Create the shared network (run this once):
```bash
docker network create retro-games-network
```

2. Start the development server:
```bash
docker-compose up --build
```

3. The Expo development server will start with tunnel mode enabled
4. You'll see a QR code in the terminal that you can scan with the Expo Go app
5. The app will be accessible at tunnel URL (works from any network)

### Option 2: Using Docker directly

1. Build the Docker image:
```bash
docker build -t nintendin-mobile .
```

2. Run the container:
```bash
docker run -it --rm --name nintendin-mobile ^
  -p 19001:19001 ^
  -p 19002:19002 ^
  -p 19006:19006 ^
  -p 8081:8081 ^
  nintendin-mobile
```

## Production Setup

For production (web build):

```bash
docker-compose -f docker-compose.prod.yml up --build
```

This will:
- Build the Expo web version
- Serve it on port 3000
- Access via http://localhost:3000

## Troubleshooting

### Network Issues

If you can't connect to the Expo app from your phone:

1. **Check your IP address**: The current configuration uses `192.168.1.130`. If your IP changes, update it in:
   - `Dockerfile` (REACT_NATIVE_PACKAGER_HOSTNAME)
   - `docker-compose.yml` (REACT_NATIVE_PACKAGER_HOSTNAME)

2. **Find your current IP**:
```bash
ipconfig
```
Look for "Wi-Fi" adapter IPv4 address.

3. **Use tunnel mode**: The configuration already uses `--tunnel` which should work regardless of network.

### Container Access

To access the running container:
```bash
docker exec -it nintendin-mobile bash
```

### Starting Expo manually inside container:
```bash
npx expo start --tunnel
```

## Port Mappings

- `19006` - Expo DevTools web interface
- `19001` - Expo debugging port
- `19002` - Expo debugging port  
- `8081` - Metro bundler port
- `3000` - Production web server (prod only)

## Environment Variables

- `NODE_ENV` - Set to development or production
- `REACT_NATIVE_PACKAGER_HOSTNAME` - Your local machine IP
- `EXPO_DEVTOOLS_LISTEN_ADDRESS` - Set to 0.0.0.0 for Docker

## Hot Reload

The development setup includes volume mounts for hot reload:
- Source code changes will automatically refresh the app
- Node modules are preserved in a separate volume for performance

## Notes

- The tunnel mode (`--tunnel`) is enabled by default for better connectivity
- Expo cache is persisted in a Docker volume
- The setup uses Alpine Linux for smaller image size
- All ports are exposed for maximum compatibility
