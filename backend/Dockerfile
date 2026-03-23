# Dockerfile pour le Backend Django
FROM python:3.11-slim

# Environnement
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Code source
COPY . .

# Static files
RUN python manage.py collectstatic --noinput

# Exposer le port (Render utilise PORT env var)
EXPOSE 8000

# Commande de lancement
CMD gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
