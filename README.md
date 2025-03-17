# Babbly Frontend

## Overview

This is the frontend application for the Babbly social media platform. It's built with Next.js and TypeScript, providing a modern and responsive user interface.

## Features

- Modern, responsive UI
- Server-side rendering
- Real-time updates via WebSocket
- Authentication with Auth0

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/babbly-frontend.git
cd babbly-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Docker

You can also run the application using Docker:

```bash
# Build the Docker image
docker build -t babbly-frontend .

# Run the container
docker run -p 3000:3000 babbly-frontend
```

## CI/CD Pipeline

This repository uses GitHub Actions for continuous integration and deployment:

- **Code Quality**: SonarCloud analysis
- **Tests**: Component and integration tests
- **Docker Build**: Builds and validates Docker image
- **Deployment**: Automated deployment to staging/production environments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
