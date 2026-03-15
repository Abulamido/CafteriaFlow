module.exports = {
  apps: [
    {
      name: "cafteriaflow-api",
      script: "uvicorn",
      args: "main:app --host 0.0.0.0 --port 8000 --workers 4",
      interpreter: "./venv/bin/python3",
      env: {
        DATABASE_URL: "postgresql://cafteria_user:cafteria_password@localhost/cafteriaflow",
        REDIS_URL: "redis://localhost:6379/0",
        NVIDIA_API_KEY: "your_nvidia_api_key"
      }
    },
    {
      name: "evolution-api-mock",
      script: "./evolution_api_placeholder/server.js",
      env: {
        PORT: 8080
      }
    },
    {
      name: "cafteriaflow-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      env: {
        PORT: 3000
      }
    }
  ]
};

