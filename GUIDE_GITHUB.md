# 🚀 Guide : Déployer sur GitHub

## 📋 Prérequis

- Un compte GitHub (gratuit) : [https://github.com](https://github.com)
- Git installé sur ton ordinateur

---

## 🔧 Étape 1 : Vérifier que Git est installé

Ouvre ton terminal et tape :

```bash
git --version
```

Si Git n'est pas installé :
- **Mac** : `brew install git` ou télécharge depuis [git-scm.com](https://git-scm.com)
- **Windows** : Télécharge depuis [git-scm.com](https://git-scm.com)

---

## 📦 Étape 2 : Initialiser Git dans ton projet (si pas déjà fait)

Dans le terminal, va dans le dossier de ton projet :

```bash
cd /Users/princeameya/video-portfolio
```

Vérifie si Git est déjà initialisé :

```bash
git status
```

Si tu vois une erreur, initialise Git :

```bash
git init
```

---

## 🔐 Étape 3 : Configurer Git (première fois seulement)

Si c'est la première fois que tu utilises Git :

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ameyaprod@gmail.com"
```

---

## 📝 Étape 4 : Créer un dépôt sur GitHub

1. Va sur [https://github.com](https://github.com)
2. Connecte-toi avec ton compte
3. Clique sur le **"+"** en haut à droite → **"New repository"**
4. Remplis les informations :
   - **Repository name** : `video-portfolio` (ou le nom que tu veux)
   - **Description** : `Portfolio de réalisateur et monteur vidéo`
   - **Visibility** : 
     - ✅ **Public** (gratuit, visible par tous)
     - 🔒 **Private** (gratuit aussi, mais privé)
   - ❌ **NE COCHE PAS** "Add a README file" (on a déjà un projet)
   - ❌ **NE COCHE PAS** "Add .gitignore" (on en a déjà un)
5. Clique sur **"Create repository"**

---

## 🔗 Étape 5 : Lier ton projet local à GitHub

GitHub va te donner des commandes. Utilise celles-ci :

```bash
# Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# Créer un premier commit
git commit -m "Initial commit: Portfolio AMEYA"

# Lier au dépôt GitHub (remplace USERNAME par ton nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/video-portfolio.git

# Pousser le code sur GitHub
git branch -M main
git push -u origin main
```

**Exemple** si ton username GitHub est `ameyaprod` :
```bash
git remote add origin https://github.com/ameyaprod/video-portfolio.git
```

---

## 🔑 Étape 6 : Authentification GitHub

Quand tu fais `git push`, GitHub va te demander de t'authentifier.

### Option 1 : Token d'accès personnel (Recommandé)

1. Va sur GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donne un nom : `video-portfolio`
4. Sélectionne les permissions : coche **`repo`** (tout)
5. Clique sur **"Generate token"**
6. **Copie le token** (tu ne pourras plus le voir après !)
7. Quand Git te demande le mot de passe, utilise ce token au lieu de ton mot de passe

### Option 2 : GitHub CLI (Plus simple)

Installe GitHub CLI :

```bash
# Mac
brew install gh

# Puis authentifie-toi
gh auth login
```

---

## ✅ Étape 7 : Vérifier

Va sur ton dépôt GitHub : `https://github.com/USERNAME/video-portfolio`

Tu devrais voir tous tes fichiers !

---

## 🔄 Mettre à jour le code (à chaque modification)

Quand tu modifies ton code, pour mettre à jour GitHub :

```bash
# Voir les fichiers modifiés
git status

# Ajouter les modifications
git add .

# Créer un commit avec un message
git commit -m "Description de tes modifications"

# Pousser sur GitHub
git push
```

**Exemples de messages de commit** :
- `git commit -m "Ajout du support YouTube"`
- `git commit -m "Mise à jour des projets"`
- `git commit -m "Correction du footer"`

---

## 📁 Fichiers qui NE seront PAS sur GitHub

Grâce au fichier `.gitignore`, ces fichiers ne seront **pas** uploadés :

- `node_modules/` (dépendances)
- `.env.local` (variables d'environnement - **IMPORTANT** pour la sécurité)
- `.next/` (fichiers de build)
- Fichiers temporaires

**⚠️ IMPORTANT** : Ne commit JAMAIS ton fichier `.env.local` qui contient tes clés API !

---

## 🔒 Sécurité : Variables d'Environnement

Si tu veux partager les variables d'environnement avec d'autres développeurs (sans les valeurs sensibles), crée un fichier `.env.example` :

```bash
# .env.example (à commit)
NEXT_PUBLIC_SITE_URL=https://ameya.tv
RESEND_API_KEY=re_votre_cle_ici
CONTACT_EMAIL=contact@ameya.tv
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🌐 Déployer depuis GitHub

Une fois sur GitHub, tu peux déployer facilement sur :

- **Vercel** : Connecte ton dépôt GitHub → Déploiement automatique
- **Netlify** : Connecte ton dépôt GitHub → Déploiement automatique
- **OVH** : Clone le dépôt sur ton serveur

---

## ❓ Problèmes Courants

### Erreur : "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/video-portfolio.git
```

### Erreur : "Authentication failed"

- Vérifie que tu utilises un **Personal Access Token** et non ton mot de passe
- Ou utilise GitHub CLI : `gh auth login`

### Erreur : "Permission denied"

- Vérifie que tu as bien les droits sur le dépôt GitHub
- Vérifie l'URL du dépôt

### Annuler le dernier commit (avant push)

```bash
git reset --soft HEAD~1
```

---

## 📚 Commandes Git Utiles

```bash
# Voir l'historique des commits
git log

# Voir les différences
git diff

# Changer de branche
git checkout -b nouvelle-branche

# Voir les branches
git branch

# Fusionner une branche
git merge nom-de-la-branche
```

---

## ✅ Checklist

- [ ] Git installé
- [ ] Compte GitHub créé
- [ ] Dépôt GitHub créé
- [ ] Git initialisé dans le projet
- [ ] Fichiers ajoutés (`git add .`)
- [ ] Premier commit créé
- [ ] Dépôt lié à GitHub (`git remote add origin`)
- [ ] Code poussé sur GitHub (`git push`)
- [ ] Vérifié sur GitHub que les fichiers sont là
- [ ] `.env.local` bien dans `.gitignore` (pas commité)

---

## 🎉 C'est Fait !

Ton code est maintenant sur GitHub ! Tu peux le partager, le cloner sur d'autres machines, et le déployer facilement.

**URL de ton dépôt** : `https://github.com/USERNAME/video-portfolio`

