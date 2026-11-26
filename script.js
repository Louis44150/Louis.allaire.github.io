const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ingredients = [];
let lastRecipes = [];
let activeRecipe = null;
let detailPage = null;
const input = $('#ingredientInput');
const list = $('#ingredientList');
const people = $('#people');

// A number field is easier to use precisely than the original small range slider.
people.type = 'number';
people.min = '1';
people.max = '12';
people.step = '1';
people.inputMode = 'numeric';
people.setAttribute('aria-label', 'Nombre de personnes, de 1 à 12');
Object.assign(people.style, {width:'64px',height:'32px',padding:'4px 7px',border:'1px solid #dedacc',borderRadius:'6px',background:'#fffdf8',color:'#243328',font:'600 13px DM Sans, sans-serif'});

const emojis = {tomate:'🍅',tomates:'🍅',oeuf:'🥚',oeufs:'🥚',poulet:'🍗',riz:'🍚',pates:'🍝',fromage:'🧀',courgette:'🥒',courgettes:'🥒',carotte:'🥕',carottes:'🥕',pomme:'🍎',pommes:'🍎',poisson:'🐟',saumon:'🐟',avocat:'🥑',champignon:'🍄',champignons:'🍄',poivron:'🫑',pain:'🍞',patate:'🥔',creme:'🥛',crème:'🥛',lentilles:'🫘',mais:'🌽',oignon:'🧅',ail:'🧄',salade:'🥬',epinards:'🥬',épinards:'🥬',tofu:'🧊'};
const dishWords = {vite:['express','minute','poêlée'],comfort:['fondant','gourmand','réconfortant'],healthy:['léger','équilibré','tout doux'],fresh:['frais','coloré','ensoleillé'],surprise:['surprise','original','maison']};
const dishTypes = {vite:['Poêlée','Assiette express','Bol minute'],comfort:['Gratin','Poêlée fondante','Assiette réconfort'],healthy:['Bol équilibré','Poêlée légère','Assiette complète'],fresh:['Bowl coloré','Assiette fraîche','Salade composée'],surprise:['Création du frigo','Mélange malin','Assiette surprise']};
const foodPhotos = [
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
];

function cleanName(value) { return value.trim().replace(/\s+/g,' ').replace(/^[,;]+|[,;]+$/g,''); }
function addIngredients(raw) {
  raw.split(/[,;\n]+/).map(cleanName).filter(Boolean).forEach(name => {
    if (!ingredients.some(item => item.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'))) ingredients.push(name);
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
    const key = name.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f\s-]/g,'');
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

function normalized(value) { return value.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function classify(name) {
  const n = normalized(name);
  if (/oeuf|poulet|dinde|boeuf|porc|jambon|thon|saumon|poisson|crevette|tofu|lentille|pois chiche|haricot|steak|lard|saucisse/.test(n)) return 'protein';
  if (/riz|pate|nouille|quinoa|semoule|couscous|pain|farine|pomme de terre|patate|polenta|tortilla|wrap/.test(n)) return 'starch';
  if (/tomate|courgette|carotte|poivron|champignon|oignon|ail|salade|epinard|brocoli|aubergine|concombre|chou|mais|petit pois|haricot vert|legume|avocat|celeri|potiron/.test(n)) return 'veg';
  if (/fromage|creme|lait|beurre|yaourt|parmesan|mozzarella|chevre|feta/.test(n)) return 'dairy';
  if (/pomme|poire|banane|fraise|citron|orange|fruit|mangue|ananas/.test(n)) return 'fruit';
  return 'other';
}
function prettyList(items) {
  if (items.length < 2) return items[0] || '';
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0,-1).join(', ')} et ${items[items.length-1]}`;
}
function quantity(name,kind,count,index) {
  const n = normalized(name);
  if (/oeuf/.test(n)) { const amount = count + (index % 2); return `${amount} œuf${amount > 1 ? 's' : ''}`; }
  if (kind === 'fruit') return `${count} pièce${count > 1 ? 's' : ''}`;
  const amount = (kind === 'protein' ? 120 : kind === 'starch' ? 70 : kind === 'dairy' ? 35 : kind === 'veg' ? 120 : 80) * count;
  return `${amount} g`;
}
function makeRecipe(style,index) {
  const count = Number(people.value) || 2;
  const all = [...ingredients];
  const groups = {protein:[],starch:[],veg:[],dairy:[],fruit:[],other:[]};
  all.forEach(item => groups[classify(item)].push(item));
  const type = dishTypes[style][index % dishTypes[style].length];
  const mainItems = all.filter(item => ['protein','veg','starch'].includes(classify(item))).slice(0,2);
  const name = `${type} ${prettyList(mainItems.length ? mainItems : all.slice(0,Math.min(2,all.length)))}`;
  const emoji = style === 'fresh' ? '🥗' : style === 'healthy' ? '🥙' : groups.starch.length ? '🍝' : ['🍳','🥗','🍲'][index % 3];
  const duration = style === 'vite' ? 12 + index * 4 : style === 'comfort' ? 30 + index * 8 : style === 'fresh' ? 15 + index * 4 : 20 + index * 6;
  const descriptions = {healthy:'Une assiette simple et équilibrée avec les ingrédients que tu as.',fresh:'Une idée fraîche qui met tes ingrédients en valeur.',comfort:'Un plat généreux et réconfortant, à partager.',vite:'Une idée facile quand on veut passer à table sans attendre.',surprise:'Une association improvisée pour cuisiner le contenu du frigo.'};
  let steps;
  if (style === 'fresh') {
    steps = [`Lave et coupe ${prettyList(all)}.`,`Assemble dans un saladier. Si tu as du citron, de l’huile ou une sauce, ajoute-en un filet.`,`Mélange délicatement, goûte et sers frais dans ${count} assiette${count > 1 ? 's' : ''}.`];
  } else if (groups.starch.length) {
    steps = [`Fais cuire ${prettyList(groups.starch)} selon les indications du paquet.`,`Pendant ce temps, coupe ${prettyList(all.filter(x => !groups.starch.includes(x)))} en morceaux. Fais cuire à la poêle les ingrédients qui en ont besoin.`,`Mélange le tout, assaisonne à ton goût et répartis dans ${count} assiette${count > 1 ? 's' : ''}.`];
  } else if (groups.protein.length) {
    steps = [`Prépare et coupe ${prettyList(all.filter(x => !groups.protein.includes(x)))} en morceaux.`,`Fais cuire ${prettyList(groups.protein)} complètement à la poêle ou au four, en vérifiant la cuisson adaptée à l’aliment.`,`Ajoute les autres ingrédients, fais revenir ou assemble selon leur nature, puis sers dans ${count} assiette${count > 1 ? 's' : ''}.`];
  } else {
    steps = [`Lave et coupe ${prettyList(all)} en morceaux adaptés.`,`Fais revenir les ingrédients qui se cuisent à la poêle ; assemble les autres crus ou ajoute-les en fin de cuisson.`,`Assaisonne à ton goût et répartis dans ${count} assiette${count > 1 ? 's' : ''}.`];
  }
  return {emoji,name,description:descriptions[style],duration,items:all.map((item,i) => ({name:item,amount:quantity(item,classify(item),count,i)})),steps,label:dishWords[style][index % dishWords[style].length]};
}

function installDetailStyles() {
  if ($('#recipeDetailStyles')) return;
  const style = document.createElement('style'); style.id = 'recipeDetailStyles';
  style.textContent = `.recipe-card{cursor:pointer;transition:transform .2s,box-shadow .2s}.recipe-card:hover,.recipe-card:focus-visible{transform:translateY(-4px);box-shadow:0 12px 30px #24332820;outline:2px solid #466a4b;outline-offset:3px}.recipe-open-link{margin-top:16px;border:0;border-radius:999px;background:#466a4b;color:#fff;padding:11px 17px;font:600 14px 'DM Sans',sans-serif;cursor:pointer}.recipe-detail-page{position:fixed;inset:0;z-index:1000;overflow:auto;background:#f6f3eb;color:#243328;padding:28px max(20px,calc((100vw - 1060px)/2)) 64px;font-family:'DM Sans',sans-serif}.recipe-detail-page *{box-sizing:border-box}.recipe-detail-back{border:0;background:#fffdf8;border-radius:999px;padding:12px 18px;color:#314c36;font:600 14px 'DM Sans',sans-serif;cursor:pointer;box-shadow:0 3px 14px #24332812}.recipe-detail-hero{margin:28px 0 24px;min-height:320px;border-radius:24px;overflow:hidden;position:relative;background:#314c36}.recipe-detail-hero img{width:100%;height:390px;max-height:55vh;object-fit:cover;display:block;opacity:.82}.recipe-detail-hero-copy{position:absolute;inset:auto 0 0;padding:40px;color:white;background:linear-gradient(transparent,#17241de8)}.recipe-detail-hero-copy h1{font:700 clamp(34px,6vw,58px) 'Playfair Display',Georgia,serif;margin:8px 0}.recipe-detail-hero-copy p{margin:0}.recipe-detail-tag{display:inline-block;background:#ffffff25;border:1px solid #ffffff70;border-radius:999px;padding:7px 12px;text-transform:capitalize}.recipe-detail-meta{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}.recipe-detail-meta span{background:#fffdf8;border:1px solid #e4e0d5;border-radius:999px;padding:10px 15px}.recipe-detail-columns{display:grid;grid-template-columns:minmax(230px,.8fr) minmax(0,1.4fr);gap:24px}.recipe-detail-panel{background:#fffdf8;border:1px solid #e4e0d5;border-radius:20px;padding:24px}.recipe-detail-panel h2{font:700 27px 'Playfair Display',Georgia,serif;margin:0 0 18px}.recipe-detail-ingredients{list-style:none;padding:0;margin:0}.recipe-detail-ingredients li{padding:12px 0;border-bottom:1px solid #eae6dc}.recipe-detail-ingredients li:last-child{border:0}.recipe-detail-ingredients b{color:#466a4b}.recipe-detail-steps{padding-left:24px;margin:0}.recipe-detail-steps li{padding:0 0 18px 7px;line-height:1.65}.recipe-detail-steps li::marker{font-weight:700;color:#dd794d}.recipe-detail-gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:24px}.recipe-detail-gallery img{width:100%;height:210px;object-fit:cover;border-radius:16px}.recipe-detail-gallery img:first-child{grid-column:span 2;height:270px}@media(max-width:700px){.recipe-detail-page{padding:18px 16px 40px}.recipe-detail-hero{margin-top:20px;min-height:300px}.recipe-detail-hero img{height:360px}.recipe-detail-hero-copy{padding:24px}.recipe-detail-columns{grid-template-columns:1fr}.recipe-detail-panel{padding:20px}.recipe-detail-gallery img{height:150px}.recipe-detail-gallery img:first-child{height:200px}}`;
  document.head.append(style);
}
function closeRecipeDetail(updateHistory = true) {
  if (!detailPage) return;
  detailPage.remove(); detailPage = null; activeRecipe = null;
  if (updateHistory && location.hash === '#recette') history.back();
}
function openRecipeDetail(recipe) {
  if (detailPage) detailPage.remove();
  activeRecipe = recipe; installDetailStyles();
  detailPage = document.createElement('section'); detailPage.className = 'recipe-detail-page'; detailPage.setAttribute('role','dialog'); detailPage.setAttribute('aria-modal','true'); detailPage.setAttribute('aria-label',`Recette détaillée : ${recipe.name}`);
  const safe = value => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ingredientRows = recipe.items.map(item => `<li><b>${safe(item.amount)}</b> ${safe(item.name)}</li>`).join('');
  const steps = recipe.steps.map(step => `<li>${safe(step)}</li>`).join('');
  detailPage.innerHTML = `<button class="recipe-detail-back" type="button">← Retour aux recettes</button><header class="recipe-detail-hero"><img src="${foodPhotos[0]}" alt="Plat cuisiné présenté dans une assiette"/><div class="recipe-detail-hero-copy"><span class="recipe-detail-tag">${safe(recipe.label)}</span><h1>${safe(recipe.name)}</h1><p>${safe(recipe.description)}</p></div></header><div class="recipe-detail-meta"><span>⏱ ${recipe.duration} min</span><span>👥 ${people.value} personne${Number(people.value) > 1 ? 's' : ''}</span><span>${recipe.emoji} Recette maison</span></div><div class="recipe-detail-columns"><section class="recipe-detail-panel"><h2>Les ingrédients</h2><ul class="recipe-detail-ingredients">${ingredientRows}</ul></section><section class="recipe-detail-panel"><h2>La préparation</h2><ol class="recipe-detail-steps">${steps}</ol></section></div><section class="recipe-detail-gallery" aria-label="Photos d’inspiration"><img src="${foodPhotos[1]}" alt="Salade colorée pour s’inspirer de la recette" loading="lazy"/><img src="${foodPhotos[2]}" alt="Bol de légumes frais" loading="lazy"/></section>`;
  document.body.append(detailPage);
  detailPage.querySelector('.recipe-detail-back').addEventListener('click',() => closeRecipeDetail());
  detailPage.addEventListener('click',event => { if (event.target === detailPage) closeRecipeDetail(); });
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
    const label = document.createElement('span'); label.className = 'recipe-label'; label.textContent = recipe.label;
    const title = document.createElement('h3'); title.textContent = recipe.name;
    const description = document.createElement('p'); description.className = 'recipe-desc'; description.textContent = recipe.description;
    const meta = document.createElement('div'); meta.className = 'recipe-meta'; meta.innerHTML = `<span>⏱ ${recipe.duration} min</span><span>👥 ${people.value} personne${Number(people.value) > 1 ? 's' : ''}</span>`;
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
  const style = $('#mealStyle').value;
  lastRecipes = [0,1,2].map(index => makeRecipe(style,index));
  renderRecipes(); $('#results').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#generateButton').addEventListener('click',generate);
$('#againButton').addEventListener('click',() => {
  if (!ingredients.length) return;
  const style = $('#mealStyle').value;
  const offset = Math.floor(Math.random() * 3);
  lastRecipes = [0,1,2].map(index => makeRecipe(style,index + offset));
  renderRecipes();
});
setPeople(people.value || 2);
