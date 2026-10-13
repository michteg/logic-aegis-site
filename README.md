# Site Logic Aegis

Site vitrine bilingue de Logic Aegis Ltd, fondée à Kigali en 2016 sous le nom LOGIIC.

## Sources et génération (refonte multipage, branche `refonte`)

- Pages françaises générées par `python3 work/build-refonte.py` (dossier parent du dépôt) :
  `/`, `/expertises/`, `/plateformes/`, `/signature/`, `/realisations/`, `/a-propos/`, `/contact/`,
  `/mentions-legales/`, `/confidentialite/` et `sitemap.xml`. Modifier le générateur, pas les HTML.
- Styles et scripts partagés : `assets/css/site.css`, `assets/js/site.js`, `assets/js/globe.js`.
- Données des plateformes : `work/refonte-platforms.json` (extraites de la v4).
- Pages anglaises `en/…` générées par `python3 work/build-refonte-en.py`, à relancer après chaque génération française.
  Nouveaux textes : ajouter leur traduction dans `work/refonte-en.json` (le script signale tout texte resté en français).
  `work/build-en.py` (page unique v4) est obsolète pour la refonte.
- Formulaire : renseigner `FORM_ENDPOINT` dans `assets/js/site.js` (Formspree ou équivalent) pour un envoi direct ;
  vide, il prépare un email complet à copier ou à ouvrir dans la messagerie.

## Médias

- `assets/img/` : photos WebP, chargement différé. `assets/logos/` : institutions. `assets/platforms/` : logos des plateformes.
- `assets/fonts/` : Plus Jakarta Sans et Poppins (logotype), hébergées localement ; licences OFL incluses.

## Vérification locale

```bash
python3 -m http.server 8000
```
