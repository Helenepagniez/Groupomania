# Projet 7 : Groupomania

Le projet consiste à construire un réseau social interne pour les employés de Groupomania. <br />
Le but de cet outil est de faciliter les interactions entre collègues. <br />
 
# Backend

Le backend a été crée avec **Node.js**, **Express.js** et **MongoDB** comme base de données.
<br />

### Installation

-   Dans le terminal de VSCODE, situez-vous dans le dossier `/backend`.
    <br />
-   Démarrer `npm install` pour installer toutes les dependences du backend.
    <br />
-   Dans le dossier `/backend/config`, créer un fichier `.env`.
    <br />
-   Dans le fichier `.env, veuillez renseigner les informations suivantes :
```
  PORT=5000
  CLIENT_URL=http://localhost:4200
  DB_USER_PASS={lien url de connexion obtenu après étape de connexion de base de donnée}
  TOKEN_SECRET={random_string_to_encode_tokens}
```
- Démarrer `npm start` pour avoir accès au serveur de développement. L'application va se recharger automatiquement si vous modifiez un fichier source.

# Base de donnée

-   Se rendre sur `https://www.mongodb.com/atlas`.
    <br />
-   Se créer un compte et retenir les informations d'authentification.
    <br />
-   Créer la database  `groupomania` et un cluster en cliquant sur `create` et en suivant les indications.
    <br />
-   Se rendre dans `Database Access` sur la gauche de l'écran et cliquer sur `Add new database user`.
    <br />
-   Indiquer les informations d'authentification et le type de droits autorisés (`readWriteAnyDatabase@admin`).
    <br />
-   Se rendre dans `Network Access` sur la gauche de l'écran et cliquer sur `Add IP adress`.
    <br />
-   Selectionner `0.0.0.0/0 (includes your current IP address)`.
    <br />
-   Se rendre dans `Database` sur la gauche de l'écran et cliquer sur `Connect`.
    <br />
-   Choisir `Connect your application` puis le driver (`Node.js`) et sa version (`4.1 or later`).
    <br />
-   Copier l'url de connexion de la base de donnée et l'indiquer comme `DB_USER_PASS` dans le fichier `/backend/config/.env`.
    <br />

# Frontend

Le frontend a été crée avec Angular.

### Installation

- Dans le dossier `/frontend/groupomania` démarrez `npm install` pour installer toutes les dépendances du frontend.

- Démarrer `ng serve -o` pour avoir accès au serveur de développement. L'application va se recharger automatiquement si vous modifiez un fichier source.

## Droits Admin

Pour tester les droits d'ADMIN, l'utilisateur doit se connecter avec sa base de donnée et choisir la table des utilisateurs.
<br />
Puis il devra choisir ou créer un nouvel utilisateur qui prendra le role d'Administrateur.
<br />
Il faudra alors modifier l'utilisateur en lui ajoutant un role ADMIN.
<br />
```
  role : "ADMIN" 
```

# Requêtes de l'application Groupomania

## Requêtes concernant les utilisateurs
Ci-dessous, la liste des requêtes concernant les utilisateurs. <br />
● Inscription d'un utilisateur <br />
● Connexion d'un utilisateur <br />
● Déconnexion d'un utilisateur <br />
● Suppression d'un utilisateur <br />
● Modification d'un utilisateur <br />
● Suivre un utilisateur <br />
● Ne plus suivre un utilisateur <br />
● Voir les infos d'un utilisateur <br />
● Voir tous les utilisateurs <br />

### Inscription d'un utilisateur
    POST  : api/user/register
### Connexion d'un utilisateur
    POST  : api/user/login
### Déconnexion d'un utilisateur
    GET  : api/user/logout
### Suppression d'un utilisateur
    DELETE  : api/user/{id de l'utilisateur voulu}
### Modification d'un utilisateur
    PUT  : api/user/{id de l'utilisateur voulu}
### Suivre un utilisateur
    PATCH  : api/user/follow/{id de l'utilisateur connecté}
### Ne plus suivre un utilisateur
    PATCH  : api/user/unfollow/{id de l'utilisateur connecté}
### Voir les infos d'un utilisateur
    GET  : api/user/{id de l'utilisateur voulu}
### Voir tous les utilisateurs
    GET  : api/user
    
## Requêtes concernant les publications
Ci-dessous, la liste des requêtes concernant les publications. <br />
● Ajouter une publication <br />
● Modifier une publication <br />
● Supprimer une publication <br />
● Aimer une publication <br />
● Ne plus aimer une publication <br />
● Ajouter un commentaire <br />
● Modifier un commentaire <br />
● Supprimer un commentaire <br />
● Voir les infos d'une publication précise <br />
● Voir toutes les publications <br />

### Ajouter une publication
    POST  : api/post
### Modifier une publication
    PUT  : api/post/{id de la publication voulu}
### Supprimer une publication
    DELETE  : api/post/{id de la publication voulu}
### Aimer une publication
    PATCH  : api/post/like-post/{id de la publication voulu}
### Ne plus aimer une publication
    PATCH  : api/post/unlike-post/{id de la publication voulu}
### Ajouter un commentaire
    PATCH  : api/post/comment-post/{id de la publication voulu}
### Modifier un commentaire
    PATCH  : api/post/edit-comment-post/{id de la publication voulu}
### Supprimer un commentaire
    PATCH  : api/post/delete-comment-post/{id de la publication voulu}
### Voir les infos d'une publication précise
    GET  : api/post/{id de la publication voulu}
### Voir toutes les publications
    GET  : api/post

# Chartes graphiques de l'application

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primaire | `#FD2D01` |
| Secondaire | `#FFD7D7` |
| Tertiaire | `#4E5166` |


Police d'écriture : Lato

# Spécifications fonctionnelles attendues

## Page de connexion
Une page de connexion permettant à l’utilisateur de se connecter, ou bien
de créer un compte s’il n’en possède pas.Ici il faut demander le minimum
d’informations, la connexion doit se faire à partir de deux éléments : le mail
de l’employé, et un mot de passe. Rien de plus à prévoir pour le moment.

## Détails de la fonctionnalité de connexion
● Un utilisateur doit avoir la possibilité de se déconnecter. <br />
● La session de l’utilisateur persiste pendant qu’il est connecté. <br />
● Les données de connexion doivent être sécurisées. <br />

## Page d’accueil
La page d’accueil doit lister les posts créés par les différents utilisateurs.
On voudra que les posts soient listés de façon antéchronologique (du plus
récent au plus ancien).

## Création d’un post
● Un utilisateur doit pouvoir créer un post. <br />
● Un post doit pouvoir contenir du texte et une image. <br />
● Un utilisateur doit aussi pouvoir modifier et supprimer ses posts. <br />

## Système de like
Un utilisateur doit pouvoir liker un post, une seule fois pour chaque post.

## Rôle administrateur
Dans le but de pouvoir faire de la modération si nécessaire, il faudra créer
un utilisateur “administrateur” ; celui-ci aura les droits de modification /
suppression sur tous les posts du réseau social. Il faudra donc nous
communiquer les identifiants de cet administrateur.

# Lancer l'application
Afin d'afficher la page, suivez les étapes suivantes :

1. Cliquez sur le bouton vert "Code"
2. Cliquez sur "Download ZIP"
3. Extraire du zip et ouvrir dossier sur votre éditeur de code
4. Suivre procédure d'INSTALLATION décrite précédemment
