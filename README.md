# Mon Coffre

Petite application iPhone (web app hors ligne) pour noter ses identifiants : nom du site, lien, identifiant, mot de passe, notes. Les sites sont rangés automatiquement par catégories.

- Les données restent uniquement sur l'appareil, chiffrées (AES-GCM 256, clé dérivée du mot de passe maître par PBKDF2-SHA256, 600 000 itérations).
- Aucune connexion réseau n'est faite par l'app (politique de sécurité `connect-src 'none'`).
- Ce dépôt ne contient que le code de l'app, aucune donnée personnelle.

Installation : ouvrir l'adresse GitHub Pages dans Safari, puis Partager → « Sur l'écran d'accueil ».
