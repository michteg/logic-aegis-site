# Site Logic Aegis

Site vitrine bilingue de Logic Aegis Ltd, fondée à Kigali en 2016 sous le nom LOGIIC.

## Sources et génération

- `index.html` : source française, CSS et JavaScript intégrés.
- `en/index.html` : version anglaise générée depuis la page française. Ne pas la modifier directement.

## Médias

- `assets/img/` : photos optimisées en WebP, chargement différé.
- `assets/logos/` : logos des institutions accompagnées. Aucun lien externe.
- `assets/fonts/` : Plus Jakarta Sans et Poppins, hébergées localement ; licences OFL incluses.

## Vérification locale

```bash
python3 -m http.server 8000
```

Ouvrir `/` et `/en/`. La langue suit la préférence sauvegardée (`la-lang`), sinon celle du navigateur. Les robots sont exclus des redirections.
