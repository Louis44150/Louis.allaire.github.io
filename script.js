const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ingredients = [];
let lastRecipes = [];
let detailPage = null;
const input = $('#ingredientInput');
const list = $('#ingredientList');
const people = $('#people');
const RECENT_LIMIT = 12;
const RECENT_KEY = 'a-table-recent-recipes-v1';

const emojis = {tomate:'🍅',tomates:'🍅',oeuf:'🥚',oeufs:'🥚',poulet:'🍗',riz:'🍚',pates:'🍝',fromage:'🧀',courgette:'🥒',courgettes:'🥒',carotte:'🥕',carottes:'🥕',pomme:'🍎',lentilles:'🫘',pois:'🫘',champignon:'🍄',champignons:'🍄',pois:'🫘',pois:'🫘',epinards:'🥬',avocat:'🥑',brocoli:'🥦',patate:'🥔',pomme:'🍎'};
const foodPhotos = [
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
];

// Recettes originales adaptées pour le générateur, avec liens vers des recettes
// inspirantes. Les liens mènent aux sources, pas à une copie de leurs textes.
const recipes = [
  {id:'pates-legumes',name:'Pâtes aux légumes du marché',emoji:'🍝',style:['vite','healthy'],duration:25,description:'Une poêlée colorée de légumes et de pâtes, facile à adapter au contenu du frigo.',source:'Marmiton — pâtes aux légumes',url:'https://www.marmiton.org/recettes/recette_pates-aux-legumes_20595.aspx',ingredients:[['pâtes',80],['courgette',100],['tomates',100],['oignon',30],['huile d’olive',10]],steps:['Fais cuire les pâtes dans une grande casserole d’eau bouillante en suivant les indications du paquet.','Pendant ce temps, émince l’oignon et coupe les légumes en petits morceaux. Fais-les revenir dans une poêle avec l’huile jusqu’à ce qu’ils soient tendres.','Ajoute les pâtes égouttées, mélange, goûte et assaisonne.']},
  {id:'one-pot-lentilles',name:'One-pot de pâtes aux lentilles et légumes',emoji:'🥘',style:['vite','healthy','surprise'],duration:25,description:'Un plat complet dans une seule casserole, inspiré des associations pâtes-légumineuses.',source:'Rachel Cuisine — pâtes de légumineuses aux légumes',url:'https://rachel-cuisine.fr/les-feculents-et-les-legumineuses/pates-de-legumineuses-aux-legumes/',ingredients:[['pâtes',75],['lentilles corail',35],['tomates',100],['épinards',40],['oignon',25]],steps:['Mets les pâtes, les lentilles corail, les tomates coupées et l’oignon émincé dans une casserole.','Couvre d’eau ou de bouillon à hauteur, porte à frémissement et cuis en remuant régulièrement jusqu’à ce que les pâtes et les lentilles soient tendres. Ajoute un peu d’eau si nécessaire.','Ajoute les épinards en fin de cuisson, mélange jusqu’à ce qu’ils tombent, puis goûte et rectifie l’assaisonnement.']},
  {id:'omelette-legumes',name:'Omelette moelleuse aux légumes',emoji:'🍳',style:['vite','healthy','surprise'],duration:15,description:'Une omelette simple et nourrissante, garnie des légumes disponibles.',source:'Cuisine AZ — idées de recettes aux légumes',url:'https://www.cuisineaz.com/diaporamas/15-recettes-de-pates-aux-legumes-pleines-de-fibres-4079/interne/1.aspx',ingredients:[['œufs',2],['champignons',60],['épinards',35],['fromage',15]],steps:['Bats les œufs dans un bol avec une pincée de sel et de poivre. Coupe les légumes en petits morceaux.','Fais revenir les légumes dans une poêle légèrement huilée jusqu’à ce qu’ils soient cuits.','Verse les œufs battus, ajoute le fromage et cuis à feu doux. Plie l’omelette quand le dessous est pris.']},
  {id:'riz-saute',name:'Riz sauté aux légumes et à l’œuf',emoji:'🍚',style:['vite','healthy','surprise'],duration:20,description:'Une recette anti-gaspi parfaite pour transformer un reste de riz en repas complet.',source:'Marmiton — inspirations pâtes, riz et semoule',url:'https://www.marmiton.org/recettes/index/categorie/pates-riz-semoule/',ingredients:[['riz',75],['œufs',1],['carottes',60],['petits pois',40],['oignon',20]],steps:['Fais cuire le riz selon les instructions du paquet, puis égoutte-le. Un reste de riz déjà cuit convient aussi.','Émince l’oignon et coupe la carotte en petits dés. Fais-les revenir à la poêle avec les petits pois jusqu’à ce qu’ils soient tendres.','Ajoute le riz, pousse-le sur un côté de la poêle et brouille l’œuf de l’autre côté. Mélange le tout et assaisonne.']},
  {id:'curry-pois-chiches',name:'Curry doux de pois chiches',emoji:'🍛',style:['comfort','healthy','surprise'],duration:30,description:'Des pois chiches mijotés dans une sauce parfumée, à servir avec du riz ou du pain.',source:'Cuisine Actuelle — idées de plats végétariens',url:'https://www.cuisineactuelle.fr/culture-food/idees-de-menus/idees-de-repas/43-recettes-de-bons-plats-de-pates-aux-legumes-194728',ingredients:[['pois chiches',120],['tomates',120],['lait de coco',80],['oignon',30],['riz',60]],steps:['Émince l’oignon et fais-le revenir dans une casserole avec un peu d’huile. Ajoute une pincée de curry si tu en as.','Ajoute les tomates et les pois chiches rincés. Verse le lait de coco et laisse mijoter doucement une quinzaine de minutes.','Fais cuire le riz à part. Sers le curry bien chaud avec le riz et vérifie l’assaisonnement.']},
  {id:'salade-lentilles',name:'Salade tiède de lentilles et œuf',emoji:'🥗',style:['fresh','healthy'],duration:25,description:'Des lentilles nourrissantes, une vinaigrette acidulée et un œuf pour un repas équilibré.',source:'Marmiton — inspirations de recettes complètes',url:'https://www.marmiton.org/recettes/index/categorie/pates-riz-semoule/',ingredients:[['lentilles',80],['œufs',1],['carottes',50],['salade',25],['moutarde',5]],steps:['Rince les lentilles et fais-les cuire dans de l’eau frémissante jusqu’à ce qu’elles soient tendres. Égoutte-les.','Fais cuire les œufs dans l’eau bouillante pendant environ 9 minutes, puis refroidis-les et écale-les.','Mélange les lentilles tièdes et les carottes râpées avec une vinaigrette à la moutarde. Ajoute la salade et l’œuf coupé en quartiers.']},
  {id:'gratin-courgettes',name:'Gratin fondant de courgettes',emoji:'🧀',style:['comfort'],duration:40,description:'Des courgettes fondantes gratinées au fromage, à accompagner d’une salade ou de céréales.',source:'Cuisine Actuelle — idées de gratins aux légumes',url:'https://www.cuisineactuelle.fr/culture-food/idees-de-menus/idees-de-repas/43-recettes-de-bons-plats-de-pates-aux-legumes-194728',ingredients:[['courgettes',160],['crème',40],['fromage râpé',25],['œufs',0.5],['ail',3]],steps:['Préchauffe le four à 190 °C. Coupe les courgettes en rondelles et fais-les revenir quelques minutes pour retirer une partie de leur eau.','Mélange la crème, l’œuf, l’ail haché, du sel et du poivre. Dispose les courgettes dans un petit plat et verse le mélange dessus.','Répartis le fromage râpé et enfourne 20 à 25 minutes, jusqu’à ce que le dessus soit doré et le centre bien chaud.']},
  {id:'soupe-lentilles',name:'Soupe de lentilles et carottes',emoji:'🍲',style:['comfort','healthy'],duration:35,description:'Une soupe épaisse et réconfortante qui se prépare avec quelques ingrédients du placard.',source:'Marmiton — idées de recettes de légumineuses',url:'https://www.marmiton.org/recettes/index/categorie/pates-riz-semoule/',ingredients:[['lentilles',75],['carottes',80],['oignon',25],['bouillon',300],['crème',15]],steps:['Rince les lentilles. Épluche et coupe les carottes et l’oignon en morceaux.','Mets le tout dans une casserole avec le bouillon. Laisse mijoter à couvert jusqu’à ce que les lentilles et les carottes soient tendres.','Mixe la soupe selon la texture souhaitée, ajoute un peu de crème si tu en as et ajuste l’assaisonnement.']},
  {id:'shakshuka',name:'Œufs mijotés à la tomate',emoji:'🍅',style:['comfort','vite','surprise'],duration:25,description:'Des œufs cuits dans une sauce tomate aux poivrons, à savourer avec du pain.',source:'Cuisine AZ — idées de recettes aux légumes',url:'https://www.cuisineaz.com/diaporamas/15-recettes-de-pates-aux-legumes-pleines-de-fibres-4079/interne/1.aspx',ingredients:[['œufs',2],['tomates',150],['poivron',60],['oignon',25],['pain',40]],steps:['Émince l’oignon et le poivron, puis fais-les revenir dans une poêle avec un filet d’huile.','Ajoute les tomates en morceaux et laisse mijoter une dizaine de minutes pour obtenir une sauce épaisse.','Creuse de petits nids, casse les œufs dedans, couvre et cuis à feu doux jusqu’à ce que les blancs soient pris. Sers avec du pain.']},
  {id:'risotto-champignons',name:'Risotto crémeux aux champignons',emoji:'🍄',style:['comfort'],duration:35,description:'Un riz fondant aux champignons, à cuire doucement en ajoutant le bouillon petit à petit.',source:'Marmiton — inspirations riz et plats chauds',url:'https://www.marmiton.org/recettes/index/categorie/pates-riz-semoule/',ingredients:[['riz à risotto',80],['champignons',100],['oignon',25],['bouillon',300],['parmesan',15]],steps:['Fais chauffer le bouillon. Dans une casserole, fais revenir l’oignon émincé et les champignons dans un peu de beurre ou d’huile.','Ajoute le riz et remue une minute. Verse le bouillon chaud louche par louche, en attendant qu’il soit absorbé avant d’en rajouter.','Quand le riz est tendre et crémeux, retire du feu et incorpore le parmesan. Goûte et sers aussitôt.']},
  {id:'salade-pois-chiches',name:'Salade croquante de pois chiches',emoji:'🥙',style:['fresh','healthy'],duration:15,description:'Une salade fraîche et personnalisable avec des pois chiches, des crudités et une sauce citronnée.',source:'Rachel Cuisine — inspirations autour des légumineuses',url:'https://rachel-cuisine.fr/les-feculents-et-les-legumineuses/pates-de-legumineuses-aux-legumes/',ingredients:[['pois chiches',120],['concombre',70],['tomates',70],['citron',10],['yaourt',25]],steps:['Rince et égoutte les pois chiches. Coupe le concombre et les tomates en dés.','Mélange le yaourt avec un filet de jus de citron, du sel, du poivre et des herbes si tu en as.','Assemble les légumes et les pois chiches, puis ajoute la sauce juste avant de servir.']},
  {id:'tortilla',name:'Tortilla de pommes de terre',emoji:'🥔',style:['comfort','surprise'],duration:35,description:'Une tortilla dorée aux pommes de terre et aux œufs, délicieuse chaude ou froide.',source:'Marmiton — inspirations de repas simples',url:'https://www.marmiton.org/recettes/index/categorie/pates-riz-semoule/',ingredients:[['pommes de terre',150],['œufs',2],['oignon',25],['huile d’olive',10]],steps:['Épluche et coupe les pommes de terre en fines rondelles. Fais-les cuire doucement à la poêle avec l’oignon émincé et un peu d’huile jusqu’à ce qu’elles soient tendres.','Bats les œufs, sale et poivre, puis ajoute les pommes de terre égouttées.','Reverse dans la poêle et cuis à feu doux. Retourne la tortilla à l’aide d’une assiette pour dorer l’autre face.']},
  {id:'poelee-haricots',name:'Poêlée de haricots blancs à la tomate',emoji:'🥘',style:['vite','healthy','surprise'],duration:20,description:'Des haricots fondants mijotés dans une sauce tomate, avec les herbes que tu as sous la main.',source:'Cuisine Actuelle — idées de plats aux légumes',url:'https://www.cuisineactuelle.fr/culture-food/idees-de-menus/idees-de-repas/43-recettes-de-bons-plats-de-pates-aux-legumes-194728',ingredients:[['haricots blancs',130],['tomates',120],['oignon',25],['épinards',30],['pain',40]],steps:['Émince l’oignon et fais-le revenir dans une poêle avec un filet d’huile.','Ajoute les tomates et les haricots blancs rincés. Laisse mijoter une dizaine de minutes.','Ajoute les épinards en fin de cuisson, mélange jusqu’à ce qu’ils soient tendres et sers avec du pain.']},
  {id:'wrap-omelette',name:'Wrap chaud à l’omelette et aux crudités',emoji:'🌯',style:['vite','fresh'],duration:15,description:'Un repas express avec une omelette fine, des crudités et une sauce au yaourt.',source:'Marmiton — inspirations de repas rapides',url:'https://www.marmiton.org/recettes/index/categorie/pates-riz-semoule/',ingredients:[['tortilla',1],['œufs',1],['salade',20],['tomates',50],['yaourt',20]],steps:['Bats l’œuf et cuis une omelette fine dans une poêle. Coupe la tomate et prépare la salade.','Mélange le yaourt avec du sel, du poivre et un peu de citron ou d’herbes si tu en as.','Garnis la tortilla avec l’omelette, les crudités et la sauce, puis roule-la. Réchauffe-la brièvement à la poêle si tu préfères.']},
  {id:'bol-quinoa',name:'Bol de quinoa, légumes et fromage',emoji:'🥗',style:['fresh','healthy'],duration:25,description:'Un bol complet qui associe céréale, légumes et une touche de fromage.',source:'Cuisine Actuelle — inspirations de plats complets',url:'https://www.cuisineactuelle.fr/culture-food/idees-de-menus/idees-de-repas/43-recettes-de-bons-plats-de-pates-aux-legumes-194728',ingredients:[['quinoa',70],['courgette',70],['tomates',60],['fromage',25],['citron',8]],steps:['Rince le quinoa et fais-le cuire dans deux fois son volume d’eau jusqu’à ce que les grains soient tendres. Égoutte si besoin.','Coupe la courgette et fais-la revenir à la poêle ou garde-la crue en fines lamelles. Coupe aussi les tomates.','Répartis le quinoa et les légumes dans un bol, ajoute le fromage et un filet de citron, puis assaisonne.']}
];

function normalized(value) { return String(value).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/œ/g,'oe'); }
function cleanName(value) { return value.trim().replace(/\s+/g,' ').replace(/^[,;]+|[,;]+$/g,''); }
function addIngredients(raw) {
  raw.split(/[,;\n]+/).map(cleanName).filter(Boolean).forEach(name => {
    if (!ingredients.some(item => normalized(item) === normalized(name))) ingredients.push(name);
  });
  renderIngredients(); input.value = ''; input.focus();
}
function renderIngredients() {
  list.replaceChildren();
  if (!ingredients.length) {
    const empty = document.createElement('span'); empty.className = 'empty-prompt'; empty.textContent = 'Tes ingrédients apparaîtront ici.'; list.append(empty);
  }
  ingredients.forEach((name,index) => {
    const chip = document.createElement('span'); chip.className = 'ingredient-chip';
    const text = document.createElement('span');
    const key = normalized(name).replace(/[\s-]/g,'');
    text.textContent = `${emojis[key] || '🥬'} ${name}`;
    const remove = document.createElement('button'); remove.type = 'button'; remove.setAttribute('aria-label',`Retirer ${name}`); remove.textContent = '×';
    remove.onclick = () => { ingredients.splice(index,1); renderIngredients(); };
    chip.append(text,remove); list.append(chip);
  });
  $('#ingredientCount').textContent = `${ingredients.length} ingrédient${ingredients.length === 1 ? '' : 's'}`;
  $('#formHint').textContent = ingredients.length ? 'Prêt·e ? Choisis ton style et lance la recherche.' : 'Ajoute au moins un ingrédient pour commencer.';
}
$('#ingredientForm').addEventListener('submit',event => { event.preventDefault(); if (input.value.trim()) addIngredients(input.value); });
$$('[data-add]').forEach(button => button.addEventListener('click',() => addIngredients(button.dataset.add)));

function setPeople(value) {
  const count = Math.max(1,Math.min(12,Number.parseInt(value,10) || 1));
  people.value = count; $('#peopleOutput').value = count; $('#peopleOutput').textContent = count;
}
people.addEventListener('input',() => {
  const value = Number.parseInt(people.value,10);
  if (Number.isFinite(value) && value >= 1 && value <= 12) { $('#peopleOutput').value = value; $('#peopleOutput').textContent = value; }
});
people.addEventListener('change',() => setPeople(people.value));
$('#minusPeople').addEventListener('click',() => setPeople(Number(people.value) - 1));
$('#plusPeople').addEventListener('click',() => setPeople(Number(people.value) + 1));

function safe(value) { return String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function ingredientMatches(recipeIngredient) {
  const key = normalized(recipeIngredient);
  return ingredients.some(item => {
    const available = normalized(item);
    return available.includes(key) || key.includes(available) || (key.endsWith('s') && available === key.slice(0,-1));
  });
}
function scaledAmount(name,amount,count) {
  if (name === 'œufs') { const total = Math.max(1,Math.round(amount * count)); return `${total} œuf${total > 1 ? 's' : ''}`; }
  if (amount < 1) return `${Math.max(1,Math.round(amount * count))} ${name}`;
  if (['huile d’olive','moutarde','citron','ail'].includes(name)) return `${Math.max(1,Math.round(amount * count))} g de ${name}`;
  return `${Math.round(amount * count)} g de ${name}`;
}
function prepareRecipe(recipe) {
  const count = Number(people.value) || 2;
  const all = recipe.ingredients.map(([name,amount]) => ({name,amount:scaledAmount(name,amount,count),available:ingredientMatches(name)}));
  return {...recipe,items:all,count,missing:all.filter(item => !item.available).map(item => item.name)};
}
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function remember(ids) {
  try { localStorage.setItem(RECENT_KEY,JSON.stringify([...ids,...getRecent()].filter((id,index,array) => array.indexOf(id) === index).slice(0,RECENT_LIMIT)); } catch { /* Le site reste utilisable si le stockage est bloqué. */ }
}
function chooseRecipes(style) {
  const recent = getRecent();
  let candidates = recipes.filter(recipe => recipe.style.includes(style));
  if (!candidates.length) candidates = [...recipes];
  const score = recipe => recipe.ingredients.reduce((total,[name]) => total + (ingredientMatches(name) ? 1 : 0),0);
  candidates.sort((a,b) => score(b) - score(a) || Math.random() - 0.5);
  let fresh = candidates.filter(recipe => !recent.includes(recipe.id));
  if (fresh.length < 3) {
    // On ne répète pas les idées déjà vues tant qu'il reste assez d'alternatives.
    const unseen = recipes.filter(recipe => !recent.includes(recipe.id) && !fresh.some(item => item.id === recipe.id));
    fresh = [...fresh,...unseen.sort((a,b) => score(b) - score(a) || Math.random() - 0.5)];
  }
  if (fresh.length < 3) {
    const older = candidates.filter(recipe => !fresh.some(item => item.id === recipe.id));
    fresh = [...fresh,...older.sort((a,b) => score(b) - score(a) || Math.random() - 0.5)];
  }
  const selected = fresh.slice(0,3);
  remember(selected.map(recipe => recipe.id));
  return selected.map(prepareRecipe);
}

function installDetailStyles() {
  if ($('#recipeDetailStyles')) return;
  const style = document.createElement('style'); style.id = 'recipeDetailStyles';
  style.textContent = `.recipe-card{cursor:pointer;transition:transform .2s,box-shadow .2s}.recipe-card:hover,.recipe-card:focus-visible{transform:translateY(-4px);box-shadow:0 12px 30px #24332820}.recipe-detail-page{position:fixed;inset:0;z-index:1000;overflow:auto;background:#f6f3eb;padding:clamp(18px,5vw,56px)}.recipe-detail-wrap{max-width:900px;margin:0 auto}.recipe-detail-back{border:0;background:#fffdf8;padding:12px 18px;border-radius:999px;cursor:pointer;font:600 15px inherit}.recipe-detail-hero{margin:22px 0;display:grid;grid-template-columns:minmax(180px,1fr) 1.2fr;gap:24px;align-items:center}.recipe-detail-hero img{width:100%;height:250px;object-fit:cover;border-radius:20px}.recipe-detail-hero h1{font-size:clamp(28px,5vw,46px);margin:10px 0}.recipe-detail-meta{display:flex;flex-wrap:wrap;gap:18px;margin:16px 0}.recipe-detail-columns{display:grid;grid-template-columns:1fr 1.4fr;gap:22px}.recipe-detail-panel{background:#fffdf8;border-radius:18px;padding:22px}.recipe-detail-panel li{margin:10px 0;line-height:1.55}.recipe-detail-source{margin:20px 0}.recipe-detail-source a{color:#315d3b;font-weight:700}.recipe-missing{font-size:13px;opacity:.8;margin-top:12px}@media(max-width:650px){.recipe-detail-hero,.recipe-detail-columns{grid-template-columns:1fr}.recipe-detail-hero img{height:190px}}`;
  document.head.append(style);
}
function closeRecipeDetail(updateHistory = true) {
  if (!detailPage) return;
  detailPage.remove(); detailPage = null;
  if (updateHistory && location.hash === '#recette') history.back();
}
function openRecipeDetail(recipe) {
  if (detailPage) detailPage.remove();
  installDetailStyles();
  const items = recipe.items.map(item => `<li><b>${safe(item.amount)}</b>${item.available ? ' ✓' : ''}</li>`).join('');
  const steps = recipe.steps.map(step => `<li>${safe(step)}</li>`).join('');
  const missing = recipe.missing.length ? `<p class="recipe-missing">À prévoir en plus : ${safe(recipe.missing.join(', '))}. Les ingrédients cochés sont ceux que tu as indiqués.</p>` : '<p class="recipe-missing">Tu as indiqué tous les ingrédients de cette recette.</p>';
  detailPage = document.createElement('section'); detailPage.className = 'recipe-detail-page'; detailPage.setAttribute('role','dialog'); detailPage.setAttribute('aria-modal','true'); detailPage.setAttribute('aria-label',`Recette : ${recipe.name}`);
  detailPage.innerHTML = `<div class="recipe-detail-wrap"><button class="recipe-detail-back" type="button">← Retour aux recettes</button><header class="recipe-detail-hero"><img src="${foodPhotos[recipes.indexOf(recipes.find(item => item.id === recipe.id)) % foodPhotos.length]}" alt="${safe(recipe.name)}"><div><span class="recipe-label">${safe(recipe.duration)} min · ${recipe.count} personne${recipe.count > 1 ? 's' : ''}</span><h1>${safe(recipe.name)}</h1><p>${safe(recipe.description)}</p></div></header><div class="recipe-detail-columns"><section class="recipe-detail-panel"><h2>Les ingrédients</h2><ul>${items}</ul>${missing}</section><section class="recipe-detail-panel"><h2>La préparation</h2><ol>${steps}</ol></section></div><p class="recipe-detail-source">Idée adaptée, source d’inspiration : <a href="${safe(recipe.url)}" target="_blank" rel="noopener noreferrer">${safe(recipe.source)} ↗</a></p></div>`;
  document.body.append(detailPage);
  detailPage.querySelector('.recipe-detail-back').addEventListener('click',() => closeRecipeDetail());
  if (location.hash !== '#recette') history.pushState({recipe:true},'',`${location.pathname}${location.search}#recette`);
  detailPage.querySelector('.recipe-detail-back').focus();
}
window.addEventListener('popstate',() => { if (detailPage) closeRecipeDetail(false); });
window.addEventListener('keydown',event => { if (event.key === 'Escape' && detailPage) closeRecipeDetail(); });

function renderRecipes() {
  const grid = $('#recipeGrid'); grid.replaceChildren();
  lastRecipes.forEach((recipe,index) => {
    const card = document.createElement('article'); card.className = `recipe-card${index === 0 ? ' featured' : ''}`; card.tabIndex = 0; card.setAttribute('role','button'); card.setAttribute('aria-label',`Voir la recette ${recipe.name}`);
    const top = document.createElement('div'); top.className = 'recipe-top';
    const emoji = document.createElement('span'); emoji.className = 'recipe-emoji'; emoji.textContent = recipe.emoji;
    const label = document.createElement('span'); label.className = 'recipe-label'; label.textContent = `${recipe.duration} min · ${recipe.count} pers.`;
    const title = document.createElement('h3'); title.textContent = recipe.name;
    const description = document.createElement('p'); description.className = 'recipe-desc'; description.textContent = recipe.description;
    const meta = document.createElement('div'); meta.className = 'recipe-meta'; meta.innerHTML = `<span>⏱ ${recipe.duration} min</span><span>🥕 ${recipe.items.filter(item => item.available).length}/${recipe.items.length} ingrédients dispo</span>`;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'recipe-open-link'; button.textContent = 'Voir la recette →';
    top.append(emoji,label); card.append(top,title,description,meta,button);
    card.addEventListener('click',() => openRecipeDetail(recipe));
    card.addEventListener('keydown',event => { if (event.target === card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openRecipeDetail(recipe); } });
    grid.append(card);
  });
  $('#results').hidden = false;
}
function generate() {
  if (!ingredients.length) { $('#formHint').textContent = 'Ajoute au moins un ingrédient avant de chercher une recette.'; input.focus(); return; }
  lastRecipes = chooseRecipes($('#mealStyle').value);
  renderRecipes(); $('#results').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#generateButton').addEventListener('click',generate);
$('#againButton').addEventListener('click',() => {
  if (!ingredients.length) return;
  const previous = new Set(lastRecipes.map(recipe => recipe.id));
  let next = chooseRecipes($('#mealStyle').value);
  if (next.length > 1 && next.every(recipe => previous.has(recipe.id))) {
    const alternatives = recipes.filter(recipe => !previous.has(recipe.id)).sort(() => Math.random() - 0.5).slice(0,3).map(prepareRecipe);
    if (alternatives.length) next = alternatives;
  }
  lastRecipes = next; renderRecipes();
});
setPeople(people.value || 2);
