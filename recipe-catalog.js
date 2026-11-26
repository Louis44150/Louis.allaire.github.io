/* Curated recipe ideas with links to their inspiration sources. The instructions below
   are original summaries; follow the linked publisher's recipe for exact quantities. */
(() => {
  const recipes = [
    {id:'quiche-saumon',name:'Quiche au saumon',emoji:'🥧',time:40,match:[['saumon','poisson'],['oeuf'],['creme','lait','fromage']],items:['1 pâte brisée','saumon','3 œufs','20 cl de crème','poivre'],steps:['Préchauffe le four à 180 °C et installe la pâte dans un moule.','Répartis le saumon sur la pâte. Bats les œufs avec la crème et verse le mélange dessus.','Enfourne environ 30 minutes, jusqu’à ce que la garniture soit prise et dorée.'],source:'https://www.750g.com/quiche-au-saumon-r2003.htm',sourceName:'750g'},
    {id:'boeuf-bourguignon',name:'Bœuf bourguignon',emoji:'🍲',time:150,match:[['boeuf','bœuf'],['carotte'],['oignon']],items:['600 g de bœuf à mijoter','2 carottes','1 oignon','25 cl de vin rouge','bouillon'],steps:['Coupe le bœuf et les légumes en morceaux. Fais dorer la viande dans une cocotte.','Ajoute l’oignon, les carottes, le vin et un peu de bouillon.','Couvre et laisse mijoter doucement jusqu’à ce que la viande soit tendre.'],source:'https://www.marmiton.org/recettes/recette_boeuf-bourguignon-facile_11098.aspx',sourceName:'Marmiton'},
    {id:'soupe-oignon',name:'Soupe à l’oignon gratinée',emoji:'🧅',time:55,match:[['oignon'],['pain'],['fromage']],items:['4 oignons','4 tranches de pain','80 g de fromage râpé','75 cl de bouillon','1 noix de beurre'],steps:['Émince les oignons et fais-les fondre doucement dans une casserole avec le beurre.','Verse le bouillon et laisse cuire à petit feu une trentaine de minutes.','Répartis dans des bols, ajoute le pain et le fromage, puis fais gratiner au four.'],source:'https://www.750g.com/soupe-a-loignon-gratinee-r3289.htm',sourceName:'750g'},
    {id:'gratin-dauphinois',name:'Gratin dauphinois',emoji:'🥔',time:75,match:[['pomme de terre','patate'],['creme','lait']],items:['800 g de pommes de terre','30 cl de crème','20 cl de lait','1 gousse d’ail','muscade'],steps:['Préchauffe le four à 160 °C. Épluche les pommes de terre et coupe-les en fines rondelles.','Frotte le plat avec l’ail, puis dispose les pommes de terre en couches.','Verse le mélange crème-lait assaisonné et enfourne jusqu’à ce que les pommes de terre soient fondantes.'],source:'https://www.marmiton.org/recettes/recette_le-vrai-gratin-dauphinois-selon-ma-grand-mere_16337.aspx',sourceName:'Marmiton'},
    {id:'ratatouille',name:'Ratatouille provençale',emoji:'🍆',time:55,match:[['courgette'],['aubergine'],['tomate'],['poivron']],items:['1 courgette','1 aubergine','2 tomates','1 poivron','1 oignon','herbes de Provence'],steps:['Coupe les légumes en morceaux de taille similaire et émince l’oignon.','Fais revenir l’oignon et les légumes séparément ou ensemble dans une grande sauteuse avec un filet d’huile.','Réunis les légumes, ajoute les herbes et laisse mijoter jusqu’à ce qu’ils soient tendres.'],source:'https://www.marmiton.org/recettes/recette_ratatouille-facile_21992.aspx',sourceName:'Marmiton'},
    {id:'crepes',name:'Crêpes maison',emoji:'🥞',time:30,match:[['farine'],['oeuf'],['lait']],items:['250 g de farine','3 œufs','50 cl de lait','1 cuillère de sucre','1 pincée de sel'],steps:['Mélange la farine, le sucre et le sel. Ajoute les œufs puis verse le lait progressivement en fouettant.','Laisse reposer la pâte si tu as le temps.','Fais cuire une fine couche de pâte dans une poêle chaude légèrement beurrée, en retournant la crêpe.'],source:'https://www.750g.com/crepes-faciles-r94641.htm',sourceName:'750g'},
    {id:'tarte-pommes',name:'Tarte aux pommes',emoji:'🍎',time:45,match:[['pomme'],['farine','pate']],items:['1 pâte brisée','3 pommes','2 cuillères de sucre','1 noisette de beurre','cannelle (facultatif)'],steps:['Préchauffe le four à 180 °C et dépose la pâte dans un moule.','Épluche et tranche les pommes, puis dispose-les sur la pâte.','Ajoute le sucre et quelques noisettes de beurre. Enfourne jusqu’à ce que la pâte soit dorée.'],source:'https://www.marmiton.org/recettes/recette_tarte-aux-pommes-facile_16725.aspx',sourceName:'Marmiton'},
    {id:'omelette',name:'Omelette aux légumes et fromage',emoji:'🍳',time:18,match:[['oeuf'],['tomate','courgette','champignon','poivron'],['fromage']],items:['4 œufs','1 poignée de légumes','40 g de fromage','1 cuillère de lait','poivre'],steps:['Coupe les légumes en petits dés et fais-les revenir dans une poêle jusqu’à ce qu’ils soient tendres.','Bats les œufs avec le lait et le poivre, puis verse dans la poêle.','Ajoute le fromage et cuis à feu doux. Plie l’omelette quand le dessus est encore légèrement moelleux.'],source:'https://www.marmiton.org/cuisine-facile/facile-tp123623.html',sourceName:'Marmiton — idées faciles'},
    {id:'pates-tomate',name:'Pâtes à la tomate et au basilic',emoji:'🍝',time:25,match:[['pate'],['tomate']],items:['250 g de pâtes','3 tomates','1 gousse d’ail','basilic','parmesan (facultatif)'],steps:['Fais cuire les pâtes dans une casserole d’eau bouillante selon les indications du paquet.','Pendant ce temps, fais revenir l’ail et les tomates coupées dans une poêle.','Mélange les pâtes égouttées avec la sauce et ajoute le basilic et le fromage.'],source:'https://www.750g.com/recettes_faciles.htm',sourceName:'750g — idées faciles'},
    {id:'riz-saute',name:'Riz sauté aux légumes et aux œufs',emoji:'🍚',time:20,match:[['riz'],['oeuf'],['carotte','petit pois','poivron','oignon']],items:['250 g de riz cuit','2 œufs','1 carotte','petits pois','sauce soja'],steps:['Coupe les légumes en petits dés et fais-les sauter dans une poêle chaude.','Ajoute le riz déjà cuit et mélange quelques minutes.','Pousse le riz sur un côté, brouille les œufs dans la poêle, puis mélange et assaisonne.'],source:'https://www.750g.com/recettes_faciles.htm',sourceName:'750g — idées faciles'},
    {id:'salade-lentilles',name:'Salade de lentilles et légumes',emoji:'🥗',time:30,match:[['lentille'],['tomate','carotte','oignon','salade']],items:['200 g de lentilles','1 carotte','1 tomate','1 échalote','vinaigrette'],steps:['Fais cuire les lentilles dans de l’eau jusqu’à ce qu’elles soient tendres, puis égoutte-les.','Coupe les légumes en petits morceaux et prépare une vinaigrette.','Mélange les lentilles refroidies avec les légumes et la vinaigrette.'],source:'https://www.750g.com/recettes_faciles.htm',sourceName:'750g — idées faciles'},
    {id:'poulet-courgette',name:'Poulet poêlé aux courgettes',emoji:'🍗',time:30,match:[['poulet'],['courgette'],['riz','pate','pomme de terre']],items:['300 g de poulet','1 courgette','1 oignon','1 filet d’huile','riz ou pâtes en accompagnement'],steps:['Découpe le poulet et la courgette en morceaux. Fais revenir l’oignon dans une poêle.','Ajoute le poulet et fais-le cuire complètement, puis ajoute la courgette.','Laisse cuire jusqu’à ce que les légumes soient tendres et sers avec un féculent si tu en as.'],source:'https://www.750g.com/recettes_faciles.htm',sourceName:'750g — idées faciles'}
  ];
  const usedKey = 'a-table-used-recipes-v1';
  const photos = [
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
  ];
  let current = [];
  let detail = null;
  const norm = text => text.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const safe = text => String(text).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function pantry() {
    return [...document.querySelectorAll('#ingredientList .ingredient-chip > span:first-child')]
      .map(node => norm(node.textContent.replace(/^\p{Extended_Pictographic}\s*/u,'')));
  }
  function matches(recipe, available) {
    return recipe.match.filter(group => group.some(word => available.some(item => item.includes(norm(word)) || norm(word).includes(item)))).length;
  }
  function used() { try { return JSON.parse(localStorage.getItem(usedKey) || '[]'); } catch { return []; } }
  function saveUsed(ids) { try { localStorage.setItem(usedKey,JSON.stringify(ids.slice(-recipes.length))); } catch {} }
  function chooseBatch() {
    const available = pantry();
    const relevant = recipes.map(recipe => ({recipe,score:matches(recipe,available)})).filter(item => item.score > 0);
    // If pantry items do not match a curated recipe, still offer a varied selection.
    const pool = (relevant.length ? relevant : recipes.map(recipe => ({recipe,score:0})))
      .sort((a,b) => b.score - a.score).map(item => item.recipe);
    let already = used();
    let fresh = pool.filter(recipe => !already.includes(recipe.id));
    if (fresh.length < Math.min(3,pool.length)) { already = []; fresh = pool; }
    for (let i=fresh.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [fresh[i],fresh[j]]=[fresh[j],fresh[i]]; }
    current = fresh.slice(0,3);
    saveUsed([...already,...current.map(recipe => recipe.id)]);
  }
  function closeDetail() { if (detail) { detail.remove(); detail = null; } }
  function showDetail(recipe) {
    closeDetail();
    const count = Math.max(1,Number.parseInt(document.querySelector('#people')?.value,10) || 2);
    detail = document.createElement('section'); detail.className = 'recipe-detail-page'; detail.setAttribute('role','dialog'); detail.setAttribute('aria-modal','true'); detail.setAttribute('aria-label',`Recette : ${recipe.name}`);
    detail.innerHTML = `<button type="button" class="recipe-detail-back">← Retour aux recettes</button><header class="recipe-detail-hero"><img src="${photos[0]}" alt="Plat cuisiné pour illustrer la recette"><div class="recipe-detail-hero-copy"><span class="recipe-detail-tag">Recette sélectionnée</span><h1>${safe(recipe.name)}</h1><p>${recipe.time} min · ${count} personne${count>1?'s':''}</p></div></header><div class="recipe-detail-columns"><section class="recipe-detail-panel"><h2>Les ingrédients</h2><ul class="recipe-detail-ingredients">${recipe.items.map(item=>`<li>${safe(item)}</li>`).join('')}</ul><p>Adapte les quantités selon le nombre de convives.</p></section><section class="recipe-detail-panel"><h2>La préparation</h2><ol class="recipe-detail-steps">${recipe.steps.map(step=>`<li>${safe(step)}</li>`).join('')}</ol><p>Une recette inspirée de <a href="${recipe.source}" target="_blank" rel="noopener noreferrer">${safe(recipe.sourceName)} ↗</a>. Consulte la source pour les détails et variantes.</p></section></div><section class="recipe-detail-gallery" aria-label="Photos d’inspiration"><img src="${photos[1]}" alt="Assiette de légumes colorés" loading="lazy"><img src="${photos[2]}" alt="Bol de légumes frais" loading="lazy"></section>`;
    document.body.append(detail);
    detail.querySelector('.recipe-detail-back').addEventListener('click',closeDetail);
    detail.addEventListener('click',event=>{if(event.target===detail)closeDetail();});
    detail.querySelector('.recipe-detail-back').focus();
  }
  function addStyles() {
    if (document.querySelector('#curatedRecipeStyles')) return;
    const style=document.createElement('style'); style.id='curatedRecipeStyles';
    style.textContent=`.recipe-card{cursor:pointer}.recipe-card:hover,.recipe-card:focus-visible{transform:translateY(-3px);outline:2px solid #466a4b;outline-offset:3px}.recipe-open-link{margin-top:14px;border:0;border-radius:999px;background:#466a4b;color:#fff;padding:10px 15px;font:600 14px 'DM Sans',sans-serif;cursor:pointer}.recipe-source{display:inline-block;margin-top:8px;color:#466a4b;font-size:13px;font-weight:600}.recipe-detail-page{position:fixed;inset:0;z-index:1000;overflow:auto;background:#f6f3eb;color:#243328;padding:24px max(18px,calc((100vw - 1060px)/2)) 56px;font-family:'DM Sans',sans-serif}.recipe-detail-page *{box-sizing:border-box}.recipe-detail-back{border:0;border-radius:999px;background:white;padding:12px 18px;color:#314c36;font-weight:700;cursor:pointer}.recipe-detail-hero{position:relative;margin:24px 0;border-radius:22px;overflow:hidden}.recipe-detail-hero img{display:block;width:100%;height:380px;object-fit:cover;opacity:.82}.recipe-detail-hero-copy{position:absolute;inset:auto 0 0;padding:32px;color:white;background:linear-gradient(transparent,#17241de8)}.recipe-detail-hero-copy h1{font:700 clamp(34px,6vw,58px) 'Playfair Display',Georgia,serif;margin:10px 0}.recipe-detail-tag{border:1px solid #ffffff80;border-radius:99px;padding:7px 12px}.recipe-detail-columns{display:grid;grid-template-columns:.8fr 1.4fr;gap:22px}.recipe-detail-panel{background:#fffdf8;border:1px solid #e4e0d5;border-radius:18px;padding:24px}.recipe-detail-panel h2{font:700 26px 'Playfair Display',Georgia,serif;margin-top:0}.recipe-detail-ingredients{padding-left:20px;line-height:2}.recipe-detail-steps{padding-left:24px}.recipe-detail-steps li{padding:0 0 14px 6px;line-height:1.6}.recipe-detail-gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:22px}.recipe-detail-gallery img{width:100%;height:210px;object-fit:cover;border-radius:14px}.recipe-detail-gallery img:first-child{grid-column:span 2;height:260px}@media(max-width:680px){.recipe-detail-columns{grid-template-columns:1fr}.recipe-detail-hero img{height:330px}.recipe-detail-hero-copy{padding:20px}.recipe-detail-page{padding:16px}.recipe-detail-gallery img{height:150px}}`;
    document.head.append(style);
  }
  function render() {
    addStyles();
    const grid=document.querySelector('#recipeGrid'); if(!grid) return;
    grid.replaceChildren();
    current.forEach((recipe,index)=>{
      const card=document.createElement('article'); card.className=`recipe-card${index===0?' featured':''}`; card.tabIndex=0; card.setAttribute('role','button'); card.setAttribute('aria-label',`Ouvrir ${recipe.name}`);
      card.innerHTML=`<div class="recipe-top"><span class="recipe-emoji">${recipe.emoji}</span><span class="recipe-label">Idée de cuisine</span></div><h3>${safe(recipe.name)}</h3><p class="recipe-desc">Une recette variée à essayer avec tes ingrédients.</p><div class="recipe-meta"><span>⏱ ${recipe.time} min</span><span>👥 ${document.querySelector('#people')?.value || 2} personnes</span></div><button class="recipe-open-link" type="button">Voir la recette →</button><a class="recipe-source" href="${recipe.source}" target="_blank" rel="noopener noreferrer">Source : ${safe(recipe.sourceName)} ↗</a>`;
      card.addEventListener('click',event=>{if(event.target.closest('a'))return;showDetail(recipe);});
      card.addEventListener('keydown',event=>{if(event.target===card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();showDetail(recipe);}});
      grid.append(card);
    });
    document.querySelector('#results').hidden=false;
  }
  function intercept(event) {
    event.preventDefault(); event.stopImmediatePropagation();
    if (!pantry().length) { const hint=document.querySelector('#formHint'); if(hint)hint.textContent='Ajoute au moins un ingrédient avant de chercher une recette.'; return; }
    chooseBatch(); render();
    if(event.currentTarget.id==='generateButton') document.querySelector('#results').scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.querySelector('#generateButton')?.addEventListener('click',intercept,true);
  document.querySelector('#againButton')?.addEventListener('click',intercept,true);
  window.addEventListener('keydown',event=>{if(event.key==='Escape')closeDetail();});
})();
