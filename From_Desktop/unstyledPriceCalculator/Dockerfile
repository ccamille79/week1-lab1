
# Utiliser une image Node officielle
FROM node:18

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json si tu as
#COPY package*.json ./

# Copier tout le code source
COPY . .

# Installer les dépendances
RUN npm install


# Exposer le port 8000
EXPOSE 8080

# Commande pour lancer ton site web
CMD ["npm", "start"]
