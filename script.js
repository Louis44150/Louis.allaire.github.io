const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ingredients = [];
let lastRecipes = [];
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
people.style.width = '64px';
people.style.height = '32px';
people.style.padding = '4px 7px';
people.style.border = '1px solid #dedacc';
people.style.borderRadius = '6px';
people.style.background = '#fffdf8';
people.style.color = '#243328';
people.style.font = '600 13px DM Sans, sans-serif';

const emojis = {tomate:'🍅',tomates:'🍅',oeuf:'🥚',oeufs:'🥚',poulet:'🍗',riz:'🍚',pates:'🍝',pâtes:'🍝',fromage:'🧀',courgette:'🥒',courgettes:'🥒',carotte:'🥕',carottes:'🥕',pomme:'🍎',pommes:'🍎',poisson:'🐟',saumon:'🐟',avocat:'🥑',champignon:'🍄',champignons:'🍄',poivron:'🫑',poivrons:'🫑',pain:'🍞',patate:'🥔',creme:'🥛',crème:'🥛',lentilles:'🫘',mais:'🌽',oignon:'🧅',oignons:'🧅',ail:'🧄',salade:'🥬',epinards:'🥬',épinards:'🥬',tofu:'🧈'};
const dishWords = {vite:['express','minute','poêlée'],comfort:['fondant','gourmand','réconfortant'],healthy:['léger','équilibré','tout doux'],fresh:['frais','coloré','ensoleillé'],surprise:['surprise','original','maison']};
const dishTypes = {vite:['Poêlée','Assiette express','Bol minute'],comfort:['Gratin','Poêlée fondante','Assiette réconfort'],healthy:['Bol équilibré','Poêlée légère','Assiette complète'],fresh:['Bowl coloré','Assiette fraîche','Salade composée'],surprise:['Création du frigo','Mélange malin','Assiette surprise']};

function cleanName(value) { return value.trim().replace(/\s+/g,' ').replace(/^[,;]+|[,;]+$/g,''); }
function addIngredients(raw) {
  raw.split(/[,;\n]+/).map(cleanName).filter(Boolean).forEach(name => {
    if (!ingredients.some(item => item.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'))) ingredients.push(name);
  });
  renderIngredients();
  input.value = '';
  input.focus();
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
  people.value = count;
  $('#peopleOutput').value = count;
  $('#peopleOutput').textContent = count;
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
function escapeHTML(value) { return value.replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
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
  if (groups.starch.length) {
    steps = [`Fais cuire ${prettyList(groups.starch)} selon les indications du paquet.`,`Pendant ce temps, coupe ${prettyList(all.filter(x => !groups.starch.includes(x)))} en morceaux. Fais cuire à la poêle les ingrédients qui en ont besoin.`,`Mélange le tout, assaisonne à ton goût et répartis dans ${count} assiette${count > 1 ? 's' : ''}.`];
  } else if (groups.protein.length) {
    steps = [`Prépare et coupe ${prettyList(all.filter(x => !groups.protein.includes(x)))} en morceaux.`,`Fais cuire ${prettyList(groups.protein)} complètement à la poêle ou au four, en vérifiant la cuisson adaptée à l’aliment.`,`Ajoute les autres ingrédients, fais revenir ou assemble selon leur nature, puis sers dans ${count} assiette${count > 1 ? 's' : ''}.`];
  } else {
    steps = [`Lave et coupe ${prettyList(all)} en morceaux adaptés.`,`Fais revenir les ingrédients qui se cuisent à la poêle ; assemble les autres crus ou ajoute-les en fin de cuisson.`,`Assaisonne à ton goût et répartis dans ${count} assiette${count > 1 ? 's' : ''}.`];
  }
  if (style === 'fresh') steps = [`Lave et coupe ${prettyList(all)}.`,`Assemble dans un saladier. Si tu as du citron, de l’huile ou une sauce, ajoute-en un filet.`,`Mélange délicatement, goûte et sers frais dans ${count} assiette${count > 1 ? 's' : ''}.`];
  return {emoji,name,description:descriptions[style],duration,ingredients:all.map((item,i) => `<li><b>${quantity(item,classify(item),count,i)}</b> ${escapeHTML(item)}</li>`).join(''),steps,label:dishWords[style][index % dishWords[style].length]};
}
function renderRecipes() {
  const grid = $('#recipeGrid'); grid.replaceChildren();
  lastRecipes.forEach((recipe,index) => {
    const card = document.createElement('article'); card.className = `recipe-card${index === 0 ? ' featured' : ''}`;
    card.innerHTML = `<div class="recipe-top"><span class="recipe-emoji">${recipe.emoji}</span><span class="recipe-label">${recipe.label}</span></div><h3>${escapeHTML(recipe.name)}</h3><p class="recipe-desc">${recipe.description}</p><div class="recipe-meta"><span>◷ ${recipe.duration} min</span><span>♧ ${people.value} personne${Number(people.value) > 1 ? 's' : ''}</span></div><h4>Dans l’assiette</h4><ul class="recipe-ingredients">${recipe.ingredients}</ul><h4>La préparation</h4><ol class="recipe-steps">${recipe.steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ol>`;
    grid.append(card);
  });
  $('#results').hidden = false;
}
function generate() {
  if (!ingredients.length) { $('#formHint').textContent = 'Ajoute au moins un ingrédient avant de chercher une recette.'; input.focus(); return; }
  const style = $('#mealStyle').value;
  lastRecipes = [0,1,2].map(index => makeRecipe(style,index));
  renderRecipes();
  $('#results').scrollIntoView({behavior:'smooth',block:'start'});
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
