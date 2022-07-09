# Projet 7 : Groupomania

Le projet consiste à construire un réseau social interne pour les employés de Groupomania. <br>
Le but de cet outil est de faciliter les interactions entre collègues. <br>
 
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
  DB_USER_PASS={identifiant}:{mot de passe}
  TOKEN_SECRET={random_string_to_encode_tokens}
```
- Démarrer `npm start` pour avoir accès au serveur de développement. L'application va se recharger automatiquement si vous modifiez un fichier source.

# Base de donnée
    A remplir !!

# Frontend

Le frontend a été crée avec Angular.

### Installation

- Dans le dossier `/frontend/groupomania` démarrez `npm install` pour installer toutes les dépendances du frontend.

- Démarrer `ng serve -o` pour avoir accès au serveur de développement. L'application va se recharger automatiquement si vous modifiez un fichier source.

## Droits Admin

Pour tester les droits d'ADMIN, l'utilisateur doit se connecter avec le compte suivant : 
```
  email : louis@gmail.com 
  password: test 33
```
# Requêtes de l'application Groupomania

## Requêtes utilisateurs
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
    
## Requêtes publications
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