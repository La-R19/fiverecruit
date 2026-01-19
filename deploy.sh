#!/bin/bash

echo "🔄 Début du déploiement..."

# 1. Récupérer les dernières modifications
git pull

# 2. Installer les nouvelles dépendances (si besoin)
echo "📦 Installation des dépendances..."
npm install

# 3. Construire l'application Next.js
echo "🏗️ Construction du site..."
npm run build

# 4. Redémarrer le serveur via PM2
echo "🚀 Redémarrage du serveur..."
pm2 restart all

echo "✅ Déploiement terminé avec succès !"
