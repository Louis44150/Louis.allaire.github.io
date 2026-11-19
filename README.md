# À Table !

Un petit assistant de recettes responsive en HTML, CSS et JavaScript, sans installation ni compte.

## Utiliser le site

Ajoute un ou plusieurs ingrédients (séparés par des virgules), choisis le nombre de personnes et ton style de repas, puis clique sur **Trouver une recette**. Le générateur local propose trois idées et utilise les ingrédients indiqués. Le site fonctionne sans clé d'API et ne transmet pas les ingrédients à un serveur.

Les idées et quantités sont indicatives : vérifie la cuisson adaptée aux aliments, les allergènes et ajuste l'assaisonnement à ton goût.

## Publier avec GitHub Pages

Dans le dépôt GitHub, ouvre **Settings → Pages**, choisis **Deploy from a branch**, puis sélectionne `main` et `/(root)`, et clique sur **Save**. L'adresse de publication est affichée sur cette page des paramètres.

> Le générateur de cette version est un moteur local de composition de recettes, pas un service d'IA générative externe. Pour appeler un vrai modèle d'IA, il faut ajouter un service serveur sécurisé avec une clé API ; une clé secrète ne doit pas être publiée dans le code d'un site GitHub Pages.
