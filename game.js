(() => {
  'use strict';

  const SAVE_KEY = 'choruswild_save_v3';
  const OWNER_CODE = 'WestvirgiNA';
  const FORMS = ['Common','Rare','Epic'];
  const FORM_MULT = {Common:1,Rare:1.6,Epic:2.45};
  const MAX_LEVEL = 20;
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const now = () => Date.now();
  const today = () => new Date().toISOString().slice(0,10);
  const fmt = n => Math.floor(n).toLocaleString();
  const uid = () => Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
  const secText = ms => {
    const total = Math.max(0,Math.ceil(ms/1000));
    const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),r=total%60;
    return h>0?`${h}:${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
  };

  const ELEMENT_LABELS = {earth:'Stone',leaf:'Leaf',wind:'Gale',water:'Tide',ember:'Ember',aether:'Glow',festival:'Festival'};
  const ELEMENT_COLORS = {earth:'#b7a183',leaf:'#7edc8a',wind:'#b8dcff',water:'#64b9e8',ember:'#ff8a5f',aether:'#d59bff',festival:'#ffd36d'};

  const WORLDS = {
    meadow:{name:'Meadowreach',type:'FOUNDATION ISLAND',difficulty:1,unlockLevel:1,unlockCost:0,crestCost:0,desc:'A wide green basin where stomp, breath and string parts learn to cooperate.',roster:['stonelet','sprigpipe','galegoat','rillkip','mossdrum','whirlhorn','reedram','thrumvine','canopulse'],tempo:96,steps:160,root:48,scale:[0,2,4,7,9],chords:[0,3,4,0,2],profile:'meadow',colors:['#78c891','#91caef','#274c45'],reward:'Mastery reward: Meadow Chorus permanent coin boost.'},
    glass:{name:'Glassreef Basin',type:'RESONANT ISLAND',difficulty:2,unlockLevel:5,unlockCost:18000,crestCost:0,desc:'A flooded crystal shelf where drops, glass, windchimes and low stone pulses interlock.',roster:['stonelet','droplet','glimmerbug','chimeskiff','reefdrum','crystalox','brookbell','prismjaw','reefgale'],tempo:112,steps:176,root:50,scale:[0,3,5,7,10],chords:[0,2,4,1,3],profile:'glass',colors:['#5bbdd0','#6d83d3','#15395b'],reward:'Mastery reward: Nursery incubation becomes 10 percent faster.'},
    moon:{name:'Moonroot Hollow',type:'DREAM ISLAND',difficulty:3,unlockLevel:9,unlockCost:48000,crestCost:0,desc:'A nocturnal root chamber built around breathy chords, ember glow and suspended melodies.',roster:['sprigpipe','droplet','glimmerbug','candlewisp','padfin','moonbloom','brookbell','rootoracle','duskhush'],tempo:86,steps:192,root:45,scale:[0,2,3,7,10],chords:[0,4,2,3,1,4],profile:'moon',colors:['#354270','#6773a8','#141828'],reward:'Mastery reward: Rare breeding chance permanently increases.'},
    gear:{name:'Gearwake Islet',type:'ISLET I',difficulty:5,unlockLevel:13,unlockCost:95000,crestCost:2,desc:'An engine island whose rhythm is assembled from metal clicks, water pressure, coils and low drones.',roster:['stonelet','cinderjaw','glimmerbug','hydrobolt','lavafret','crystalox','coilchoir','gearclast','steamclank'],tempo:134,steps:224,root:41,scale:[0,2,5,6,9],chords:[0,1,3,0,4,1,3],profile:'gear',colors:['#625f74','#b46d4d','#24212d'],reward:'Mastery reward: Gearwake Core doubles offline production cap.'},
    storm:{name:'Stormforge Crag',type:'ASCENT ISLAND',difficulty:7,unlockLevel:18,unlockCost:220000,crestCost:5,desc:'A real rock climb: full kit drums, bass, distorted rhythm parts, lead guitar and thunder brass.',roster:['stonelet','galegoat','cinderjaw','bramblepick','whirlhorn','lavafret','sparkhowl','brassback','brambleamp'],tempo:152,steps:320,root:36,scale:[0,3,5,7,10],chords:[0,5,3,0,6,5,3,4,0,5],profile:'rock',colors:['#684143','#9c604c','#151a27'],reward:'Mastery reward: Storm Crown adds a permanent 15 percent song power bonus.'},
    thistle:{name:'Thistledrone Islet',type:'ISLET II',difficulty:8,unlockLevel:24,unlockCost:390000,crestCost:8,desc:'A highland islet built around a living reed-drone lead, bodhran-style hand percussion and dancing counterlines.',roster:['sprigpipe','galegoat','glimmerbug','cairncap','reedram','skylume','thornchoir','pipeglen','highlandra'],tempo:122,steps:352,root:43,scale:[0,2,4,7,9],chords:[0,4,3,0,5,4,3,0,2,4,0],profile:'reed',colors:['#617c70','#8f69a0','#20253b'],reward:'Mastery reward: Thistle Sigil unlocks Epic pity and a 3x first collection bonus.'},
    flux:{name:'Fluxworks Islet',type:'SYNTHESIS ISLET',difficulty:9,unlockLevel:29,unlockCost:620000,crestCost:11,desc:'No breeding here. Blank Cores are attuned to five energies, then synthesized into increasingly unstable performers.',roster:['rivetwisp','briarcoil','drumflare','phasekiln','thornmotor','pentaflux'],tempo:154,steps:384,root:39,scale:[0,2,3,6,7,10],chords:[0,3,5,1,6,4,2,0,5,3,6,0],profile:'flux',colors:['#26324b','#65d1c2','#101522'],reward:'Mastery reward: Flux Stabilizer permanently improves synthesis success and adds two Blank Core slots.'},
    crown:{name:'Crownfall Islet',type:'FINAL ISLET',difficulty:10,unlockLevel:34,unlockCost:1000000,crestCost:16,desc:'The finale now earns its rock label: orchestral choir and bells over a full drum kit, bass, rhythm guitar and organ.',roster:['thrumvine','prismjaw','rootoracle','gearclast','brassback','thornchoir','crownmaw'],tempo:144,steps:448,root:38,scale:[0,2,3,5,7,10],chords:[0,5,3,4,0,2,5,0,6,3,5,0,4,2],profile:'final',colors:['#3c315d','#8268aa','#151427'],reward:'Mastery reward: Crownfall Resonator and permanent 25 percent production bonus.'},
    seasonal:{name:'Seasonal Island',type:'EVERGREEN FESTIVAL ISLAND',difficulty:4,unlockLevel:10,unlockCost:65000,crestCost:0,desc:'Every festival event stays open here all year. Build the Festival Ensemble, then breed the holiday roster through a permanent progression tree.',roster:['lanternling','ribbonram','paradepod','carolfin','gourdgeist','yulebell','harvesthorn','midnightpop','heartstring','cloverclack','eggleap','sunburst','petalbop','fiestafly','starspangle','leafturn','birthdaycake','snowmelt'],tempo:126,steps:352,root:48,scale:[0,2,4,5,7,9,11],chords:[0,3,4,0,5,3,4,0,2,5,4],profile:'seasonal',colors:['#704d76','#e0b86c','#24314a'],reward:'Mastery reward: Festival Pass gives a permanent 10 percent Resonance bonus from hatching.'}
  };
  const BREED_BASE_MINUTES={meadow:8,glass:18,moon:35,gear:65,storm:120,thistle:210,crown:390};

  const SEASONAL_VISITS={
    meadow:{id:'petalbop',label:'SPRING',start:301,end:515,pair:['sprigpipe','galegoat'],chance:.095},
    glass:{id:'sunburst',label:'SUMMER',start:601,end:831,pair:['stonelet','droplet'],chance:.085},
    moon:{id:'gourdgeist',label:'HALLOWEEN',start:1001,end:1103,pair:['rootoracle','candlewisp'],chance:.075},
    gear:{id:'midnightpop',label:'NEW YEARS',start:1226,end:105,pair:['gearclast','hydrobolt'],chance:.07},
    storm:{id:'starspangle',label:'JULY 4TH',start:628,end:707,pair:['bramblepick','brassback'],chance:.062},
    thistle:{id:'cloverclack',label:'ST PATRICKS',start:310,end:320,pair:['cairncap','pipeglen'],chance:.058},
    flux:{id:'heartstring',label:'VALENTINES',start:207,end:216,pair:['phasekiln','briarcoil'],chance:.052},
    crown:{id:'yulebell',label:'CHRISTMAS',start:1210,end:102,pair:['crownmaw','thornchoir'],chance:.05}
  };
  function mdStamp(d=new Date()){return (d.getMonth()+1)*100+d.getDate();}
  function dateInWindow(start,end,d=new Date()){const md=mdStamp(d);return start<=end?(md>=start&&md<=end):(md>=start||md<=end);}
  function visitActive(k,d=new Date()){const v=SEASONAL_VISITS[k];return !!v&&dateInWindow(v.start,v.end,d);}
  function visitPairMatches(k,a,b){const v=SEASONAL_VISITS[k];if(!v)return false;const pair=[a,b].sort().join('|');return pair===[...v.pair].sort().join('|');}
  function seasonalVisitChance(k){const v=SEASONAL_VISITS[k];if(!v)return 0;return clamp(v.chance+activeTorches(k).length*.003+(state.worlds.moon?.mastered?.008:0),v.chance,.15);}
  function seasonalBreedMinutes(k,form='Common'){const d=WORLDS[k]?.difficulty||4;const base=Math.min(570,210+d*34);const mult=form==='Epic'?1.28:form==='Rare'?1.15:1;return Math.min(600,Math.round(base*mult));}
  function breedSuccessChance(k,id){
    const world=WORLDS[k],m=M[id],complexity=Math.max(0,m.elements.length-2);
    const lanternBoost=activeTorches(k).length*.005;
    return clamp(.95-(world.difficulty-1)*.04-complexity*.05+lanternBoost,.42,.94);
  }
  function breedMinutes(k,id,form='Common'){
    const m=M[id],base=BREED_BASE_MINUTES[k]||45,parts=m.elements.length;
    const complexity=parts<=1?.65:parts===2?1:parts===3?1.35:parts===4?1.7:parts===5?2:2.2;
    const rarity=form==='Rare'?1.28:form==='Epic'?1.65:1;
    return Math.max(3,Math.min(600,Math.round(base*complexity*rarity)));
  }
  function nurseryMinutes(k,id,form='Common'){return Math.max(3,Math.min(600,Math.round(breedMinutes(k,id,form)*.55)));}
  function speedGemCost(end){return Math.max(1,Math.min(20,Math.ceil(Math.max(0,end-now())/1800000)));}

  const SPECIES = [
    {id:'stonelet',name:'Stonelet',elements:['earth'],sound:'kick',anim:'stomp',shape:'boulder',price:250,wait:18,rate:28,bio:'A squat percussion beast that hammers its basalt feet into the ground.'},
    {id:'sprigpipe',name:'Sprigpipe',elements:['leaf'],sound:'whistle',anim:'sing',shape:'sprout',price:300,wait:20,rate:30,bio:'Its hollow stem behaves like a tiny wooden flute when its chest fills with air.'},
    {id:'galegoat',name:'Galegoat',elements:['wind'],sound:'brass',anim:'bob',shape:'goat',price:340,wait:22,rate:33,bio:'A woolly horn singer whose curled horns resonate before every bright call.'},
    {id:'droplet',name:'Droplet',elements:['water'],sound:'water',anim:'squeeze',shape:'drop',price:420,wait:26,rate:37,bio:'A translucent water creature that snaps its cheek fins to shape pitched droplets.'},
    {id:'cinderjaw',name:'Cinderjaw',elements:['ember'],sound:'bass',anim:'sing',shape:'jaw',price:520,wait:30,rate:43,bio:'A furnace-mouthed bass singer that glows hotter at the bottom of every phrase.'},
    {id:'glimmerbug',name:'Glimmerbug',elements:['aether'],sound:'bell',anim:'wing',shape:'moth',price:620,wait:32,rate:48,bio:'A six-winged crystal insect that rings the facets on its abdomen together.'},

    {id:'rillkip',name:'Rillkip',elements:['water'],sound:'water',anim:'bob',shape:'rillkip',price:680,wait:34,rate:52,bio:'A long-legged creek hopper that flicks tuned beads of water from the bowls on its knees.'},
    {id:'chimeskiff',name:'Chimeskiff',elements:['wind'],sound:'bell',anim:'wing',shape:'chimeskiff',price:760,wait:36,rate:56,bio:'A sail-backed glider whose hanging glass vanes ring when its body catches a gust.'},
    {id:'candlewisp',name:'Candlewisp',elements:['ember'],sound:'choir',anim:'sing',shape:'candlewisp',price:840,wait:38,rate:60,bio:'A waxy night singer whose flame splits into harmonizing tongues as it sustains a note.'},
    {id:'hydrobolt',name:'Hydrobolt',elements:['water'],sound:'metal',anim:'squeeze',shape:'hydrobolt',price:920,wait:40,rate:65,bio:'A pressure-tank creature that snaps water pistons into metallic rhythm.'},
    {id:'bramblepick',name:'Bramblepick',elements:['leaf'],sound:'guitar',anim:'strum',shape:'bramblepick',price:980,wait:42,rate:70,bio:'A thorn-backed rocker that plucks stretched vines with a hooked wooden pick.'},
    {id:'cairncap',name:'Cairncap',elements:['earth'],sound:'handdrum',anim:'strike',shape:'cairncap',price:1040,wait:44,rate:74,bio:'A stone-capped hill creature that drums its hollow cairn shell with knotted roots.'},

    {id:'mossdrum',name:'Mossdrum',elements:['earth','leaf'],sound:'handdrum',anim:'strike',shape:'drumroot',price:1700,wait:38,rate:82,bio:'Its root arms strike the two taut seed pods growing from its sides.'},
    {id:'whirlhorn',name:'Whirlhorn',elements:['earth','wind'],sound:'horn',anim:'spin',shape:'spiral',price:1900,wait:42,rate:88,bio:'A spiral-backed crawler that blasts notes through a rotating stone horn.'},
    {id:'reedram',name:'Reedram',elements:['leaf','wind'],sound:'fiddle',anim:'bow',shape:'ramreed',price:2200,wait:44,rate:94,bio:'It bows a living reed stretched between its antlers like a string.'},
    {id:'reefdrum',name:'Reefdrum',elements:['earth','water'],sound:'marimba',anim:'strike',shape:'reef',price:2500,wait:48,rate:102,bio:'A reef-backed drummer with tuned shell plates running down its spine.'},
    {id:'crystalox',name:'Crystalox',elements:['earth','aether'],sound:'bell',anim:'shake',shape:'ox',price:2750,wait:50,rate:109,bio:'A patient crystal ox that shakes a crown of suspended stone chimes.'},
    {id:'brookbell',name:'Brookbell',elements:['water','aether'],sound:'glass',anim:'squeeze',shape:'jelly',price:3100,wait:54,rate:118,bio:'Its bell-shaped body compresses water around crystal ribs to make glassy tones.'},
    {id:'padfin',name:'Padfin',elements:['leaf','water'],sound:'pluck',anim:'strum',shape:'finleaf',price:3350,wait:56,rate:125,bio:'A pond creature that plucks the long lily strings growing from its back.'},
    {id:'moonbloom',name:'Moonbloom',elements:['leaf','aether'],sound:'choir',anim:'sing',shape:'flower',price:3600,wait:58,rate:132,bio:'A moon flower with three faces that breathe one soft chord together.'},
    {id:'lavafret',name:'Lavafret',elements:['earth','ember'],sound:'guitar',anim:'strum',shape:'lizard',price:3900,wait:60,rate:141,bio:'A volcanic lizard that rakes glowing claws across mineral strings on its chest.'},
    {id:'sparkhowl',name:'Sparkhowl',elements:['wind','ember'],sound:'guitar',anim:'sing',shape:'wolf',price:4300,wait:62,rate:149,bio:'A storm wolf whose throat crackles into a gritty melodic howl.'},
    {id:'coilchoir',name:'Coilchoir',elements:['ember','aether'],sound:'synth',anim:'squeeze',shape:'coil',price:4700,wait:64,rate:158,bio:'A hovering coil organism that squeezes its ring body to pulse harmonic current.'},
    {id:'skylume',name:'Skylume',elements:['wind','aether'],sound:'whistle',anim:'wing',shape:'kite',price:5100,wait:66,rate:166,bio:'A kite-shaped glider that opens glowing vents along its wings to whistle in harmony.'},

    {id:'thrumvine',name:'Thrumvine',elements:['earth','leaf','wind'],sound:'pluck',anim:'strum',shape:'vineharp',price:9800,wait:74,rate:238,bio:'A walking vine harp whose roots brace the ground before every rolling arpeggio.'},
    {id:'prismjaw',name:'Prismjaw',elements:['earth','water','aether'],sound:'glass',anim:'strike',shape:'prism',price:11200,wait:76,rate:252,bio:'A crystal leviathan that clicks a row of wet prism teeth into tuned chords.'},
    {id:'rootoracle',name:'Rootoracle',elements:['leaf','water','aether'],sound:'choir',anim:'sing',shape:'oracle',price:12500,wait:78,rate:266,bio:'A rooted seer with four masks; each mask sustains a different tone.'},
    {id:'gearclast',name:'Gearclast',elements:['earth','ember','aether'],sound:'synth',anim:'spin',shape:'machine',price:14800,wait:80,rate:286,bio:'A self-winding mechanical beast that rotates its ribs into syncopated pulses.'},
    {id:'brassback',name:'Brassback',elements:['earth','wind','ember'],sound:'guitar',anim:'strum',shape:'brassback',price:16600,wait:84,rate:304,bio:'A plated rocker that bends a heated metal neck across its back like a giant guitar.'},
    {id:'thornchoir',name:'Thornchoir',elements:['leaf','wind','aether'],sound:'choir',anim:'sing',shape:'thornchoir',price:18400,wait:86,rate:324,bio:'Three thorn-crowned heads trade syllables and lock into one bright harmony.'},

    {id:'canopulse',name:'Canopulse',elements:['earth','leaf','wind','water'],sound:'marimba',anim:'strike',shape:'canopulse',price:28500,wait:94,rate:418,bio:'Meadowreach’s Quad. Four root legs hold a living canopy of tuned rainwood bars.'},
    {id:'reefgale',name:'Reefgale',elements:['earth','wind','water','aether'],sound:'glass',anim:'wing',shape:'reefgale',price:30500,wait:96,rate:438,bio:'Glassreef’s Quad. A manta of stone crystal sails that turns currents into ringing chords.'},
    {id:'duskhush',name:'Duskhush',elements:['leaf','water','ember','aether'],sound:'choir',anim:'sing',shape:'duskhush',price:33000,wait:98,rate:462,bio:'Moonroot’s Quad. Its lantern petals open one by one as a four-voice nocturne blooms.'},
    {id:'steamclank',name:'Steamclank',elements:['earth','water','ember','aether'],sound:'industrial',anim:'spin',shape:'steamclank',price:36000,wait:100,rate:486,bio:'Gearwake’s Quad. A boiler-backed machine beast that plays piston percussion and steam bass.'},
    {id:'brambleamp',name:'Brambleamp',elements:['earth','leaf','wind','ember'],sound:'guitar',anim:'strum',shape:'brambleamp',price:41000,wait:104,rate:520,bio:'Stormforge’s Quad. Its antler-vines form a double-neck instrument and its hooves stomp the backbeat.'},
    {id:'highlandra',name:'Highlandra',elements:['earth','leaf','wind','aether'],sound:'reed',anim:'squeeze',shape:'highlandra',price:44500,wait:108,rate:548,bio:'Thistledrone’s Quad. A shaggy hill giant carrying a many-piped drone organ grown from its shoulders.'},

    {id:'pipeglen',name:'Pipeglen',elements:['leaf','wind','aether'],sound:'reed',anim:'squeeze',shape:'pipeglen',price:26000,wait:90,rate:390,bio:'A round-bellied reed beast that squeezes side bladders while seven pipes carry its melody.',islet:true,special:true},
    {id:'crownmaw',name:'Crownmaw',elements:['earth','leaf','wind','water','ember','aether'],sound:'crown',anim:'sing',shape:'crown',price:0,wait:90,rate:700,bio:'The final conductor. Its crown opens into resonant chambers that answer the choir, guitar and drums.',special:true},

    {id:'rivetwisp',name:'Rivetwisp',elements:['earth','wind','aether'],sound:'glitchpluck',anim:'spin',shape:'rivetwisp',price:0,wait:75,rate:410,bio:'A synthesized triple whose magnetic ribs pluck themselves whenever its floating rivets align.',special:true,synth:true,stability:1},
    {id:'briarcoil',name:'Briarcoil',elements:['leaf','ember','aether'],sound:'synth',anim:'squeeze',shape:'briarcoil',price:0,wait:78,rate:425,bio:'A heated vine coil that bends its body into throbbing filter sweeps.',special:true,synth:true,stability:1},
    {id:'drumflare',name:'Drumflare',elements:['earth','leaf','ember'],sound:'industrial',anim:'strike',shape:'drumflare',price:0,wait:80,rate:438,bio:'A three-legged furnace drummer that vents sparks on every accented hit.',special:true,synth:true,stability:1},
    {id:'phasekiln',name:'Phasekiln',elements:['earth','wind','ember','aether'],sound:'distbass',anim:'spin',shape:'phasekiln',price:0,wait:105,rate:590,bio:'An unstable Quad that folds its kiln shell through phase-shifted bass pulses.',special:true,synth:true,stability:2},
    {id:'thornmotor',name:'Thornmotor',elements:['earth','leaf','wind','ember'],sound:'industrial',anim:'strum',shape:'thornmotor',price:0,wait:108,rate:610,bio:'A Quad whose thorn belts, crank vines and exhaust reeds lock into a mechanical groove.',special:true,synth:true,stability:2},
    {id:'pentaflux',name:'Pentaflux',elements:['earth','leaf','wind','ember','aether'],sound:'fluxlead',anim:'squeeze',shape:'pentaflux',price:0,wait:150,rate:920,bio:'Fluxworks’ Quint. Five energy chambers orbit a central mouth and take turns controlling the entire mix.',special:true,synth:true,stability:3},

    {id:'lanternling',name:'Lanternling',elements:['festival'],sound:'bell',anim:'shake',shape:'lanternling',price:1200,wait:35,rate:66,bio:'A tiny festival lantern that rings the metal handle above its glowing body.',special:true,festivalStarter:true},
    {id:'ribbonram',name:'Ribbonram',elements:['festival'],sound:'harp',anim:'strum',shape:'ribbonram',price:1500,wait:38,rate:72,bio:'A ribbon-bodied ram whose curled streamers tighten into bright harp strings.',special:true,festivalStarter:true},
    {id:'paradepod',name:'Paradepod',elements:['festival'],sound:'snareline',anim:'strike',shape:'paradepod',price:1800,wait:40,rate:78,bio:'A six-legged parade pod with a marching drum shell and two baton antennae.',special:true,festivalStarter:true},
    {id:'carolfin',name:'Carolfin',elements:['festival'],sound:'reed',anim:'squeeze',shape:'carolfin',price:2200,wait:42,rate:84,bio:'A round festival fish with organ pipes along its back and bellows hidden in its fins.',special:true,festivalStarter:true},

    {id:'gourdgeist',name:'Gourdgeist',elements:['festival'],sound:'spookorgan',anim:'sing',shape:'gourdgeist',price:6666,wait:90,rate:260,bio:'Halloween. A crooked lantern spirit whose ribs play organ chords and rattling seeds.',special:true,seasonal:'HALLOWEEN'},
    {id:'yulebell',name:'Yulebell',elements:['festival'],sound:'sleigh',anim:'shake',shape:'yulebell',price:7200,wait:90,rate:265,bio:'Christmas. A warm bell-beast with antler chimes and a bassy winter stomp.',special:true,seasonal:'CHRISTMAS'},
    {id:'harvesthorn',name:'Harvesthorn',elements:['festival'],sound:'fiddle',anim:'bow',shape:'harvesthorn',price:7000,wait:90,rate:262,bio:'Thanksgiving. A cornucopia-backed fiddler with husk strings and wooden hooves.',special:true,seasonal:'THANKSGIVING'},
    {id:'midnightpop',name:'Midnightpop',elements:['festival'],sound:'firework',anim:'spin',shape:'midnightpop',price:7600,wait:90,rate:275,bio:'New Years. A clock-faced firework creature that counts into explosive syncopation.',special:true,seasonal:'NEW YEARS'},
    {id:'heartstring',name:'Heartstring',elements:['festival'],sound:'harp',anim:'strum',shape:'heartstring',price:6900,wait:90,rate:258,bio:'Valentines. A ribbon-winged harp creature whose chest strings answer one another.',special:true,seasonal:'VALENTINES'},
    {id:'cloverclack',name:'Cloverclack',elements:['festival'],sound:'tap',anim:'strike',shape:'cloverclack',price:6400,wait:90,rate:250,bio:'St Patricks. A four-leaf tap dancer with coin plates under its feet.',special:true,seasonal:'ST PATRICKS'},
    {id:'eggleap',name:'Eggleap',elements:['festival'],sound:'marimba',anim:'bob',shape:'eggleap',price:6500,wait:90,rate:252,bio:'Easter. A spring-legged shell drummer that knocks bright notes from its painted plates.',special:true,seasonal:'EASTER'},
    {id:'sunburst',name:'Sunburst',elements:['festival'],sound:'steel',anim:'strike',shape:'sunburst',price:7000,wait:90,rate:268,bio:'Summer. A ray-finned beach drummer that plays a warm metallic pan with its tail.',special:true,seasonal:'SUMMER'},
    {id:'petalbop',name:'Petalbop',elements:['festival'],sound:'pluck',anim:'strum',shape:'petalbop',price:6100,wait:90,rate:246,bio:'Spring. A dancing blossom with seed strings stretched between its long arms.',special:true,seasonal:'SPRING'},
    {id:'fiestafly',name:'Fiestafly',elements:['festival'],sound:'trumpet',anim:'wing',shape:'fiestafly',price:7300,wait:90,rate:270,bio:'Cinco de Mayo. A bright winged brass player whose curled proboscis works like a trumpet.',special:true,seasonal:'CINCO DE MAYO'},
    {id:'starspangle',name:'Starspangle',elements:['festival'],sound:'snareline',anim:'strike',shape:'starspangle',price:7400,wait:90,rate:272,bio:'July 4th. A star-plated marcher carrying two tiny side drums and a bright piccolo tail.',special:true,seasonal:'JULY 4TH'},
    {id:'leafturn',name:'Leafturn',elements:['festival'],sound:'acoustic',anim:'strum',shape:'leafturn',price:6200,wait:90,rate:248,bio:'Fall. A maple-backed acoustic creature that brushes leaf strings with branch fingers.',special:true,seasonal:'FALL'},
    {id:'birthdaycake',name:'Birthdaycake',elements:['festival'],sound:'partyhorn',anim:'sing',shape:'birthdaycake',price:8000,wait:90,rate:280,bio:'Anniversary. A layered cake creature with candle pipes and a party-horn mouth.',special:true,seasonal:'ANNIVERSARY'},
    {id:'snowmelt',name:'Snowmelt',elements:['festival'],sound:'glass',anim:'squeeze',shape:'snowmelt',price:6600,wait:90,rate:255,bio:'Late Winter. An icicle-backed puddle creature that taps thawing glass droplets into chords.',special:true,seasonal:'LATE WINTER'}
  ];
  const M = Object.fromEntries(SPECIES.map(x=>[x.id,x]));
  const comboKey = arr => [...new Set(arr)].sort().join('+');
  const COMBO = {};
  SPECIES.forEach(s=>{ if(!s.special) COMBO[comboKey(s.elements)] = s.id; });

  const FESTIVAL_RECIPES={
    petalbop:['lanternling','ribbonram'], sunburst:['paradepod','carolfin'], gourdgeist:['lanternling','paradepod'], yulebell:['ribbonram','carolfin'],
    heartstring:['ribbonram','paradepod'], midnightpop:['lanternling','carolfin'], harvesthorn:['petalbop','gourdgeist'], cloverclack:['heartstring','petalbop'],
    eggleap:['petalbop','yulebell'], fiestafly:['sunburst','heartstring'], starspangle:['midnightpop','sunburst'], leafturn:['harvesthorn','petalbop'],
    birthdaycake:['midnightpop','yulebell'], snowmelt:['yulebell','gourdgeist']
  };
  const FESTIVAL_BY_PAIR={}; Object.entries(FESTIVAL_RECIPES).forEach(([id,pair])=>FESTIVAL_BY_PAIR[[...pair].sort().join('|')]=id);
  function festivalTargetFromPair(a,b){return FESTIVAL_BY_PAIR[[a,b].sort().join('|')]||null;}

  const DEFAULT_GOALS = [
    {id:'g1',title:'Start the choir',text:'Place any 3 monsters.',type:'owned',n:3,reward:{coins:1200,xp:80}},
    {id:'g2',title:'Complete a duet',text:'Breed any hybrid monster.',type:'hybrid',n:1,reward:{gems:4,xp:120}},
    {id:'g3',title:'Color outside the common',text:'Discover any Rare form.',type:'rare',n:1,reward:{gems:8,crests:1,xp:180}},
    {id:'g4',title:'Epic anatomy',text:'Discover any Epic form.',type:'epic',n:1,reward:{gems:18,crests:1,xp:300}},
    {id:'g5',title:'Seven voices',text:'Fill a complete world roster.',type:'fullworld',n:1,reward:{crests:2,gems:12,xp:400}},
    {id:'g6',title:'Reach the Crag',text:'Unlock Stormforge Crag.',type:'world',world:'storm',n:1,reward:{crests:2,gems:20,xp:550}},
    {id:'g7',title:'Living drone',text:'Place Pipeglen on Thistledrone Islet.',type:'species',species:'pipeglen',n:1,reward:{crests:3,gems:25,xp:700}},
    {id:'g8',title:'Crown the song',text:'Unlock Crownmaw.',type:'species',species:'crownmaw',n:1,reward:{gems:75,crests:5,xp:1200}},
    {id:'g9',title:'Scratch fever',text:'Complete 5 Monster Scratch tickets.',type:'scratch',n:5,reward:{gems:18,crests:1,xp:350}},
    {id:'g10',title:'Stable workshop',text:'Complete 3 Fluxworks syntheses.',type:'synth',n:3,reward:{gems:28,crests:2,resonance:100,xp:600}},
    {id:'g11',title:'Festival circuit',text:'Collect 6 seasonal performers.',type:'seasonal',n:6,reward:{gems:36,crests:2,xp:720}},
    {id:'g12',title:'Huge chorus',text:'Own 40 total performers.',type:'owned',n:40,reward:{gems:55,resonance:160,xp:900}},
    {id:'g13',title:'World tour',text:'Master 5 worlds.',type:'mastered',n:5,reward:{gems:70,crests:5,xp:1200}},
    {id:'g14',title:'Fivefold instability',text:'Synthesize Pentaflux.',type:'species',species:'pentaflux',n:1,reward:{gems:90,crests:6,xp:1500}}
  ];

  function blankWorldState(){const out={};Object.keys(WORLDS).forEach(k=>out[k]={castle:1,placed:[],torches:[],breed:null,nursery:null,mastered:false});return out;}
  function makeOwned(id,form,home){return {uid:uid(),id,form,level:1,food:0,home,lastCollected:now(),muted:false,volume:100};}
  function freshState(){
    const st={version:4,level:1,xp:0,coins:4500,gems:45,resonance:0,crests:0,currentWorld:'meadow',unlocked:['meadow'],worlds:blankWorldState(),owned:[],goalClaims:[],daily:{gift:null,wheel:null,scratch:null},scratchTicket:null,scratchCooldowns:{grand:0,supreme:0,ultimate:0,transcendent:0},stageLayoutV2Migrated:true,settings:{master:100,music:100,sfx:100,reduced:false},stats:{breeds:0,failedBreeds:0,rare:0,epic:0,totalCoins:0,synths:0,vaults:0,seasonals:0,scratches:0},lastSeen:now(),epicPity:0,synth:{neutral:8,earth:0,leaf:0,wind:0,ember:0,aether:0,level:1,attuneJobs:[],fiveCycle:null,job:null}};
    ['stonelet','sprigpipe','galegoat'].forEach(id=>{const o=makeOwned(id,'Common','meadow');st.owned.push(o);st.worlds.meadow.placed.push(o.uid);});return st;
  }
  function load(){
    try{
      let raw=localStorage.getItem(SAVE_KEY);
      if(!raw){raw=localStorage.getItem('choruswild_save_v2')||localStorage.getItem('choruswild_save_v1');}
      if(!raw)return freshState();
      const s=JSON.parse(raw),base=freshState();
      const merged={...base,...s,version:4,settings:{...base.settings,...(s.settings||{})},stats:{...base.stats,...(s.stats||{})},daily:{...base.daily,...(s.daily||{})},scratchCooldowns:{...base.scratchCooldowns,...(s.scratchCooldowns||{})},synth:{...base.synth,...(s.synth||{})}};
      if(!Array.isArray(merged.synth.attuneJobs))merged.synth.attuneJobs=[];if(s.synth&&s.synth.attune){merged.synth.attuneJobs.push(s.synth.attune);delete merged.synth.attune;}
      if(!('scratchTicket' in merged))merged.scratchTicket=null;if(!merged.scratchCooldowns)merged.scratchCooldowns={grand:0,supreme:0,ultimate:0,transcendent:0};
      merged.worlds={...blankWorldState(),...(s.worlds||{})};Object.keys(WORLDS).forEach(k=>merged.worlds[k]={...blankWorldState()[k],...(merged.worlds[k]||{})});
      merged.unlocked=[...new Set(merged.unlocked||['meadow'])].filter(k=>WORLDS[k]);if(!WORLDS[merged.currentWorld])merged.currentWorld='meadow';
      // Stage layout v2 migration: the old renderer had only 14 visual slots and level-5 castles capped at 21 beds.
      // Existing saves get one automatic refill pass so owned-but-hidden performers (especially seasonals) return to the stage.
      if(!s.stageLayoutV2Migrated){
        Object.keys(WORLDS).forEach(k=>{
          const ws=merged.worlds[k],valid=new Set(merged.owned.filter(o=>o.home===k).map(o=>o.uid));
          ws.placed=(ws.placed||[]).filter(uid=>valid.has(uid));
          const already=new Set(ws.placed),ownedHere=merged.owned.filter(o=>o.home===k&&!already.has(o.uid));
          ownedHere.sort((a,b)=>Number(!!M[b.id]?.seasonal)-Number(!!M[a.id]?.seasonal)||({Epic:3,Rare:2,Common:1}[b.form]||0)-({Epic:3,Rare:2,Common:1}[a.form]||0));
          for(const o of ownedHere){if(ws.placed.length>=castleBeds(ws.castle))break;ws.placed.push(o.uid);}
        });
        merged.stageLayoutV2Migrated=true;
        try{localStorage.setItem(SAVE_KEY,JSON.stringify(merged));}catch{}
      }
      return merged;
    }catch(e){return freshState();}
  }

  let state=load();
  let currentPanel=null,formFilter='Common',breedPick=[],songTimer=null,songStep=0,audio=null,wheelRotation=0;

  function save(){state.lastSeen=now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
  function showDiscovery(id,form,k,source='DISCOVERED'){
    const m=M[id];if(!m||state.settings.reduced)return;
    const old=$('.discovery-splash');if(old)old.remove();
    const d=document.createElement('div');d.className=`discovery-splash form-${form.toLowerCase()}`;
    d.innerHTML=`<div class="discovery-rays"></div><div class="discovery-card"><div class="eyebrow">${source}</div><div class="discovery-art">${monsterSVG(m,form)}</div><div class="discovery-form">${form.toUpperCase()}</div><h2>${m.name}</h2><p>${WORLDS[k]?.name||'Choruswild'} collection expanded.</p></div>`;
    document.body.appendChild(d);setTimeout(()=>d.classList.add('leaving'),1650);setTimeout(()=>d.remove(),2150);
  }

  function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;$('#toastStack').appendChild(el);setTimeout(()=>el.remove(),3200);}
  function levelNeed(l){return Math.floor(180*Math.pow(1.34,l-1));}
  function gainXP(n){state.xp+=n;let leveled=false;while(state.level<50&&state.xp>=levelNeed(state.level)){state.xp-=levelNeed(state.level);state.level++;state.gems+=2;leveled=true;}if(leveled){sfx('level');toast(`Level ${state.level} reached. Two Gems added.`);}}
  function currency(name,n){state[name]=Math.max(0,(state[name]||0)+n);if(name==='coins'&&n>0)state.stats.totalCoins+=n;}
  function grantDaily(){if(state.daily.gift===today())return;const day=(Math.floor(Date.now()/86400000)%7)+1;const rewards=[{coins:800},{coins:1400},{gems:3},{coins:2200},{resonance:12},{gems:6},{crests:1}],r=rewards[day-1];Object.entries(r).forEach(([k,v])=>currency(k,v));state.daily.gift=today();toast(`Daily gift ${day} claimed.`);save();}
  function masteryProduction(){let x=1;if(state.worlds.meadow.mastered)x*=1.08;if(state.worlds.crown.mastered)x*=1.25;return x;}
  function incomePerHour(o){const m=M[o.id],levelMult=1+(o.level-1)*.18;return m.rate*FORM_MULT[o.form]*levelMult*masteryProduction();}
  function offlineProgress(){const elapsed=Math.max(0,now()-(state.lastSeen||now())),cap=state.worlds.gear.mastered?24:12,hours=Math.min(cap,elapsed/3600000);if(hours<.08)return;let earned=0;state.owned.forEach(o=>{earned+=incomePerHour(o)*hours*.42;o.lastCollected=now();});earned=Math.floor(earned);if(earned>0){currency('coins',earned);toast(`Offline choir earned ${fmt(earned)} Coins.`);}}
  function ownedForm(id,form,home=null){return state.owned.find(o=>o.id===id&&o.form===form&&(!home||o.home===home));}
  function currentWS(){return state.worlds[state.currentWorld];}
  function worldRosterOwned(k){const roster=WORLDS[k].roster;return state.owned.filter(o=>o.home===k&&roster.includes(o.id)&&o.form==='Common');}
  function collectAll(){let total=0;state.owned.forEach(o=>{const elapsed=Math.min(6,(now()-o.lastCollected)/3600000);if(elapsed>.02){total+=incomePerHour(o)*elapsed;o.lastCollected=now();}});total=Math.floor(total);if(!total){toast('The choir needs a little more time to produce Coins.');return;}currency('coins',total);sfx('coin');gainXP(Math.max(3,Math.floor(total/800)));save();renderTop();toast(`Collected ${fmt(total)} Coins.`);}


  function speciesHash(id){let h=2166136261;for(const ch of id){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function hslHex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}return '#'+[r,g,b].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');}
  function palette(m,form){
    const es=m.elements.map(e=>ELEMENT_COLORS[e]);
    let a=es[0]||'#91a4ba', b=es[1]||'#d8e4ee', c=es[2]||'#405675';
    const h=speciesHash(m.id)%360;
    if(form==='Rare'){
      const x=hslHex(h+68,72,62),y=hslHex(h+194,78,68),z=hslHex(h+286,66,48);
      return [mix(a,x,.48),mix(b,y,.43),mix(c,z,.5),'#f8fbff'];
    }
    if(form==='Epic'){
      const x=hslHex(h+151,86,58),y=hslHex(h+311,88,64),z=hslHex(h+34,90,59);
      return [mix(a,x,.6),mix(b,y,.55),mix(c,z,.58),hslHex(h+55,92,86)];
    }
    return [a,b,c,'#f8fbff'];
  }
  function mix(a,b,t){
    const p=x=>[parseInt(x.slice(1,3),16),parseInt(x.slice(3,5),16),parseInt(x.slice(5,7),16)];
    const A=p(a),B=p(b),C=A.map((v,i)=>Math.round(v+(B[i]-v)*t));
    return '#'+C.map(v=>v.toString(16).padStart(2,'0')).join('');
  }
  function eye(x,y,r=9,pupil=4){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f9fcff" stroke="#273147" stroke-width="2"/><circle cx="${x+1}" cy="${y+1}" r="${pupil}" fill="#162035"/><circle cx="${x+3}" cy="${y-2}" r="1.7" fill="#fff"/>`;}
  function formMark(form,c){
    if(form==='Common')return '';
    if(form==='Rare')return `<path d="M28 26 Q45 8 61 27 Q45 21 28 26Z" fill="${c}" opacity=".9"/><circle cx="147" cy="31" r="7" fill="${c}" opacity=".9"/>`;
    return `<path d="M22 30 L37 7 L49 28 L64 6 L77 31" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/><circle cx="145" cy="31" r="10" fill="none" stroke="${c}" stroke-width="4"/><path d="M145 14V48M128 31H162" stroke="${c}" stroke-width="3" opacity=".9"/>`;
  }

  function speciesDetail(m,a,b,c){
    const h=speciesHash(m.id),v=(h>>>2)%14;
    const details=[
      `<g class="species-detail" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M55 70 Q69 59 80 67"/><path d="M100 67 Q112 59 126 70"/></g>`,
      `<g class="species-detail" fill="${c}" opacity=".78"><circle cx="55" cy="103" r="4"/><circle cx="46" cy="110" r="2.5"/><circle cx="125" cy="103" r="4"/><circle cx="134" cy="110" r="2.5"/></g>`,
      `<g class="species-detail" fill="none" stroke="${b}" stroke-width="4" stroke-linecap="round"><path d="M43 95 L18 87 M44 105 L16 109 M137 95 L162 87 M136 105 L164 109"/></g>`,
      `<g class="species-detail" fill="${c}" stroke="#263047" stroke-width="3"><path d="M90 47 L99 60 L90 72 L81 60Z"/></g>`,
      `<g class="species-detail" fill="${b}" stroke="#263047" stroke-width="3"><path d="M61 119 L68 139 L77 122Z"/><path d="M103 122 L112 139 L119 119Z"/></g>`,
      `<g class="species-detail" fill="none" stroke="${c}" stroke-width="3" opacity=".8"><circle cx="72" cy="83" r="15"/><circle cx="108" cy="83" r="15"/></g>`,
      `<g class="species-detail" fill="none" stroke="${b}" stroke-width="5" stroke-linecap="round" opacity=".72"><path d="M60 58 Q90 75 120 58"/><path d="M60 126 Q90 110 120 126"/></g>`,
      `<g class="species-detail" fill="${c}" stroke="#263047" stroke-width="3"><path d="M90 63 L98 79 L90 84 L82 79Z"/></g>`,
      `<g class="species-detail" fill="${b}" stroke="#263047" stroke-width="3"><path d="M76 137 Q90 158 104 137 Q99 165 90 171 Q81 164 76 137Z"/></g>`,
      `<g class="species-detail" fill="${c}" stroke="#263047" stroke-width="3"><path d="M46 77 L23 65 L31 92Z"/><path d="M134 77 L157 65 L149 92Z"/></g>`,
      `<g class="species-detail" fill="${c}" opacity=".72"><circle cx="90" cy="39" r="4"/><circle cx="80" cy="45" r="3"/><circle cx="100" cy="45" r="3"/><circle cx="90" cy="51" r="2.5"/></g>`,
      `<g class="species-detail" fill="none" stroke="${c}" stroke-width="4" opacity=".75"><path d="M52 118 Q65 132 78 123 M102 123 Q116 132 129 118"/></g>`,
      `<g class="species-detail" fill="${b}" stroke="#263047" stroke-width="3"><circle cx="45" cy="128" r="7"/><circle cx="135" cy="128" r="7"/></g>`,
      `<g class="species-detail" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="3 5" opacity=".8"><path d="M49 53 Q90 30 131 53"/></g>`
    ];
    return details[v];
  }

  function variantAnatomy(m,form,a,b,c){
    if(form==='Common')return '';
    const h=speciesHash(m.id),v=h%10,w=(h>>>5)%10;
    const rare=[
      `<g class="variant-anatomy rare-anatomy" fill="${b}" stroke="#263047" stroke-width="4"><path d="M34 60 L13 38 L43 43Z"/><path d="M146 60 L167 38 L137 43Z"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"><path d="M52 39 Q34 13 21 27"/><path d="M128 39 Q146 13 159 27"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="${c}" stroke="#263047" stroke-width="3"><path d="M24 91 L4 76 L8 108Z"/><path d="M156 91 L176 76 L172 108Z"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="${b}" stroke="#263047" stroke-width="4"><path d="M58 36 L71 8 L84 37Z"/><path d="M96 37 L109 8 L122 36Z"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="none" stroke="${b}" stroke-width="6"><path d="M23 117 Q8 135 22 151 Q42 143 46 126"/><path d="M157 117 Q172 135 158 151 Q138 143 134 126"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="${c}"><circle cx="28" cy="50" r="7"/><circle cx="151" cy="51" r="7"/><circle cx="89" cy="18" r="8"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="${b}" stroke="#263047" stroke-width="3"><path d="M50 145 L36 172 L64 153Z"/><path d="M130 145 L144 172 L116 153Z"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="none" stroke="${c}" stroke-width="5"><circle cx="90" cy="91" r="70" stroke-dasharray="4 12"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="${b}" stroke="#263047" stroke-width="3"><path d="M17 83 Q7 51 30 44 Q45 61 39 84Z"/><path d="M163 83 Q173 51 150 44 Q135 61 141 84Z"/></g>`,
      `<g class="variant-anatomy rare-anatomy" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"><path d="M56 151 Q89 166 124 150"/></g>`
    ];
    const epic=[
      `<g class="variant-anatomy epic-anatomy" fill="${c}" stroke="#263047" stroke-width="4"><path d="M28 72 Q-1 37 10 18 Q47 34 60 63Z"/><path d="M152 72 Q181 37 170 18 Q133 34 120 63Z"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="none" stroke="${b}" stroke-width="7" stroke-linecap="round"><path d="M42 47 Q20 9 44 3 Q65 18 70 45"/><path d="M138 47 Q160 9 136 3 Q115 18 110 45"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="${c}" stroke="#263047" stroke-width="3"><path d="M44 42 L58 2 L74 40 L90 0 L107 40 L124 3 L138 43Z"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="none" stroke="${c}" stroke-width="5"><ellipse cx="90" cy="91" rx="78" ry="61" stroke-dasharray="7 8"/><circle cx="16" cy="90" r="8" fill="${b}"/><circle cx="164" cy="90" r="8" fill="${b}"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="${b}" stroke="#263047" stroke-width="4"><path d="M19 111 L1 137 L31 134Z"/><path d="M161 111 L179 137 L149 134Z"/><path d="M90 151 L76 178 L104 178Z"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="${c}" stroke="#263047" stroke-width="3"><circle cx="22" cy="42" r="11"/><circle cx="158" cy="42" r="11"/><circle cx="20" cy="137" r="9"/><circle cx="160" cy="137" r="9"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="none" stroke="${b}" stroke-width="9" stroke-linecap="round"><path d="M45 151 Q20 165 9 147"/><path d="M135 151 Q160 165 171 147"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="${c}" stroke="#263047" stroke-width="3"><path d="M26 93 L2 74 L7 108Z"/><path d="M154 93 L178 74 L173 108Z"/><path d="M90 24 L76 1 L104 1Z"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="none" stroke="${c}" stroke-width="6"><path d="M18 63 Q2 92 20 121 M162 63 Q178 92 160 121"/><path d="M58 20 Q90 4 122 20"/></g>`,
      `<g class="variant-anatomy epic-anatomy" fill="${b}" stroke="#263047" stroke-width="3"><path d="M40 51 Q16 25 29 10 Q58 22 67 49Z"/><path d="M140 51 Q164 25 151 10 Q122 22 113 49Z"/></g>`
    ];
    return form==='Rare'?rare[v]:rare[v]+epic[w];
  }

  function performanceFX(m,c){
    const base=`stroke="${c}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    if(m.anim==='stomp')return `<g class="perf-fx fx-stomp" ${base}><ellipse cx="52" cy="157" rx="22" ry="7" stroke-width="5"/><ellipse cx="129" cy="157" rx="22" ry="7" stroke-width="5"/></g>`;
    if(m.anim==='strike')return `<g class="perf-fx fx-strike" ${base}><path d="M22 104 l-12 -10 M28 94 l-4 -17 M150 104 l13 -10 M145 94 l4 -17" stroke-width="6"/></g>`;
    if(m.anim==='strum')return `<g class="perf-fx fx-strum" ${base}><path d="M44 80 Q90 52 139 80 M43 91 Q90 64 140 91 M45 102 Q90 76 138 102" stroke-width="3"/></g>`;
    if(m.anim==='bow')return `<g class="perf-fx fx-bow" ${base}><path d="M34 120 L146 48" stroke-width="6"/><path d="M42 125 L151 55" stroke-width="2"/></g>`;
    if(m.anim==='squeeze')return `<g class="perf-fx fx-squeeze" ${base}><path d="M19 91 H42 M138 91 H163 M24 76 H47 M133 76 H158" stroke-width="5"/></g>`;
    if(m.anim==='wing')return `<g class="perf-fx fx-wing" ${base}><path d="M18 53 Q6 80 18 108 M161 53 Q173 80 161 108" stroke-width="5"/></g>`;
    if(m.anim==='shake')return `<g class="perf-fx fx-shake" fill="${c}" stroke="none"><circle cx="34" cy="40" r="6"/><circle cx="145" cy="36" r="5"/><circle cx="154" cy="92" r="4"/></g>`;
    if(m.anim==='spin')return `<g class="perf-fx fx-spin" ${base}><circle cx="90" cy="92" r="67" stroke-width="4" stroke-dasharray="12 10"/></g>`;
    if(m.anim==='bob')return `<g class="perf-fx fx-bob" ${base}><path d="M21 72 Q7 91 22 110 M158 72 Q172 91 157 110" stroke-width="5"/></g>`;
    return `<g class="perf-fx fx-sing" ${base}><path d="M129 101 Q154 91 166 104 M132 113 Q155 110 168 122" stroke-width="5"/></g>`;
  }

  function monsterSVG(m,form='Common'){
    const [a,b,c,hi]=palette(m,form); const epic=form==='Epic', rare=form==='Rare';
    let body='';
    switch(m.shape){
      case'boulder':
        body=`<path d="M42 126 Q22 105 31 70 Q38 34 79 29 Q126 20 149 59 Q168 93 143 128 Q116 153 69 148Z" fill="${a}" stroke="#273147" stroke-width="5"/><path d="M42 87 Q69 73 85 88 Q104 66 142 80" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" opacity=".7"/><path d="M49 133 L39 158 M133 132 L144 157" stroke="${b}" stroke-width="15" stroke-linecap="round"/>${eye(71,75,10)}${eye(106,74,10)}<path d="M72 106 Q89 119 106 105" fill="none" stroke="#253047" stroke-width="6" stroke-linecap="round"/>${rare?`<path d="M44 56 L30 28 L58 45 M132 51 L153 25 L145 62" fill="none" stroke="${b}" stroke-width="10" stroke-linecap="round"/>`:''}${epic?`<path d="M31 70 L8 58 L25 98 M149 68 L173 55 L158 99" fill="${c}" stroke="#273147" stroke-width="4"/><circle cx="89" cy="27" r="18" fill="${c}" stroke="#273147" stroke-width="4"/>`:''}`;break;
      case'sprout':
        body=`<path d="M83 55 Q72 31 49 28 Q48 51 76 65 M98 55 Q110 27 137 30 Q133 54 104 67" fill="${b}" stroke="#2b3b3d" stroke-width="4"/><path d="M61 60 Q88 43 119 61 L126 125 Q113 153 87 151 Q54 149 50 121Z" fill="${a}" stroke="#273147" stroke-width="5"/><path d="M86 76 Q83 108 85 137" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>${eye(73,78,8)}${eye(104,78,8)}<ellipse cx="89" cy="112" rx="12" ry="8" fill="#183349"/><path d="M86 112 Q90 106 96 112" fill="none" stroke="${hi}" stroke-width="2"/>${rare?`<path d="M52 46 Q26 39 21 62 Q44 68 65 56" fill="${c}" stroke="#273147" stroke-width="4"/><path d="M126 48 Q151 40 159 60 Q140 71 116 58" fill="${c}" stroke="#273147" stroke-width="4"/>`:''}${epic?`<path d="M43 71 Q17 68 22 93 Q43 99 58 85 M129 70 Q159 66 157 91 Q139 99 121 85" fill="${b}" stroke="#273147" stroke-width="4"/><circle cx="89" cy="38" r="12" fill="${c}"/>`:''}`;break;
      case'goat':
        body=`<path d="M53 61 Q27 37 42 20 Q64 24 71 53 M118 60 Q147 37 132 18 Q108 23 103 53" fill="none" stroke="${b}" stroke-width="13" stroke-linecap="round"/><ellipse cx="88" cy="93" rx="49" ry="48" fill="${a}" stroke="#273147" stroke-width="5"/><path d="M47 92 Q27 80 23 100 M130 92 Q151 80 156 101" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>${eye(72,78,9)}${eye(106,78,9)}<path d="M71 112 Q88 127 108 111" fill="none" stroke="#273147" stroke-width="6" stroke-linecap="round"/>${rare?`<path d="M63 135 L52 160 M112 135 L124 160" stroke="${b}" stroke-width="9" stroke-linecap="round"/>`:''}${epic?`<path d="M40 54 Q19 33 30 8 M136 52 Q158 31 148 6" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M68 136 Q88 153 110 136" fill="${c}"/>`:''}`;break;
      case'drop':
        body=`<path d="M91 21 Q126 59 132 88 Q139 128 106 148 Q72 166 46 136 Q20 105 40 72 Q57 47 91 21Z" fill="${a}" stroke="#28405a" stroke-width="5" opacity=".96"/><path d="M46 92 Q22 86 20 106 Q35 121 55 109 M130 91 Q153 81 161 102 Q148 121 126 110" fill="${b}" stroke="#28405a" stroke-width="4"/>${eye(72,87,9)}${eye(105,87,9)}<ellipse cx="89" cy="118" rx="14" ry="9" fill="#18334a"/>${rare?`<path d="M67 43 Q87 56 111 40" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`:''}${epic?`<path d="M84 24 L69 6 M96 24 L111 5" stroke="${c}" stroke-width="7" stroke-linecap="round"/><circle cx="38" cy="61" r="8" fill="${c}"/><circle cx="143" cy="64" r="8" fill="${c}"/>`:''}`;break;
      case'jaw':
        body=`<path d="M42 55 Q88 27 137 55 L149 119 Q127 151 88 151 Q50 151 29 118Z" fill="${a}" stroke="#352a30" stroke-width="5"/><path d="M48 108 Q89 90 133 109 L126 136 Q88 151 51 136Z" fill="#201c24" stroke="${c}" stroke-width="5"/><path d="M57 107 L64 124 L73 105 L84 122 L95 103 L106 122 L116 106" fill="${b}"/>${eye(67,76,9)}${eye(110,76,9)}<path d="M45 60 Q40 31 59 24 M132 59 Q140 28 120 22" stroke="${c}" stroke-width="11" stroke-linecap="round"/>${rare?`<path d="M29 89 L10 75 L27 113 M149 88 L168 74 L151 113" fill="${b}"/>`:''}${epic?`<path d="M52 45 L42 12 L72 37 M122 44 L135 12 L106 37" fill="${c}" stroke="#352a30" stroke-width="4"/><path d="M67 138 Q89 162 112 138" fill="${b}"/>`:''}`;break;
      case'moth':
        body=`<path d="M73 73 Q35 26 17 38 Q19 78 63 94 M106 72 Q143 26 163 39 Q158 79 116 95" fill="${b}" stroke="#2b3047" stroke-width="4"/><ellipse cx="89" cy="94" rx="29" ry="49" fill="${a}" stroke="#2b3047" stroke-width="5"/><path d="M81 46 Q69 23 58 18 M98 46 Q112 22 123 18" stroke="${c}" stroke-width="5" stroke-linecap="round"/>${eye(79,66,8)}${eye(101,66,8)}<path d="M75 109 L103 109 M77 121 L101 121 M81 133 L97 133" stroke="${c}" stroke-width="6" stroke-linecap="round"/>${rare?`<circle cx="39" cy="58" r="10" fill="${c}"/><circle cx="139" cy="59" r="10" fill="${c}"/>`:''}${epic?`<path d="M62 89 Q23 102 24 132 Q57 133 78 109 M116 90 Q154 101 154 132 Q122 133 102 110" fill="${c}" stroke="#2b3047" stroke-width="4"/>`:''}`;break;
      case'drumroot':
        body=`<ellipse cx="89" cy="92" rx="42" ry="45" fill="${a}" stroke="#2e333a" stroke-width="5"/><path d="M54 70 Q29 44 34 27 M125 70 Q151 45 145 26" stroke="${b}" stroke-width="12" stroke-linecap="round"/><ellipse cx="35" cy="119" rx="24" ry="15" fill="${c}" stroke="#2e333a" stroke-width="4"/><ellipse cx="145" cy="119" rx="24" ry="15" fill="${c}" stroke="#2e333a" stroke-width="4"/><ellipse cx="35" cy="115" rx="18" ry="9" fill="${hi}" opacity=".7"/><ellipse cx="145" cy="115" rx="18" ry="9" fill="${hi}" opacity=".7"/>${eye(74,77,8)}${eye(103,77,8)}<path d="M76 106 Q89 114 103 106" fill="none" stroke="#263047" stroke-width="5"/>${rare?`<path d="M69 46 Q87 21 108 45" fill="${b}"/>`:''}${epic?`<path d="M61 43 L53 12 L76 38 M118 43 L127 12 L103 38" fill="${c}"/><circle cx="89" cy="131" r="12" fill="${b}"/>`:''}`;break;
      case'spiral':
        body=`<path d="M48 126 Q28 100 43 72 Q59 44 92 47 Q125 51 137 80 Q149 110 126 137 Q95 159 61 144Z" fill="${a}" stroke="#2d3144" stroke-width="5"/><path d="M83 95 Q105 73 121 90 Q134 106 116 121 Q95 137 79 118 Q67 103 83 95Z" fill="none" stroke="${c}" stroke-width="9"/><path d="M45 79 Q18 70 18 53 Q45 49 60 66" fill="${b}" stroke="#2d3144" stroke-width="4"/><path d="M130 76 Q149 52 166 61 Q160 89 135 96" fill="${b}" stroke="#2d3144" stroke-width="4"/>${eye(70,82,8)}${eye(99,78,8)}${rare?`<path d="M54 139 L42 162 M116 143 L125 164" stroke="${c}" stroke-width="8"/>`:''}${epic?`<path d="M42 61 Q24 34 38 20 Q62 34 68 55" fill="${c}"/><path d="M113 53 Q123 25 145 23 Q151 43 130 64" fill="${c}"/>`:''}`;break;
      case'ramreed':
        body=`<ellipse cx="87" cy="98" rx="43" ry="43" fill="${a}" stroke="#28363b" stroke-width="5"/><path d="M60 64 Q34 36 48 22 Q73 34 75 60 M106 60 Q111 30 137 24 Q148 42 120 69" fill="none" stroke="${b}" stroke-width="11" stroke-linecap="round"/><path d="M54 47 Q89 22 126 51" fill="none" stroke="${c}" stroke-width="5"/><path d="M58 46 Q89 72 124 48" fill="none" stroke="${hi}" stroke-width="3"/>${eye(72,88,8)}${eye(103,88,8)}<path d="M74 116 Q87 124 102 115" fill="none" stroke="#273147" stroke-width="5"/>${rare?`<path d="M44 104 L23 121 M130 104 L151 121" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`:''}${epic?`<path d="M54 139 L43 163 M115 139 L128 163" stroke="${b}" stroke-width="10"/><circle cx="89" cy="46" r="11" fill="${c}"/>`:''}`;break;
      case'reef':
        body=`<path d="M38 126 Q31 81 50 54 Q76 23 111 40 Q146 56 145 105 Q143 143 102 153 Q62 159 38 126Z" fill="${a}" stroke="#26394c" stroke-width="5"/><path d="M51 60 L58 29 L72 55 L87 20 L99 56 L116 30 L123 64" fill="${b}" stroke="#26394c" stroke-width="4"/><path d="M45 117 L136 117" stroke="${c}" stroke-width="8" stroke-linecap="round"/>${eye(72,86,8)}${eye(105,85,8)}${rare?`<circle cx="60" cy="48" r="8" fill="${c}"/><circle cx="91" cy="39" r="7" fill="${c}"/><circle cx="120" cy="50" r="8" fill="${c}"/>`:''}${epic?`<path d="M40 93 Q16 77 15 102 Q29 122 48 111 M142 91 Q165 77 167 103 Q153 121 136 111" fill="${c}" stroke="#26394c" stroke-width="4"/>`:''}`;break;
      case'ox':
        body=`<ellipse cx="89" cy="97" rx="48" ry="43" fill="${a}" stroke="#2d3144" stroke-width="5"/><path d="M51 71 Q31 33 46 21 Q68 32 71 61 M108 61 Q112 31 136 21 Q151 38 127 72" fill="${b}" stroke="#2d3144" stroke-width="4"/><path d="M54 54 L71 35 M72 51 L88 27 M91 49 L106 24 M111 54 L128 34" stroke="${c}" stroke-width="7" stroke-linecap="round"/>${eye(72,88,8)}${eye(107,88,8)}<path d="M72 113 Q89 125 107 113" fill="none" stroke="#283047" stroke-width="5"/>${rare?`<path d="M48 119 L27 144 M130 118 L150 143" stroke="${c}" stroke-width="10"/>`:''}${epic?`<path d="M61 133 L54 162 M117 133 L125 162" stroke="${b}" stroke-width="12"/><path d="M38 62 Q15 53 21 35 M141 61 Q166 52 159 34" stroke="${c}" stroke-width="7"/>`:''}`;break;
      case'jelly':
        body=`<path d="M43 92 Q43 43 89 32 Q135 43 136 92 L129 122 Q117 144 89 146 Q60 144 48 122Z" fill="${a}" stroke="#2a3550" stroke-width="5" opacity=".94"/><path d="M51 112 Q63 128 74 112 Q88 132 101 111 Q114 129 128 112" fill="none" stroke="${b}" stroke-width="9" stroke-linecap="round"/>${eye(73,77,8)}${eye(105,77,8)}<path d="M77 99 Q89 108 101 99" fill="none" stroke="#273147" stroke-width="5"/>${rare?`<path d="M58 47 Q88 61 120 46" fill="none" stroke="${c}" stroke-width="7"/>`:''}${epic?`<path d="M55 127 L47 164 M76 134 L72 168 M104 134 L108 168 M124 126 L134 164" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`:''}`;break;
      case'finleaf':
        body=`<path d="M42 108 Q43 60 86 53 Q123 46 142 84 Q155 115 129 140 Q102 159 68 146 Q46 136 42 108Z" fill="${a}" stroke="#28394a" stroke-width="5"/><path d="M72 59 Q67 26 84 18 Q100 31 96 57" fill="${b}" stroke="#28394a" stroke-width="4"/><path d="M55 86 Q28 74 18 92 Q37 115 55 108 M136 88 Q160 72 169 91 Q153 114 134 109" fill="${c}" stroke="#28394a" stroke-width="4"/><path d="M67 67 Q90 93 117 68 M66 77 Q91 104 120 78" fill="none" stroke="${hi}" stroke-width="3"/>${eye(76,102,8)}${eye(107,102,8)}${rare?`<path d="M58 140 L43 162 M121 140 L137 162" stroke="${b}" stroke-width="8"/>`:''}${epic?`<path d="M87 54 Q101 25 121 34 Q117 60 99 70" fill="${c}" stroke="#28394a" stroke-width="4"/>`:''}`;break;
      case'flower':
        body=`<path d="M88 67 Q61 46 68 26 Q88 31 90 54 Q103 29 121 34 Q127 54 105 68 Q131 68 138 87 Q124 103 104 91 Q107 118 89 125 Q71 116 75 91 Q50 103 39 84 Q50 67 72 68Z" fill="${b}" stroke="#34404f" stroke-width="4"/><path d="M76 92 Q87 70 102 91 L115 139 Q90 158 63 138Z" fill="${a}" stroke="#34404f" stroke-width="5"/>${eye(75,78,6,3)}${eye(90,72,6,3)}${eye(104,79,6,3)}<path d="M75 109 Q88 119 101 109" fill="none" stroke="#273147" stroke-width="4"/>${rare?`<path d="M63 132 Q36 120 28 138 Q48 154 69 145 M111 133 Q139 120 148 139 Q128 155 108 145" fill="${c}"/>`:''}${epic?`<circle cx="89" cy="52" r="10" fill="${c}"/><path d="M83 140 L75 168 M99 140 L106 168" stroke="${c}" stroke-width="7"/>`:''}`;break;
      case'lizard':
        body=`<path d="M39 111 Q52 61 88 55 Q127 50 145 84 Q158 111 137 135 Q113 155 77 147 Q49 141 39 111Z" fill="${a}" stroke="#382d30" stroke-width="5"/><path d="M64 69 L76 38 L89 64 L105 31 L116 67 L132 45" fill="${b}" stroke="#382d30" stroke-width="4"/><path d="M62 107 Q88 88 119 107 M67 119 Q89 100 114 118" fill="none" stroke="${c}" stroke-width="5"/>${eye(73,87,8)}${eye(109,83,8)}<path d="M42 119 Q19 127 19 148 Q47 152 65 137" fill="${c}" stroke="#382d30" stroke-width="4"/>${rare?`<path d="M139 102 Q165 92 169 110 Q157 130 137 127" fill="${b}"/>`:''}${epic?`<path d="M55 72 L41 35 L73 62 M120 67 L139 33 L137 80" fill="${c}" stroke="#382d30" stroke-width="4"/>`:''}`;break;
      case'wolf':
        body=`<path d="M50 66 L43 28 L72 53 Q89 42 108 53 L137 27 L130 70 Q150 93 137 124 Q119 151 88 150 Q55 149 39 121 Q26 91 50 66Z" fill="${a}" stroke="#302f3d" stroke-width="5"/><path d="M60 62 Q88 80 120 61" fill="none" stroke="${b}" stroke-width="8"/>${eye(72,86,8)}${eye(108,86,8)}<path d="M74 111 Q89 122 105 110" fill="none" stroke="#252d42" stroke-width="5"/><path d="M132 118 Q156 108 164 129 Q149 148 126 139" fill="${c}"/>${rare?`<path d="M54 137 L43 164 M121 137 L133 163" stroke="${b}" stroke-width="9"/>`:''}${epic?`<path d="M42 56 L23 42 L38 82 M137 55 L157 41 L142 83" fill="${c}" stroke="#302f3d" stroke-width="4"/>`:''}`;break;
      case'coil':
        body=`<circle cx="89" cy="91" r="50" fill="none" stroke="${a}" stroke-width="22"/><circle cx="89" cy="91" r="26" fill="#101827" stroke="${c}" stroke-width="6"/>${eye(79,88,6,3)}${eye(99,88,6,3)}<path d="M80 104 Q89 111 99 104" fill="none" stroke="${hi}" stroke-width="4"/><path d="M89 39 V17 M89 142 V165 M39 91 H17 M139 91 H162" stroke="${b}" stroke-width="8" stroke-linecap="round"/>${rare?`<circle cx="89" cy="91" r="63" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="9 8"/>`:''}${epic?`<path d="M48 49 L25 24 M130 49 L154 24 M48 133 L23 157 M131 133 L155 158" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`:''}`;break;
      case'kite':
        body=`<path d="M89 21 L147 86 L89 148 L30 86Z" fill="${a}" stroke="#2d3148" stroke-width="5"/><path d="M89 21 V148 M30 86 H147" stroke="${b}" stroke-width="5" opacity=".8"/><path d="M30 87 Q9 71 12 54 Q34 58 46 77 M147 87 Q168 70 166 54 Q145 59 134 77" fill="${c}" stroke="#2d3148" stroke-width="4"/>${eye(74,82,8)}${eye(104,82,8)}<path d="M75 106 Q89 116 103 106" fill="none" stroke="#273147" stroke-width="5"/>${rare?`<path d="M89 148 Q72 164 60 159 M89 148 Q106 164 119 159" fill="none" stroke="${b}" stroke-width="7"/>`:''}${epic?`<path d="M45 70 L24 35 L62 59 M132 70 L155 35 L116 59" fill="${b}"/>`:''}`;break;
      case'vineharp':
        body=`<path d="M56 138 Q42 102 56 66 Q70 36 105 42 Q132 47 137 78 Q143 112 121 143Z" fill="${a}" stroke="#2d3a39" stroke-width="5"/><path d="M63 72 Q86 31 120 65 L116 129" fill="none" stroke="${b}" stroke-width="10" stroke-linecap="round"/><path d="M75 67 L76 130 M87 57 L88 132 M99 52 L100 133 M110 57 L111 132" stroke="${hi}" stroke-width="3"/>${eye(70,92,7)}${eye(117,88,7)}<path d="M48 137 L35 165 M126 141 L141 164" stroke="${c}" stroke-width="9" stroke-linecap="round"/>${rare?`<path d="M56 70 Q30 51 25 71 Q41 92 60 88" fill="${c}"/>`:''}${epic?`<path d="M128 72 Q155 51 160 73 Q144 94 125 89" fill="${c}"/><circle cx="91" cy="39" r="10" fill="${c}"/>`:''}`;break;
      case'prism':
        body=`<path d="M89 25 L144 62 L136 129 L90 153 L42 130 L34 63Z" fill="${a}" stroke="#2d344d" stroke-width="5"/><path d="M89 25 L90 153 M34 63 L144 62 M42 130 L136 129" stroke="${b}" stroke-width="4" opacity=".75"/>${eye(71,80,8)}${eye(108,80,8)}<path d="M56 111 L67 95 L78 113 L90 94 L102 113 L113 95 L125 111" fill="${c}"/>${rare?`<path d="M31 82 L8 72 L27 104 M148 82 L171 70 L151 105" fill="${c}"/>`:''}${epic?`<path d="M64 39 L55 9 L81 31 M115 38 L126 8 L101 31" fill="${c}" stroke="#2d344d" stroke-width="4"/>`:''}`;break;
      case'oracle':
        body=`<path d="M69 150 Q52 121 62 84 Q70 52 91 35 Q111 55 119 85 Q128 119 111 150Z" fill="${a}" stroke="#2d3548" stroke-width="5"/><path d="M91 53 Q67 39 51 51 Q56 73 75 76 M92 54 Q113 37 130 50 Q128 71 108 77" fill="${b}" stroke="#2d3548" stroke-width="4"/><circle cx="63" cy="62" r="15" fill="${c}"/>${eye(63,62,6,3)}<circle cx="119" cy="62" r="15" fill="${c}"/>${eye(119,62,6,3)}${eye(80,93,6,3)}${eye(102,93,6,3)}<path d="M82 117 Q91 124 101 117" fill="none" stroke="#253047" stroke-width="4"/>${rare?`<path d="M60 145 L45 167 M119 145 L134 167" stroke="${c}" stroke-width="8"/>`:''}${epic?`<path d="M89 34 L77 7 L92 20 L107 7 L98 35" fill="${c}"/>`:''}`;break;
      case'machine':
        body=`<path d="M49 48 H129 Q145 48 145 65 V126 Q145 143 128 143 H50 Q34 143 34 126 V65 Q34 48 49 48Z" fill="${a}" stroke="#272e3d" stroke-width="6"/><circle cx="89" cy="96" r="30" fill="#121825" stroke="${b}" stroke-width="8"/><path d="M89 66 V42 M119 76 L138 58 M119 116 L140 134 M59 116 L39 136 M59 76 L39 58" stroke="${c}" stroke-width="8" stroke-linecap="round"/>${eye(78,91,6,3)}${eye(100,91,6,3)}<path d="M79 108 Q89 115 100 108" stroke="${hi}" stroke-width="4" fill="none"/>${rare?`<path d="M51 49 L44 23 L65 46 M128 49 L137 22 L114 46" fill="${b}"/>`:''}${epic?`<circle cx="89" cy="96" r="43" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="7 8"/>`:''}`;break;
      case'brassback':
        body=`<path d="M42 122 Q35 79 61 55 Q89 31 121 54 Q149 75 143 115 Q137 148 99 153 Q59 157 42 122Z" fill="${a}" stroke="#372f31" stroke-width="5"/><path d="M53 87 Q85 49 129 76" fill="none" stroke="${b}" stroke-width="12" stroke-linecap="round"/><path d="M58 88 Q89 105 127 76" fill="none" stroke="${hi}" stroke-width="4"/><path d="M44 126 Q20 133 19 153 Q44 157 61 141" fill="${c}"/>${eye(72,93,8)}${eye(109,89,8)}<path d="M77 119 Q91 129 106 117" fill="none" stroke="#283047" stroke-width="5"/>${rare?`<path d="M56 64 L44 28 L73 55 M121 60 L138 29 L137 75" fill="${c}"/>`:''}${epic?`<path d="M43 105 L20 89 L35 129 M143 101 L164 86 L153 128" fill="${b}" stroke="#372f31" stroke-width="4"/>`:''}`;break;
      case'thornchoir':
        body=`<path d="M52 137 Q43 105 60 79 L52 53 Q69 35 86 54 Q101 31 119 53 L116 79 Q137 103 126 137Z" fill="${a}" stroke="#313544" stroke-width="5"/><circle cx="62" cy="66" r="22" fill="${b}" stroke="#313544" stroke-width="4"/><circle cx="89" cy="51" r="23" fill="${b}" stroke="#313544" stroke-width="4"/><circle cx="117" cy="66" r="22" fill="${b}" stroke="#313544" stroke-width="4"/>${eye(62,66,6,3)}${eye(89,51,6,3)}${eye(117,66,6,3)}<path d="M54 36 L47 15 L65 31 M83 27 L90 6 L97 28 M111 36 L126 16 L124 42" stroke="${c}" stroke-width="7" stroke-linecap="round"/>${rare?`<path d="M59 137 L45 164 M119 137 L135 164" stroke="${c}" stroke-width="8"/>`:''}${epic?`<path d="M47 104 Q22 91 17 111 Q35 133 57 123 M132 104 Q157 90 163 111 Q144 133 123 123" fill="${c}"/>`:''}`;break;
      case'pipeglen':
        body=`<path d="M44 123 Q34 83 54 56 Q74 31 103 40 Q135 49 143 87 Q151 124 126 147 Q91 165 59 146Z" fill="${a}" stroke="#343141" stroke-width="5"/><path d="M65 54 V20 M82 48 V10 M100 49 V15 M119 58 V25" stroke="${b}" stroke-width="13" stroke-linecap="round"/><path d="M58 116 Q28 105 25 128 Q42 150 66 139 M129 115 Q155 102 162 124 Q151 148 126 140" fill="${c}" stroke="#343141" stroke-width="4"/>${eye(74,81,8)}${eye(108,81,8)}<ellipse cx="91" cy="110" rx="17" ry="12" fill="#151c2a"/><circle cx="91" cy="110" r="7" fill="${hi}" opacity=".75"/>${rare?`<path d="M45 79 Q21 66 16 83 Q31 104 50 97" fill="${b}"/>`:''}${epic?`<path d="M135 78 Q158 65 165 82 Q151 104 130 98" fill="${b}"/><path d="M55 53 Q88 30 124 57" stroke="${c}" stroke-width="7" fill="none"/>`:''}`;break;
      case'crown':
        body=`<path d="M36 124 Q25 79 51 49 L67 25 L88 47 L109 22 L128 50 Q155 80 144 124 Q132 158 89 158 Q47 158 36 124Z" fill="${a}" stroke="#312e45" stroke-width="6"/><path d="M51 50 L38 18 L66 38 L88 10 L109 39 L141 17 L128 52" fill="${b}" stroke="#312e45" stroke-width="5"/><path d="M50 119 Q89 90 130 119 L121 145 Q89 160 57 145Z" fill="#121827" stroke="${c}" stroke-width="5"/>${eye(70,82,10)}${eye(108,82,10)}<path d="M66 120 L75 136 L85 118 L96 137 L106 118 L116 134" fill="${hi}"/>${rare?`<path d="M34 91 L9 74 L28 116 M145 91 L170 74 L151 117" fill="${c}"/>`:''}${epic?`<circle cx="89" cy="38" r="18" fill="none" stroke="${c}" stroke-width="5"/><path d="M89 15V61M66 38H112" stroke="${c}" stroke-width="4"/>`:''}`;break;
      case'rillkip':
        body=`<ellipse cx="88" cy="92" rx="37" ry="31" fill="${a}" stroke="#29435a" stroke-width="5"/><path d="M58 111 L42 159 M116 111 L136 158" stroke="${b}" stroke-width="10" stroke-linecap="round"/><ellipse cx="39" cy="154" rx="18" ry="8" fill="${c}"/><ellipse cx="139" cy="153" rx="18" ry="8" fill="${c}"/><path d="M61 72 Q39 46 51 29 Q75 37 79 67 M113 70 Q130 43 151 50 Q146 72 119 82" fill="${b}"/>${eye(75,85,8)}${eye(103,85,8)}${rare?`<path d="M49 110 Q24 104 18 122 Q36 139 56 127" fill="${c}"/>`:''}${epic?`<path d="M119 111 Q151 100 160 120 Q143 143 117 130" fill="${c}"/><circle cx="89" cy="49" r="12" fill="${c}"/>`:''}`;break;
      case'chimeskiff':
        body=`<path d="M89 31 L145 105 L89 145 L34 105Z" fill="${a}" stroke="#2b344b" stroke-width="5"/><path d="M89 31 V145 M34 105 H145" stroke="${b}" stroke-width="4"/><path d="M49 102 L49 139 M70 108 L70 151 M109 108 L109 151 M130 102 L130 139" stroke="${c}" stroke-width="5"/><circle cx="49" cy="145" r="8" fill="${c}"/><circle cx="70" cy="156" r="8" fill="${c}"/><circle cx="109" cy="156" r="8" fill="${c}"/><circle cx="130" cy="145" r="8" fill="${c}"/>${eye(74,91,7)}${eye(104,91,7)}${rare?`<path d="M34 101 L12 74 L48 87 M145 101 L168 73 L132 88" fill="${b}"/>`:''}${epic?`<path d="M89 32 L72 7 L89 15 L106 7Z" fill="${c}"/><circle cx="89" cy="116" r="16" fill="none" stroke="${c}" stroke-width="5"/>`:''}`;break;
      case'candlewisp':
        body=`<path d="M58 143 Q47 106 57 70 Q63 48 88 46 Q115 48 122 70 Q133 106 119 143Z" fill="${a}" stroke="#403039" stroke-width="5"/><path d="M88 49 Q66 30 78 10 Q89 22 94 7 Q111 28 98 50Z" fill="${c}" stroke="#56312d" stroke-width="4"/>${eye(74,82,8)}${eye(103,82,8)}<path d="M70 114 Q89 99 108 114" fill="none" stroke="${b}" stroke-width="6"/><path d="M67 127 Q89 114 111 127" fill="none" stroke="${b}" stroke-width="4"/>${rare?`<path d="M57 91 Q31 79 28 100 Q44 116 62 108" fill="${b}"/>`:''}${epic?`<path d="M121 91 Q148 77 154 99 Q138 119 116 109" fill="${b}"/><path d="M79 47 Q61 24 68 8 M100 46 Q116 23 109 7" stroke="${c}" stroke-width="6"/>`:''}`;break;
      case'hydrobolt':
        body=`<rect x="45" y="52" width="88" height="88" rx="31" fill="${a}" stroke="#28384b" stroke-width="6"/><circle cx="89" cy="96" r="25" fill="#132033" stroke="${b}" stroke-width="7"/>${eye(79,91,6,3)}${eye(100,91,6,3)}<path d="M45 78 H19 M133 78 H160 M45 116 H13 M133 116 H167" stroke="${c}" stroke-width="10" stroke-linecap="round"/><circle cx="18" cy="78" r="10" fill="${b}"/><circle cx="161" cy="78" r="10" fill="${b}"/>${rare?`<path d="M61 52 L52 24 L75 49 M117 52 L128 23 L105 49" fill="${c}"/>`:''}${epic?`<path d="M89 52 V18 M89 140 V168" stroke="${c}" stroke-width="9"/><circle cx="89" cy="18" r="9" fill="${b}"/>`:''}`;break;
      case'bramblepick':
        body=`<path d="M47 133 Q33 95 48 64 Q64 35 99 42 Q135 48 142 82 Q148 116 124 143Z" fill="${a}" stroke="#2c3a34" stroke-width="5"/><path d="M58 59 L48 24 L72 49 M86 45 L89 13 L102 45 M119 55 L139 27 L132 68" stroke="${b}" stroke-width="8" stroke-linecap="round"/><path d="M61 112 Q91 83 126 109 M64 124 Q93 94 124 120" fill="none" stroke="${c}" stroke-width="4"/>${eye(73,80,8)}${eye(109,78,8)}<path d="M36 112 L18 129 L39 133" fill="${c}"/>${rare?`<path d="M44 87 Q17 74 13 96 Q29 113 49 104" fill="${b}"/>`:''}${epic?`<path d="M139 87 Q165 74 169 96 Q153 113 134 104" fill="${b}"/><path d="M71 131 L62 163 M111 132 L120 163" stroke="${c}" stroke-width="8"/>`:''}`;break;
      case'cairncap':
        body=`<ellipse cx="89" cy="108" rx="42" ry="35" fill="${a}" stroke="#34343d" stroke-width="5"/><path d="M50 81 L62 57 L118 57 L131 82Z" fill="${b}" stroke="#34343d" stroke-width="5"/><path d="M60 57 L71 37 H108 L118 57 M73 37 L80 21 H100 L108 37" fill="${c}" stroke="#34343d" stroke-width="4"/>${eye(73,101,8)}${eye(106,101,8)}<path d="M50 118 Q26 112 20 132 Q38 150 59 134 M129 118 Q154 112 160 132 Q142 150 121 134" fill="${b}"/>${rare?`<circle cx="89" cy="21" r="9" fill="${a}"/>`:''}${epic?`<path d="M49 81 L34 52 L63 71 M131 82 L147 52 L117 71" fill="${c}"/>`:''}`;break;

      case'canopulse':
        body=`<path d="M42 119 Q36 74 62 55 Q89 36 119 55 Q145 74 137 119Z" fill="${a}" stroke="#29403c" stroke-width="5"/><path d="M48 65 Q89 20 131 65" fill="${b}" stroke="#29403c" stroke-width="6"/><path d="M54 79 H126 M50 92 H130 M48 105 H132" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M57 119 L48 163 M78 119 L74 166 M105 119 L108 166 M126 119 L136 163" stroke="${b}" stroke-width="9"/>${eye(74,72,7)}${eye(106,72,7)}${rare?`<path d="M41 94 Q16 84 13 104 Q30 122 48 113 M138 94 Q163 83 168 103 Q151 123 132 113" fill="${c}"/>`:''}${epic?`<path d="M69 50 Q89 21 110 50" fill="none" stroke="${c}" stroke-width="10"/><circle cx="89" cy="31" r="10" fill="${c}"/>`:''}`;break;
      case'reefgale':
        body=`<path d="M18 92 Q54 43 89 57 Q124 42 162 92 Q132 136 89 129 Q46 137 18 92Z" fill="${a}" stroke="#28384a" stroke-width="5"/><path d="M28 91 L65 77 L89 57 L113 77 L152 92 L112 102 L89 129 L65 102Z" fill="${b}" opacity=".78"/><path d="M52 102 L41 145 M73 111 L68 158 M106 111 L111 158 M127 102 L139 145" stroke="${c}" stroke-width="5"/><circle cx="41" cy="149" r="7" fill="${c}"/><circle cx="68" cy="161" r="7" fill="${c}"/><circle cx="111" cy="161" r="7" fill="${c}"/><circle cx="139" cy="149" r="7" fill="${c}"/>${eye(75,88,7)}${eye(104,88,7)}${rare?`<path d="M17 91 L7 58 L39 80 M163 91 L173 58 L141 80" fill="${c}"/>`:''}${epic?`<circle cx="89" cy="57" r="17" fill="none" stroke="${c}" stroke-width="5"/><path d="M89 38V76M70 57H108" stroke="${c}" stroke-width="3"/>`:''}`;break;
      case'duskhush':
        body=`<path d="M89 28 Q111 54 120 76 Q138 117 115 146 H63 Q40 117 58 76 Q67 54 89 28Z" fill="${a}" stroke="#3a3147" stroke-width="5"/><path d="M56 78 Q27 64 21 88 Q43 108 63 99 M122 78 Q151 62 159 88 Q137 109 116 99" fill="${b}"/><path d="M61 113 Q89 90 117 113" fill="none" stroke="${c}" stroke-width="7"/><circle cx="68" cy="77" r="12" fill="${c}" opacity=".45"/><circle cx="110" cy="77" r="12" fill="${c}" opacity=".45"/>${eye(68,77,6,3)}${eye(110,77,6,3)}${rare?`<path d="M74 45 L62 16 L84 38 M104 45 L117 16 L94 38" fill="${b}"/>`:''}${epic?`<path d="M89 29 L89 5 M49 120 L28 145 M129 120 L151 145" stroke="${c}" stroke-width="7"/><circle cx="89" cy="7" r="8" fill="${c}"/>`:''}`;break;
      case'steamclank':
        body=`<rect x="42" y="57" width="96" height="84" rx="22" fill="${a}" stroke="#2b313a" stroke-width="6"/><circle cx="89" cy="100" r="29" fill="#17202a" stroke="${b}" stroke-width="8"/><path d="M59 57 V31 H76 V57 M104 57 V20 H121 V57" fill="${c}" stroke="#2b313a" stroke-width="4"/><path d="M42 83 H18 M138 83 H161 M42 118 H12 M138 118 H168" stroke="${b}" stroke-width="9"/><circle cx="20" cy="83" r="9" fill="${c}"/><circle cx="160" cy="83" r="9" fill="${c}"/>${eye(78,95,6,3)}${eye(100,95,6,3)}${rare?`<path d="M57 140 L47 166 M122 140 L133 166" stroke="${c}" stroke-width="8"/>`:''}${epic?`<circle cx="89" cy="100" r="43" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="8 6"/><path d="M63 31 L52 7 M113 20 L127 4" stroke="${c}" stroke-width="6"/>`:''}`;break;
      case'brambleamp':
        body=`<ellipse cx="89" cy="104" rx="47" ry="40" fill="${a}" stroke="#352f34" stroke-width="5"/><path d="M59 70 L49 31 L73 60 M105 61 L132 28 L120 74" stroke="${b}" stroke-width="10" stroke-linecap="round"/><path d="M52 110 Q86 77 130 104 M54 122 Q89 88 129 116" fill="none" stroke="${c}" stroke-width="6"/><path d="M48 134 L37 165 M128 136 L142 165" stroke="${b}" stroke-width="10"/>${eye(73,93,8)}${eye(108,92,8)}${rare?`<path d="M38 102 L14 83 L28 120 M140 101 L166 82 L150 120" fill="${c}"/>`:''}${epic?`<path d="M59 69 Q90 42 121 68" fill="none" stroke="${c}" stroke-width="8"/><circle cx="89" cy="53" r="9" fill="${c}"/>`:''}`;break;
      case'highlandra':
        body=`<path d="M43 142 Q29 101 44 69 Q58 40 89 42 Q123 41 138 70 Q151 106 135 143Z" fill="${a}" stroke="#303640" stroke-width="5"/><path d="M55 68 V25 M73 59 V12 M91 57 V8 M109 60 V15 M127 69 V29" stroke="${b}" stroke-width="11" stroke-linecap="round"/><path d="M36 102 Q15 91 12 111 Q26 128 45 121 M143 102 Q164 89 169 110 Q154 130 135 121" fill="${c}"/>${eye(73,82,8)}${eye(106,82,8)}<path d="M73 118 Q89 127 106 118" fill="none" stroke="#273147" stroke-width="5"/>${rare?`<path d="M51 142 L40 166 M127 142 L139 166" stroke="${c}" stroke-width="8"/>`:''}${epic?`<path d="M42 75 Q23 49 35 33 M137 75 Q156 48 145 31" stroke="${c}" stroke-width="7"/>`:''}`;break;

      case'rivetwisp':
        body=`<circle cx="89" cy="94" r="35" fill="${a}" stroke="#28384a" stroke-width="6"/><path d="M89 59 L89 22 M54 94 L19 94 M124 94 L160 94 M89 129 L89 164" stroke="${b}" stroke-width="7" stroke-linecap="round"/><circle cx="89" cy="21" r="10" fill="${c}"/><circle cx="18" cy="94" r="10" fill="${c}"/><circle cx="161" cy="94" r="10" fill="${c}"/><circle cx="89" cy="165" r="10" fill="${c}"/>${eye(78,91,6,3)}${eye(100,91,6,3)}${rare?`<circle cx="89" cy="94" r="49" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="5 7"/>`:''}${epic?`<path d="M49 54 L27 32 M129 54 L151 32 M49 134 L27 156 M129 134 L151 156" stroke="${c}" stroke-width="7"/>`:''}`;break;
      case'briarcoil':
        body=`<path d="M89 38 Q139 45 141 94 Q143 143 90 147 Q39 146 38 96 Q37 50 89 38Z" fill="none" stroke="${a}" stroke-width="20"/><path d="M56 67 Q90 93 122 65 M56 122 Q90 95 123 123" fill="none" stroke="${b}" stroke-width="9"/><path d="M51 62 L36 37 M127 62 L144 36 M50 128 L32 150 M129 128 L148 150" stroke="${c}" stroke-width="7"/>${eye(77,92,7)}${eye(102,92,7)}${rare?`<path d="M89 39 L89 10" stroke="${c}" stroke-width="8"/><circle cx="89" cy="9" r="8" fill="${c}"/>`:''}${epic?`<circle cx="89" cy="94" r="61" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="10 7"/>`:''}`;break;
      case'drumflare':
        body=`<path d="M55 128 Q40 95 54 63 Q68 36 90 37 Q115 37 128 64 Q143 96 125 129Z" fill="${a}" stroke="#393139" stroke-width="5"/><ellipse cx="38" cy="121" rx="25" ry="15" fill="${b}" stroke="#393139" stroke-width="4"/><ellipse cx="142" cy="121" rx="25" ry="15" fill="${b}" stroke="#393139" stroke-width="4"/><path d="M67 51 Q89 17 111 52" fill="${c}" stroke="#59362d" stroke-width="4"/>${eye(74,79,8)}${eye(106,79,8)}<path d="M89 129 L89 166" stroke="${b}" stroke-width="11"/>${rare?`<path d="M57 64 L42 33 L71 53 M123 63 L139 32 L108 53" fill="${c}"/>`:''}${epic?`<path d="M69 52 Q89 7 111 51" fill="none" stroke="${c}" stroke-width="9"/><circle cx="89" cy="22" r="9" fill="${c}"/>`:''}`;break;
      case'phasekiln':
        body=`<path d="M48 139 Q31 96 49 59 Q65 27 91 31 Q122 33 137 67 Q151 103 129 140Z" fill="${a}" stroke="#302f3c" stroke-width="6"/><circle cx="90" cy="96" r="33" fill="#101722" stroke="${b}" stroke-width="8"/><path d="M90 31 V9 M58 53 L39 30 M122 55 L143 31 M47 111 L18 118 M136 111 L165 118" stroke="${c}" stroke-width="8"/><path d="M70 96 H110" stroke="${c}" stroke-width="5"/>${eye(78,85,6,3)}${eye(101,85,6,3)}${rare?`<circle cx="90" cy="96" r="48" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="7 6"/>`:''}${epic?`<path d="M58 140 L46 168 M122 140 L135 168" stroke="${c}" stroke-width="8"/><circle cx="90" cy="9" r="8" fill="${b}"/>`:''}`;break;
      case'thornmotor':
        body=`<rect x="43" y="58" width="94" height="82" rx="28" fill="${a}" stroke="#30363a" stroke-width="6"/><path d="M55 58 L43 29 L70 52 M90 58 L90 20 M125 58 L143 31 L113 53" stroke="${b}" stroke-width="8"/><circle cx="89" cy="102" r="27" fill="#131b25" stroke="${c}" stroke-width="7"/><path d="M42 89 H15 M137 89 H165" stroke="${c}" stroke-width="8"/><path d="M58 140 L48 166 M120 140 L131 166" stroke="${b}" stroke-width="9"/>${eye(78,96,6,3)}${eye(100,96,6,3)}${rare?`<path d="M53 73 Q28 59 19 79 Q34 100 53 93 M126 73 Q151 58 161 79 Q145 101 126 93" fill="${b}"/>`:''}${epic?`<circle cx="89" cy="102" r="42" fill="none" stroke="${b}" stroke-width="4" stroke-dasharray="6 7"/>`:''}`;break;
      case'pentaflux':
        body=`<circle cx="89" cy="94" r="38" fill="${a}" stroke="#273246" stroke-width="6"/><circle cx="89" cy="94" r="18" fill="#0d1522" stroke="${c}" stroke-width="5"/>${eye(82,91,5,2)}${eye(97,91,5,2)}<g fill="${b}" stroke="#273246" stroke-width="4"><circle cx="89" cy="25" r="18"/><circle cx="154" cy="73" r="18"/><circle cx="129" cy="151" r="18"/><circle cx="49" cy="151" r="18"/><circle cx="24" cy="73" r="18"/></g><path d="M89 43V56M137 78L124 83M119 136L110 123M59 136L68 123M41 78L54 83" stroke="${c}" stroke-width="7"/>${rare?`<circle cx="89" cy="94" r="57" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="11 7"/>`:''}${epic?`<circle cx="89" cy="94" r="72" fill="none" stroke="${b}" stroke-width="5" stroke-dasharray="3 9"/><path d="M89 8V0 M172 73H180 M142 164L149 177 M36 164L29 177 M7 73H0" stroke="${c}" stroke-width="6"/>`:''}`;break;

      case'lanternling':
        body=`<path d="M58 48 Q89 23 121 48 L135 111 Q119 146 89 151 Q58 146 44 111Z" fill="${a}" stroke="#343245" stroke-width="5"/><path d="M62 48 Q63 19 89 14 Q115 19 117 48" fill="none" stroke="${b}" stroke-width="9"/><path d="M54 76 H125 M50 111 H130" stroke="${c}" stroke-width="5" opacity=".8"/>${eye(75,87,8)}${eye(104,87,8)}<path d="M76 119 Q89 129 104 118" fill="none" stroke="#342b42" stroke-width="5"/><path d="M64 145 L51 165 M114 145 L128 165" stroke="${b}" stroke-width="8" stroke-linecap="round"/>${rare?`<path d="M49 64 L24 52 L42 83 M130 64 L155 52 L137 83" fill="${c}" stroke="#343245" stroke-width="3"/>`:''}${epic?`<circle cx="89" cy="91" r="58" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="5 8"/>`:''}`;break;
      case'ribbonram':
        body=`<path d="M57 70 Q41 45 57 31 Q78 39 88 63 Q101 36 123 32 Q139 47 121 72" fill="none" stroke="${b}" stroke-width="14" stroke-linecap="round"/><path d="M48 82 Q89 49 132 82 Q127 137 90 151 Q51 139 48 82Z" fill="${a}" stroke="#3b3045" stroke-width="5"/><path d="M45 98 Q18 89 20 115 Q38 131 56 115 M133 98 Q160 89 159 115 Q141 131 123 115" fill="none" stroke="${c}" stroke-width="10"/>${eye(75,84,8)}${eye(104,84,8)}<path d="M70 118 Q89 132 109 117" fill="none" stroke="#3b3045" stroke-width="5"/>${rare?`<path d="M62 142 Q44 163 31 151 M116 142 Q135 163 148 151" stroke="${b}" stroke-width="7" fill="none"/>`:''}${epic?`<path d="M88 62 Q88 29 72 14 M91 62 Q96 26 111 12" stroke="${c}" stroke-width="6"/>`:''}`;break;
      case'paradepod':
        body=`<ellipse cx="89" cy="96" rx="47" ry="42" fill="${a}" stroke="#2d3447" stroke-width="5"/><ellipse cx="89" cy="103" rx="38" ry="24" fill="${b}" stroke="#2d3447" stroke-width="5"/><path d="M55 88 H123 M56 102 H122 M58 116 H120" stroke="${c}" stroke-width="4"/><path d="M62 57 Q50 27 37 22 M116 57 Q129 27 142 22" stroke="${c}" stroke-width="6" stroke-linecap="round"/>${eye(75,75,7)}${eye(103,75,7)}<g stroke="${b}" stroke-width="7" stroke-linecap="round"><path d="M49 117 L27 141"/><path d="M58 128 L44 158"/><path d="M129 117 L151 141"/><path d="M120 128 L134 158"/></g>${rare?`<circle cx="37" cy="21" r="8" fill="${b}"/><circle cx="142" cy="21" r="8" fill="${b}"/>`:''}${epic?`<path d="M42 87 L12 73 L20 104 M136 87 L166 73 L158 104" fill="${c}"/>`:''}`;break;
      case'carolfin':
        body=`<path d="M37 98 Q57 57 103 60 Q139 62 151 92 Q137 129 99 139 Q54 145 37 98Z" fill="${a}" stroke="#2b3a49" stroke-width="5"/><path d="M42 92 Q17 68 13 98 Q23 126 50 112 M137 74 Q151 45 163 59 Q170 84 145 99" fill="${b}" stroke="#2b3a49" stroke-width="4"/>${eye(73,84,8)}${eye(101,82,8)}<path d="M73 112 Q89 121 106 109" fill="none" stroke="#263444" stroke-width="5"/><g fill="${c}" stroke="#2b3a49" stroke-width="3"><rect x="65" y="35" width="10" height="35" rx="5"/><rect x="82" y="24" width="11" height="43" rx="5"/><rect x="100" y="31" width="10" height="38" rx="5"/></g>${rare?`<path d="M74 139 L61 164 M111 136 L127 160" stroke="${b}" stroke-width="7"/>`:''}${epic?`<path d="M56 63 Q39 37 49 21 M121 66 Q139 37 130 20" stroke="${c}" stroke-width="7"/>`:''}`;break;
      case'gourdgeist':
        body=`<path d="M45 128 Q25 99 42 67 Q59 37 89 42 Q121 36 140 67 Q157 98 135 130 Q113 153 89 143 Q63 154 45 128Z" fill="${a}" stroke="#45333a" stroke-width="5"/><path d="M89 42 V18 Q101 8 112 18" stroke="${b}" stroke-width="10" stroke-linecap="round"/><path d="M58 83 L75 72 L82 88 M121 83 L104 72 L97 88" fill="${c}"/><path d="M61 112 Q89 132 118 111 L111 132 Q89 143 67 132Z" fill="#17151d"/><path d="M72 117 V132 M89 121 V138 M106 117 V132" stroke="${c}" stroke-width="4"/>${rare?`<path d="M43 75 L20 58 L34 91 M138 75 L161 57 L147 92" fill="${b}"/>`:''}${epic?`<path d="M63 47 L48 17 L76 40 M116 47 L132 17 L102 40" fill="${c}"/>`:''}`;break;
      case'yulebell':
        body=`<path d="M50 65 Q89 37 128 65 L142 127 Q116 151 89 147 Q61 151 36 127Z" fill="${a}" stroke="#33404a" stroke-width="5"/><path d="M55 64 Q39 30 24 39 Q27 63 55 77 M123 64 Q140 30 155 39 Q152 63 124 78" fill="none" stroke="${b}" stroke-width="10"/><circle cx="89" cy="120" r="26" fill="${c}" stroke="#33404a" stroke-width="5"/>${eye(73,85,8)}${eye(106,85,8)}${rare?`<circle cx="44" cy="45" r="9" fill="${c}"/><circle cx="136" cy="45" r="9" fill="${c}"/>`:''}${epic?`<path d="M65 60 L55 20 L79 53 M113 60 L126 20 L99 53" fill="${c}"/>`:''}`;break;
      case'harvesthorn':
        body=`<path d="M46 135 Q34 99 48 70 Q62 42 91 46 Q123 49 137 79 Q150 112 128 141Z" fill="${a}" stroke="#3b342f" stroke-width="5"/><path d="M56 75 Q26 51 19 72 Q37 96 59 91" fill="${b}"/><path d="M123 71 Q151 49 162 69 Q149 94 125 91" fill="${b}"/><path d="M65 106 Q90 79 117 106 M68 118 Q91 91 115 117" stroke="${c}" stroke-width="5" fill="none"/>${eye(72,84,8)}${eye(107,84,8)}${rare?`<path d="M56 55 L46 25 L71 49" fill="${c}"/>`:''}${epic?`<path d="M121 55 L137 25 L106 48" fill="${c}"/><path d="M54 136 L42 164 M126 138 L140 164" stroke="${c}" stroke-width="8"/>`:''}`;break;
      case'midnightpop':
        body=`<circle cx="89" cy="96" r="45" fill="${a}" stroke="#2e3448" stroke-width="6"/><circle cx="89" cy="96" r="33" fill="#101827" stroke="${b}" stroke-width="5"/><path d="M89 96 L89 69 M89 96 L108 108" stroke="${c}" stroke-width="6" stroke-linecap="round"/>${eye(73,88,7)}${eye(106,88,7)}<path d="M89 51 V21" stroke="${c}" stroke-width="6"/><path d="M89 20 L77 6 M89 20 L101 6 M89 20 V1" stroke="${c}" stroke-width="4"/>${rare?`<path d="M46 64 L23 44 M132 64 L155 44" stroke="${b}" stroke-width="7"/>`:''}${epic?`<circle cx="89" cy="96" r="59" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="4 8"/>`:''}`;break;
      case'heartstring':
        body=`<path d="M89 148 Q24 104 39 62 Q51 31 89 57 Q127 31 140 62 Q154 105 89 148Z" fill="${a}" stroke="#463346" stroke-width="5"/><path d="M63 73 Q89 50 116 73 L107 126 Q89 139 71 126Z" fill="none" stroke="${b}" stroke-width="7"/><path d="M76 72 V126 M89 62 V134 M102 72 V126" stroke="${c}" stroke-width="3"/>${eye(71,86,7)}${eye(108,86,7)}${rare?`<path d="M40 75 L18 58 L31 93 M138 75 L161 58 L147 93" fill="${c}"/>`:''}${epic?`<circle cx="89" cy="49" r="11" fill="${c}"/>`:''}`;break;
      case'cloverclack':
        body=`<circle cx="89" cy="93" r="33" fill="${a}" stroke="#294239" stroke-width="5"/><g fill="${b}" stroke="#294239" stroke-width="4"><circle cx="62" cy="55" r="23"/><circle cx="116" cy="55" r="23"/><circle cx="58" cy="112" r="23"/><circle cx="120" cy="112" r="23"/></g>${eye(77,90,7)}${eye(101,90,7)}<path d="M66 135 L56 163 M112 135 L123 163" stroke="${c}" stroke-width="9"/><ellipse cx="54" cy="166" rx="16" ry="6" fill="${c}"/><ellipse cx="126" cy="166" rx="16" ry="6" fill="${c}"/>${rare?`<circle cx="89" cy="28" r="10" fill="${c}"/>`:''}${epic?`<path d="M44 87 L18 78 M134 87 L161 78" stroke="${c}" stroke-width="7"/>`:''}`;break;
      case'eggleap':
        body=`<ellipse cx="89" cy="98" rx="44" ry="52" fill="${a}" stroke="#394052" stroke-width="5"/><path d="M56 79 Q89 63 122 79 M53 100 Q89 82 125 100 M59 121 Q89 107 119 121" fill="none" stroke="${b}" stroke-width="6"/>${eye(73,87,8)}${eye(106,87,8)}<path d="M63 145 L49 169 M115 145 L130 169" stroke="${c}" stroke-width="10"/><path d="M46 168 H63 M126 168 H143" stroke="${c}" stroke-width="7"/>${rare?`<path d="M50 61 L30 42 L61 50 M128 61 L149 42 L117 51" fill="${c}"/>`:''}${epic?`<path d="M89 46 L89 17" stroke="${c}" stroke-width="8"/><circle cx="89" cy="16" r="8" fill="${c}"/>`:''}`;break;
      case'sunburst':
        body=`<circle cx="89" cy="96" r="43" fill="${a}" stroke="#3d3a34" stroke-width="5"/><path d="M89 43 L89 13 M127 57 L149 34 M141 96 H171 M127 134 L149 157 M89 149 V178 M51 134 L29 157 M37 96 H7 M51 57 L29 34" stroke="${b}" stroke-width="9" stroke-linecap="round"/><circle cx="89" cy="105" r="24" fill="${c}" opacity=".55"/>${eye(75,88,7)}${eye(103,88,7)}${rare?`<circle cx="89" cy="96" r="55" fill="none" stroke="${c}" stroke-width="4"/>`:''}${epic?`<path d="M65 118 Q89 103 113 118" stroke="#fff" stroke-width="4" fill="none"/>`:''}`;break;
      case'petalbop':
        body=`<circle cx="89" cy="92" r="28" fill="${a}" stroke="#34403a" stroke-width="5"/><g fill="${b}" stroke="#34403a" stroke-width="4"><ellipse cx="89" cy="48" rx="20" ry="31"/><ellipse cx="130" cy="79" rx="31" ry="20"/><ellipse cx="115" cy="126" rx="23" ry="30"/><ellipse cx="63" cy="126" rx="23" ry="30"/><ellipse cx="48" cy="79" rx="31" ry="20"/></g>${eye(78,90,6,3)}${eye(100,90,6,3)}<path d="M49 109 L21 137 M129 109 L158 137" stroke="${c}" stroke-width="7"/>${rare?`<circle cx="89" cy="92" r="12" fill="${c}"/>`:''}${epic?`<path d="M89 20 V2 M160 79 H178 M139 145 L151 162 M39 145 L27 162 M17 79 H1" stroke="${c}" stroke-width="5"/>`:''}`;break;
      case'fiestafly':
        body=`<ellipse cx="89" cy="96" rx="28" ry="43" fill="${a}" stroke="#30374a" stroke-width="5"/><path d="M66 79 Q26 35 15 56 Q30 94 64 103 M112 79 Q151 34 164 56 Q149 94 114 103" fill="${b}" stroke="#30374a" stroke-width="4"/>${eye(78,80,7)}${eye(100,80,7)}<path d="M89 103 Q89 127 121 125 Q150 124 151 105" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>${rare?`<path d="M82 54 Q68 27 59 20 M96 54 Q111 27 120 20" stroke="${c}" stroke-width="5"/>`:''}${epic?`<circle cx="33" cy="65" r="9" fill="${c}"/><circle cx="146" cy="65" r="9" fill="${c}"/>`:''}`;break;
      case'starspangle':
        body=`<path d="M89 29 L104 66 L145 66 L113 91 L126 133 L89 108 L52 133 L65 91 L33 66 L74 66Z" fill="${a}" stroke="#30384a" stroke-width="5"/>${eye(75,80,7)}${eye(103,80,7)}<ellipse cx="50" cy="123" rx="23" ry="13" fill="${b}" stroke="#30384a" stroke-width="4"/><ellipse cx="129" cy="123" rx="23" ry="13" fill="${b}" stroke="#30384a" stroke-width="4"/><path d="M89 108 V158" stroke="${c}" stroke-width="7"/>${rare?`<path d="M43 118 L21 99 M136 118 L158 99" stroke="${c}" stroke-width="6"/>`:''}${epic?`<circle cx="89" cy="78" r="52" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="3 8"/>`:''}`;break;
      case'leafturn':
        body=`<path d="M89 31 L104 61 L137 52 L121 82 L150 101 L116 106 L113 141 L89 116 L65 141 L62 106 L28 101 L57 82 L41 52 L74 61Z" fill="${a}" stroke="#3d3630" stroke-width="5"/>${eye(75,87,7)}${eye(103,87,7)}<path d="M58 110 Q89 83 121 109 M62 121 Q89 95 117 120" fill="none" stroke="${b}" stroke-width="5"/>${rare?`<path d="M89 32 V10" stroke="${c}" stroke-width="7"/>`:''}${epic?`<path d="M39 105 L14 125 M139 105 L165 125" stroke="${c}" stroke-width="7"/>`:''}`;break;
      case'birthdaycake':
        body=`<rect x="48" y="91" width="82" height="55" rx="12" fill="${a}" stroke="#493540" stroke-width="5"/><rect x="58" y="60" width="62" height="38" rx="11" fill="${b}" stroke="#493540" stroke-width="4"/><rect x="72" y="36" width="35" height="29" rx="9" fill="${c}" stroke="#493540" stroke-width="4"/><path d="M78 36 V16 M89 36 V10 M101 36 V17" stroke="${b}" stroke-width="5"/><path d="M78 15 Q73 7 79 3 Q86 8 78 15 M89 9 Q84 1 90 0 Q97 5 89 9 M101 16 Q96 8 102 4 Q109 9 101 16" fill="#fff1a8"/>${eye(74,113,7)}${eye(104,113,7)}<path d="M70 132 Q89 142 108 132" fill="none" stroke="#3a2840" stroke-width="5"/>${rare?`<path d="M48 105 L25 91 M130 105 L153 91" stroke="${c}" stroke-width="7"/>`:''}${epic?`<circle cx="89" cy="30" r="18" fill="none" stroke="${c}" stroke-width="4"/>`:''}`;break;
      case'snowmelt':
        body=`<path d="M89 35 Q126 72 132 103 Q139 139 103 151 Q68 163 46 134 Q25 106 45 78 Q62 55 89 35Z" fill="${a}" stroke="#2c4052" stroke-width="5"/><path d="M55 60 L62 24 L75 52 M88 40 L91 10 L103 45 M113 58 L132 27 L124 69" fill="${b}" stroke="#2c4052" stroke-width="4"/>${eye(73,94,8)}${eye(106,94,8)}<path d="M59 128 Q89 111 120 128" fill="none" stroke="${c}" stroke-width="6"/>${rare?`<circle cx="41" cy="116" r="9" fill="${c}"/><circle cx="138" cy="115" r="9" fill="${c}"/>`:''}${epic?`<path d="M51 142 Q31 157 18 147 M127 142 Q147 157 162 146" stroke="${c}" stroke-width="7"/>`:''}`;break;
      default:
        body=`<ellipse cx="89" cy="96" rx="48" ry="45" fill="${a}" stroke="#273147" stroke-width="5"/>${eye(72,84)}${eye(106,84)}<path d="M73 115 Q89 127 106 114" fill="none" stroke="#273147" stroke-width="5"/>`;
    }
    const key=(m.id+'-'+form).replace(/[^a-z0-9-]/gi,'').toLowerCase(),ga='ga-'+key,gb='gb-'+key,gc='gc-'+key;
    body=body.split(`fill="${a}"`).join(`fill="url(#${ga})"`).split(`fill="${b}"`).join(`fill="url(#${gb})"`).split(`fill="${c}"`).join(`fill="url(#${gc})"`);
    const detail=speciesDetail(m,a,b,c),anatomy=variantAnatomy(m,form,a,b,c),aura=form==='Epic'?`<ellipse cx="90" cy="94" rx="76" ry="69" fill="${c}" opacity=".08" class="epic-aura"/>`:form==='Rare'?`<ellipse cx="90" cy="99" rx="67" ry="59" fill="${b}" opacity=".055"/>`:'';
    return `<svg class="monster-art shape-${m.shape} form-${form.toLowerCase()}" viewBox="0 0 180 180" aria-label="${m.name} ${form}" role="img"><defs><linearGradient id="${ga}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(a,'#ffffff',.22)}"/><stop offset=".48" stop-color="${a}"/><stop offset="1" stop-color="${mix(a,'#000000',.24)}"/></linearGradient><linearGradient id="${gb}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(b,'#ffffff',.18)}"/><stop offset="1" stop-color="${mix(b,'#000000',.18)}"/></linearGradient><radialGradient id="${gc}"><stop offset="0" stop-color="${mix(c,'#ffffff',.28)}"/><stop offset="1" stop-color="${c}"/></radialGradient><filter id="soft"><feGaussianBlur stdDeviation="2"/></filter></defs><ellipse cx="90" cy="155" rx="52" ry="10" fill="#02060c" opacity=".28"/>${aura}${body}${detail}${anatomy}${performanceFX(m,form==='Epic'?c:b)}</svg>`;
  }

  function landscapeSVG(k){
    const w=WORLDS[k];
    const common=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w.colors[1]}"/><stop offset="1" stop-color="${w.colors[2]}"/></linearGradient><radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="1000" height="620" fill="url(#sky)"/><circle cx="760" cy="105" r="150" fill="url(#glow)"/>`;
    let scene='';
    if(k==='meadow')scene=`<path d="M0 420 Q160 330 330 390 Q520 300 710 382 Q865 330 1000 405 V620 H0Z" fill="#365e4d"/><path d="M0 475 Q175 400 338 450 Q524 365 720 448 Q890 390 1000 455 V620 H0Z" fill="#213f36"/><path d="M190 420 Q260 315 330 420" fill="none" stroke="#607e5c" stroke-width="25"/><path d="M820 435 Q775 320 730 438" fill="none" stroke="#597a57" stroke-width="22"/><g fill="#d7ecb4" opacity=".55"><circle cx="110" cy="470" r="6"/><circle cx="160" cy="440" r="4"/><circle cx="590" cy="430" r="5"/><circle cx="675" cy="472" r="4"/><circle cx="900" cy="460" r="6"/></g>`;
    if(k==='glass')scene=`<path d="M0 380 Q190 330 380 398 Q550 342 740 405 Q890 362 1000 410 V620 H0Z" fill="#1a4960"/><path d="M0 470 Q250 410 440 470 Q700 402 1000 478 V620 H0Z" fill="#123348"/><g fill="#80def4" opacity=".66"><path d="M150 430 L195 250 L230 440Z"/><path d="M260 445 L315 300 L347 455Z"/><path d="M725 452 L770 270 L815 453Z"/><path d="M830 460 L865 335 L902 463Z"/></g><path d="M0 508 Q150 490 300 510 T600 505 T1000 510" fill="none" stroke="#a8e9ff" stroke-width="5" opacity=".45"/>`;
    if(k==='moon')scene=`<rect width="1000" height="620" fill="#15172b"/><circle cx="760" cy="110" r="75" fill="#e7e0c2" opacity=".72"/><path d="M0 430 Q160 340 350 409 Q515 330 700 410 Q860 350 1000 420 V620 H0Z" fill="#26334a"/><path d="M90 460 Q120 250 250 190 Q215 335 345 430" fill="none" stroke="#344734" stroke-width="42"/><path d="M880 450 Q855 255 740 208 Q782 335 662 430" fill="none" stroke="#344734" stroke-width="38"/><g fill="#9c8ad1"><ellipse cx="130" cy="468" rx="22" ry="13"/><ellipse cx="330" cy="455" rx="18" ry="11"/><ellipse cx="795" cy="468" rx="24" ry="13"/></g>`;
    if(k==='gear')scene=`<rect width="1000" height="620" fill="#24222e"/><path d="M0 434 Q180 380 365 426 Q560 365 735 435 Q885 392 1000 430 V620 H0Z" fill="#3b3437"/><g fill="none" stroke="#8f6d57" stroke-width="15" opacity=".8"><circle cx="160" cy="410" r="74"/><circle cx="160" cy="410" r="30"/><circle cx="830" cy="420" r="95"/><circle cx="830" cy="420" r="38"/></g><g stroke="#b8895f" stroke-width="8"><path d="M105 410H215M160 355V465M762 420H898M830 352V488"/></g><path d="M320 480 H680" stroke="#674b42" stroke-width="34"/><path d="M350 462 V390 M470 462 V360 M590 462 V382 M650 462 V340" stroke="#b56e51" stroke-width="16"/>`;
    if(k==='storm')scene=`<rect width="1000" height="620" fill="#1a1d2b"/><path d="M0 425 Q180 320 345 412 Q525 294 700 410 Q860 330 1000 414 V620 H0Z" fill="#382f35"/><path d="M0 490 Q220 410 410 485 Q680 397 1000 487 V620 H0Z" fill="#221d24"/><path d="M210 450 L310 245 L390 450 M635 450 L730 220 L824 450" fill="#51404a"/><path d="M315 245 L333 302 L354 270 L376 336" fill="none" stroke="#ff965f" stroke-width="14"/><path d="M0 230 Q220 182 420 232 T850 210 T1000 222" fill="none" stroke="#b8c6e7" stroke-width="12" opacity=".32"/>`;
    if(k==='thistle')scene=`<rect width="1000" height="620" fill="#22273b"/><path d="M0 425 Q170 340 360 412 Q530 312 730 418 Q880 360 1000 420 V620 H0Z" fill="#334d45"/><path d="M0 485 Q250 418 440 476 Q720 408 1000 486 V620 H0Z" fill="#21352f"/><g fill="none" stroke="#8f8aa0" stroke-width="18"><ellipse cx="175" cy="430" rx="75" ry="105"/><ellipse cx="820" cy="440" rx="65" ry="94"/></g><g fill="#8d67a2"><circle cx="110" cy="478" r="8"/><circle cx="270" cy="455" r="7"/><circle cx="710" cy="472" r="9"/><circle cx="910" cy="459" r="7"/></g><path d="M430 470 Q500 280 570 470" fill="none" stroke="#58634c" stroke-width="28"/>`;
    if(k==='flux')scene=`<rect width="1000" height="620" fill="#0e1420"/><path d="M0 440 Q180 350 350 425 Q520 330 700 428 Q860 355 1000 432 V620 H0Z" fill="#202d3c"/><path d="M0 500 Q220 430 410 492 Q660 420 1000 500 V620 H0Z" fill="#111d28"/><g fill="none" stroke="#5ad7c4" stroke-width="8" opacity=".65"><circle cx="175" cy="410" r="92"/><circle cx="175" cy="410" r="48"/><circle cx="820" cy="420" r="105"/><circle cx="820" cy="420" r="55"/></g><path d="M170 318 L170 502 M83 410 H267 M820 315 V525 M715 420 H925" stroke="#7f75c8" stroke-width="5" opacity=".8"/><path d="M380 470 V300 H430 V470 M570 470 V265 H620 V470" stroke="#3c556a" stroke-width="30"/><g fill="#8ff2df"><circle cx="405" cy="286" r="16"/><circle cx="595" cy="250" r="18"/></g>`;
    if(k==='seasonal')scene=`<rect width="1000" height="620" fill="#243149"/><path d="M0 430 Q170 350 340 414 Q520 330 710 420 Q870 360 1000 425 V620 H0Z" fill="#4b4a45"/><path d="M0 494 Q230 420 430 484 Q690 410 1000 493 V620 H0Z" fill="#31353d"/><path d="M140 460 V285 H310 V460 M690 460 V285 H860 V460" fill="none" stroke="#8e6852" stroke-width="26"/><path d="M120 300 H330 M670 300 H880" stroke="#c58c62" stroke-width="22"/><path d="M115 280 Q250 205 335 280 M665 280 Q800 205 885 280" fill="none" stroke="#d8b964" stroke-width="12"/><g fill="#ffd36d"><circle cx="155" cy="275" r="8"/><circle cx="210" cy="245" r="8"/><circle cx="270" cy="244" r="8"/><circle cx="320" cy="278" r="8"/><circle cx="705" cy="276" r="8"/><circle cx="760" cy="247" r="8"/><circle cx="820" cy="246" r="8"/><circle cx="870" cy="278" r="8"/></g><path d="M430 465 Q500 335 570 465" fill="none" stroke="#725a83" stroke-width="34"/>`;
    if(k==='crown')scene=`<rect width="1000" height="620" fill="#171525"/><circle cx="500" cy="130" r="110" fill="#745da0" opacity=".32"/><path d="M0 430 Q180 325 360 413 Q500 285 662 414 Q850 330 1000 422 V620 H0Z" fill="#302c47"/><path d="M0 495 Q225 420 430 488 Q700 408 1000 493 V620 H0Z" fill="#1d1b30"/><path d="M355 465 V275 H405 V465 M595 465 V275 H645 V465" stroke="#6f6285" stroke-width="28"/><path d="M335 285 H425 M575 285 H665" stroke="#9c8fb2" stroke-width="23"/><path d="M405 318 Q500 230 595 318" fill="none" stroke="#84749e" stroke-width="18"/><g fill="#c9b8ff" opacity=".55"><circle cx="110" cy="170" r="4"/><circle cx="210" cy="105" r="3"/><circle cx="790" cy="140" r="5"/><circle cx="890" cy="95" r="3"/></g>`;
    return `<svg class="landscape" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice">${common}${scene}</svg>`;
  }

  const STAGE_POS_DENSE = [
    [12,30],[27,30],[42,30],[57,30],[72,30],[87,30],
    [8,40.5],[22,40.5],[36,40.5],[50,40.5],[64,40.5],[78,40.5],[92,40.5],
    [12,51],[27,51],[42,51],[57,51],[72,51],[87,51],
    [8,61.5],[22,61.5],[36,61.5],[50,61.5],[64,61.5],[78,61.5],[92,61.5],
    [12,72],[27,72],[42,72],[57,72],[72,72],[87,72]
  ];
  const STAGE_POS_OPEN = [
    [20,67],[35,52],[50,68],[64,49],[78,66],[45,38],[59,32],
    [27,38],[72,38],[51,50],[15,46],[84,47],[36,73],[66,73]
  ];
  function stagePlacement(i,count){
    if(count<=STAGE_POS_OPEN.length)return STAGE_POS_OPEN[i];
    const p=STAGE_POS_DENSE[i]||[50,50];return window.innerWidth>800?[7+p[0]*.78,p[1]]:p;
  }
  function stageMonsterWidth(count,i){
    if(count<=10)return `clamp(82px,9vw,138px)`;
    if(count<=14)return `clamp(70px,8vw,118px)`;
    if(count<=21)return `clamp(54px,6.8vw,92px)`;
    if(count<=27)return `clamp(46px,5.9vw,78px)`;
    return `clamp(40px,5.1vw,68px)`;
  }


  function renderTop(){
    const cs=[['coins','Coins','#f2c45e'],['gems','Gems','#6fe3d6'],['resonance','Resonance','#9e8dff'],['crests','Crests','#ff8eb1']];
    $('#currencyStrip').innerHTML=cs.map(([k,n,c])=>`<div class="currency"><i style="--c:${c}"></i><span>${n}</span><b>${fmt(state[k])}</b></div>`).join('');
    $('#islandSubtitle').textContent=`Level ${state.level} | ${fmt(state.xp)} / ${fmt(levelNeed(state.level))} XP`;
  }

  function renderAll(){renderTop();renderWorld();if(currentPanel)renderPanel(currentPanel);}
  function renderWorld(){
    const k=state.currentWorld,w=WORLDS[k],ws=state.worlds[k];
    $('#worldName').textContent=w.name;$('#worldType').textContent=w.type;$('#worldDesc').textContent=w.desc;
    $('#landscape').innerHTML=landscapeSVG(k);
    document.documentElement.style.setProperty('--accent',w.colors[0]);
    document.documentElement.style.setProperty('--accent2',w.colors[1]);
    renderStage();
    const cap=castleBeds(ws.castle),used=ws.placed.length;
    $('#castleLabel').textContent=`Level ${ws.castle} | ${used}/${cap} beds`;
    $('#castleMeter').style.width=`${clamp(used/cap*100,0,100)}%`;
    const power=songPower(k),target=worldPowerTarget(k);
    $('#songPowerLabel').textContent=`${fmt(power)} / ${fmt(target)}`;
    $('#songPowerMeter').style.width=`${clamp(power/target*100,0,100)}%`;
    const lit=activeTorches(k).length;
    $('#torchLabel').textContent=`${lit} / 10`;
    $('#torchMeter').style.width=`${lit*10}%`;
    $('#performanceBtn').textContent=songTimer?'STOP SONG':'PLAY SONG';
  }

  function renderStage(){
    const ws=currentWS(),stage=$('#monsterStage'); stage.innerHTML='';
    const actual=ws.placed.map(id=>state.owned.find(o=>o.uid===id)).filter(Boolean);
    $('#emptyStage').classList.toggle('hidden',actual.length>0);
    actual.forEach((o,i)=>{
      const m=M[o.id],p=stagePlacement(i,actual.length);
      const el=document.createElement('div');el.className='monster'+(actual.length>14?' dense':'');el.dataset.uid=o.uid;el.dataset.species=o.id;
      el.style.left=p[0]+'%';el.style.top=p[1]+'%';el.style.zIndex=String(8+Math.floor(p[1]));
      el.style.width=stageMonsterWidth(actual.length,i);
      el.innerHTML=monsterSVG(m,o.form)+`<span class="badge-form">${o.form.toUpperCase()} L${o.level}</span>`;
      el.title=`${m.name} ${o.form} | ${m.sound}`;
      el.addEventListener('click',()=>openMonster(o.uid));stage.appendChild(el);
    });
    renderMixer(actual);
  }

  function renderMixer(list){
    const root=$('#mixStrip');root.innerHTML='';
    list.forEach(o=>{
      const m=M[o.id],c=document.createElement('div');c.className='mix-chip'+(o.muted?' muted':'');
      c.innerHTML=`<b>${m.name}</b><span>${o.form}</span><button>${o.muted?'UNMUTE':'MUTE'}</button>`;
      c.querySelector('button').onclick=e=>{e.stopPropagation();o.muted=!o.muted;save();renderStage();};root.appendChild(c);
    });
  }

  function castleBeds(level){return [0,7,12,18,24,32][level]||32;}
  function castleUpgradeCost(level){return [0,4500,14000,42000,125000][level]||0;}
  function worldPowerTarget(k){const w=WORLDS[k],per=70+w.difficulty*8,season=k==='seasonal'?1.12:1;return Math.floor(w.roster.length*per*season);}
  function songPower(k){
    let x=0;state.owned.filter(o=>o.home===k).forEach(o=>{x+=(50+o.level*9)*FORM_MULT[o.form];});
    if(state.worlds.storm.mastered)x*=1.15;
    return Math.floor(x);
  }
  function activeTorches(k){
    const ws=state.worlds[k];ws.torches=(ws.torches||[]).filter(t=>t>now());return ws.torches;
  }

  function openModal(title,eyebrow='CHORUSWILD'){
    $('#modalLayer').classList.remove('hidden');$('#modalTitle').textContent=title;$('#modalEyebrow').textContent=eyebrow;
  }
  function closeModal(){currentPanel=null;$('#modalLayer').classList.add('hidden');breedPick=[];}
  function openPanel(name){currentPanel=name;renderPanel(name);}
  function renderPanel(name){
    const names={market:'Market',breed:'Breeding Lab',collection:'Collection Book',goals:'Goals and Mastery',arcade:'Daily Arcade',map:'World Map',settings:'Settings'};
    openModal(names[name]||'Panel',name==='map'?'THE ARCHIPELAGO':'CHORUSWILD');
    if(name==='market')renderMarket();
    else if(name==='breed')renderBreed();
    else if(name==='collection')renderCollection();
    else if(name==='goals')renderGoals();
    else if(name==='arcade')renderArcade();
    else if(name==='map')renderMap();
    else if(name==='settings')renderSettings();
  }

  function eventDateText(v){const f=n=>`${Math.floor(n/100)}/${String(n%100).padStart(2,'0')}`;return `${f(v.start)} - ${f(v.end)}`;}
  function worldSingles(k){return WORLDS[k].roster.map(id=>M[id]).filter(m=>m&&m.elements.length===1&&!m.seasonal);}
  function removeOwned(o){
    if(!o)return;const ws=state.worlds[o.home];if(ws)ws.placed=ws.placed.filter(x=>x!==o.uid);
    state.owned=state.owned.filter(x=>x.uid!==o.uid);
  }
  function renderMarket(){
    const k=state.currentWorld;
    if(k==='flux'){renderFluxMarket();return;}
    if(k==='seasonal'){renderSeasonalMarket();return;}
    const w=WORLDS[k],ws=state.worlds[k],root=$('#modalBody');
    const singles=worldSingles(k),castleCost=castleUpgradeCost(ws.castle);
    const commonReady=singles.length>=4&&singles.every(m=>!!ownedForm(m.id,'Common',k));
    const rareReady=singles.length>=4&&singles.every(m=>!!ownedForm(m.id,'Rare',k));
    const vault=singles.length>=4?`<div class="game-card vault-card"><div class="eyebrow">RESONANCE VAULT</div><h3>Power variants by boxing a full single-element set</h3><p>Rare Chamber consumes one Common of every single-element species here. Epic Chamber consumes one Rare of every single-element species. Pick which single elemental emerges from the chamber.</p><div class="vault-meter"><span>Common set</span><b>${singles.filter(m=>ownedForm(m.id,'Common',k)).length}/${singles.length}</b></div><div class="vault-meter"><span>Rare set</span><b>${singles.filter(m=>ownedForm(m.id,'Rare',k)).length}/${singles.length}</b></div><select class="select-input" id="vaultTarget">${singles.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select><div class="card-actions"><button class="secondary" id="rareVaultBtn" ${commonReady?'':'disabled'}>POWER RARE VAULT - 40 RES</button><button class="primary" id="epicVaultBtn" ${rareReady?'':'disabled'}>POWER EPIC VAULT - 120 RES + 1 CREST</button></div></div>`:'';
    const visit=SEASONAL_VISITS[k],active=visit&&visitActive(k),vm=visit&&M[visit.id];
    const eventCard=visit?`<div class="game-card event-card ${active?'event-live':'event-closed'}"><div class="eyebrow">${active?'LIMITED EVENT LIVE':'LIMITED EVENT DORMANT'} - ${visit.label}</div><div class="monster-preview">${monsterSVG(vm,'Common')}</div><h3>${vm.name}</h3><p>${active?`Breed ${M[visit.pair[0]].name} + ${M[visit.pair[1]].name}. Base encounter chance: ${Math.round(seasonalVisitChance(k)*1000)/10}%. It cannot be purchased.`:`Returns during ${visit.label} (${eventDateText(visit)}). It remains breedable all year only on Seasonal Island.`}</p><div class="statline"><span>Availability</span><b>${active?'BREEDING ACTIVE':'EVENT ONLY'}</b></div></div>`:'';
    root.innerHTML=`<div class="two-col"><section class="panel"><h3>Starter voices</h3><p>Buy Commons here. Hybrids and Quads come from breeding; single-element Rares and Epics can be forged in the Resonance Vault.</p><div class="card-grid" id="marketGrid"></div>${eventCard}</section><section class="panel"><h3>Island structures</h3><div class="notice">Each species is limited to one Common, one Rare and one Epic on this world. Castle beds are the only placement cap.</div><div class="game-card"><h3>Castle level ${ws.castle}</h3><p>${castleBeds(ws.castle)} beds. Higher levels let you keep all three forms together.</p><div class="card-actions"><button class="primary" id="castleBtn">${ws.castle>=5?'MAX LEVEL':`UPGRADE ${fmt(castleCost)} COINS`}</button></div></div><div class="game-card"><h3>Harmony Lantern</h3><p>Light one for 24 hours. Each active lantern improves hybrid Rare and Epic odds. Maximum 10.</p><div class="statline"><span>Active</span><b>${activeTorches(k).length}/10</b></div><div class="card-actions"><button class="secondary" id="torchBtn">LIGHT FOR 2 GEMS</button></div></div>${vault}${k==='thistle'?`<div class="game-card"><h3>Pipeglen Cairn</h3><p>Complete the other Commons here. Then awaken Pipeglen, the living reed-drone lead.</p><div class="card-actions"><button class="primary" id="pipeBtn">AWAKEN NEXT FORM</button></div></div>`:''}${k==='crown'?`<div class="game-card"><h3>Crownmaw Resonator</h3><p>Attune the six non-Crownmaw Commons here, then awaken the final conductor.</p><div class="card-actions"><button class="primary" id="crownBtn">AWAKEN NEXT FORM</button></div></div>`:''}</section></div>`;
    const grid=$('#marketGrid');
    if(k==='crown')renderCrownAttunements(grid);
    else singles.forEach(m=>{
      const has=ownedForm(m.id,'Common',k),card=document.createElement('article');card.className='game-card';
      card.innerHTML=`<div class="monster-preview">${monsterSVG(m,'Common')}</div><h3>${m.name}</h3><p>${m.bio}</p><div class="tags">${m.elements.map(e=>`<span class="tag">${ELEMENT_LABELS[e]}</span>`).join('')}<span class="tag">${m.sound}</span></div><div class="statline"><span>Cost</span><b>${fmt(m.price)} Coins</b></div><div class="card-actions"><button class="primary">${has?'OWNED':'BUY COMMON'}</button></div>`;
      const btn=card.querySelector('button');btn.disabled=!!has;btn.onclick=()=>buyStarter(m.id);grid.appendChild(card);
    });
    $('#castleBtn').onclick=upgradeCastle;$('#torchBtn').onclick=lightTorch;
    if($('#rareVaultBtn'))$('#rareVaultBtn').onclick=()=>powerVariantVault('Rare');
    if($('#epicVaultBtn'))$('#epicVaultBtn').onclick=()=>powerVariantVault('Epic');
    if($('#pipeBtn'))$('#pipeBtn').onclick=awakenPipeglen;
    if($('#crownBtn'))$('#crownBtn').onclick=awakenCrown;
  }
  function powerVariantVault(form){
    const k=state.currentWorld,singles=worldSingles(k),target=$('#vaultTarget')?.value,need=form==='Rare'?'Common':'Rare';
    if(!target||ownedForm(target,form,k)){toast(`That ${form} is already owned here.`);return;}
    if(singles.length<4||!singles.every(m=>ownedForm(m.id,need,k))){toast(`The ${form} chamber needs the full ${need} single-element set.`);return;}
    const res=form==='Rare'?40:120,crest=form==='Epic'?1:0;if(state.resonance<res||state.crests<crest){toast(`Need ${res} Resonance${crest?' and 1 Crest':''}.`);return;}
    singles.forEach(m=>removeOwned(ownedForm(m.id,need,k)));currency('resonance',-res);if(crest)currency('crests',-crest);
    const o=makeOwned(target,form,k);state.owned.push(o);if(currentWS().placed.length<castleBeds(currentWS().castle))currentWS().placed.push(o.uid);
    state.stats.vaults=(state.stats.vaults||0)+1;if(form==='Rare')state.stats.rare++;else state.stats.epic++;
    gainXP(form==='Epic'?900:420);sfx('mastery');showDiscovery(target,form,k,'RESONANCE VAULT');toast(`${M[target].name} ${form} emerged from the Resonance Vault.`);save();renderAll();renderMarket();
  }
  function renderSeasonalMarket(){
    const root=$('#modalBody'),k='seasonal',ws=state.worlds[k],castleCost=castleUpgradeCost(ws.castle),starters=WORLDS[k].roster.map(id=>M[id]).filter(m=>m?.festivalStarter);
    root.innerHTML=`<div class="two-col"><section class="panel"><div class="eyebrow">FESTIVAL ENSEMBLE</div><h3>Build the four breeding voices</h3><p>Seasonal performers are never sold. These four permanent ensemble monsters are the only direct purchases; every holiday monster must be bred from the recipe tree.</p><div class="card-grid" id="seasonGrid"></div></section><section class="panel"><h3>Festival Castle</h3><div class="game-card"><h3>Castle level ${ws.castle}</h3><p>${castleBeds(ws.castle)} beds. Upgrade it before building the full holiday orchestra.</p><div class="card-actions"><button class="primary" id="castleBtn">${ws.castle>=5?'MAX LEVEL':`UPGRADE ${fmt(castleCost)} COINS`}</button></div></div><div class="notice gold">Seasonal Island ignores real-world event dates: all fourteen holiday recipes stay breedable here every day of the year. Their visits to other worlds remain event-only.</div><div class="game-card"><h3>Festival Recipe Atlas</h3><div id="festivalAtlas"></div></div></section></div>`;
    const grid=$('#seasonGrid');starters.forEach(m=>{const has=ownedForm(m.id,'Common',k),c=document.createElement('article');c.className='game-card';c.innerHTML=`<div class="monster-preview">${monsterSVG(m,'Common')}</div><h3>${m.name}</h3><p>${m.bio}</p><div class="card-actions"><button class="primary">${has?'OWNED':`BUY - ${fmt(m.price)} COINS`}</button></div>`;const b=c.querySelector('button');b.disabled=!!has;b.onclick=()=>buyFestivalStarter(m.id);grid.appendChild(c);});
    $('#festivalAtlas').innerHTML=Object.entries(FESTIVAL_RECIPES).map(([id,pair])=>{const m=M[id],got=!!ownedForm(id,'Common',k);return `<div class="recipe-row ${got?'complete':''}"><span><b>${m.name}</b><small>${m.seasonal}</small></span><span>${M[pair[0]].name} + ${M[pair[1]].name}</span><b>${got?'DISCOVERED':'BREED'}</b></div>`;}).join('');
    $('#castleBtn').onclick=upgradeCastle;
  }
  function buyFestivalStarter(id){
    const m=M[id],k='seasonal';if(state.currentWorld!==k||!m?.festivalStarter||ownedForm(id,'Common',k))return;if(state.coins<m.price){toast('Not enough Coins.');return;}
    if(currentWS().placed.length>=castleBeds(currentWS().castle)){toast('Upgrade the Festival Castle for more beds.');return;}
    currency('coins',-m.price);const o=makeOwned(id,'Common',k);state.owned.push(o);currentWS().placed.push(o.uid);gainXP(65);sfx('buy');save();renderAll();renderSeasonalMarket();
  }
  function coreCapacity(){const s=state.synth;return 8+(s.level-1)*2+(state.worlds.flux.mastered?2:0);}
  function coreUsed(){const s=state.synth;return s.neutral+s.earth+s.leaf+s.wind+s.ember+s.aether+(s.attuneJobs||[]).length+(s.fiveCycle?5:0);}
  function attuneSlots(){return Math.max(1,state.synth.level);}
  function renderFluxMarket(){
    const root=$('#modalBody'),s=state.synth,cap=coreCapacity(),used=coreUsed(),jobs=s.attuneJobs||[],visit=SEASONAL_VISITS.flux,active=visitActive('flux'),cycle=s.fiveCycle;
    root.innerHTML=`<div class="two-col"><section class="panel"><div class="eyebrow">ATTUNEMENT STRUCTURE</div><h3>Five-channel Core Array</h3><p>Attunement now uses persistent slots. A running Core survives closing the panel or reloading the game, and completed jobs are collected automatically.</p><div class="core-bank"><div><span>Blank</span><b>${s.neutral}</b></div>${['earth','leaf','wind','ember','aether'].map(e=>`<div><span>${ELEMENT_LABELS[e]}</span><b>${s[e]}</b></div>`).join('')}</div><div class="statline"><span>Core capacity</span><b>${used}/${cap}</b></div><div class="statline"><span>Attunement slots</span><b>${cycle?'FIVE-CYCLE ACTIVE':`${jobs.length}/${attuneSlots()}`}</b></div><div class="attune-jobs">${cycle?`<div class="attune-job cycle-job"><span>Five-Cycle Batch</span><b class="cycle-live">${secText(cycle.end-now())}</b><button class="mini-btn" id="rushCycleBtn">RUSH ${speedGemCost(cycle.end)} GEM${speedGemCost(cycle.end)===1?'':'S'}</button></div>`:jobs.length?jobs.map((j,i)=>`<div class="attune-job"><span>${ELEMENT_LABELS[j.element]} Core</span><b class="attune-live" data-index="${i}">${secText(j.end-now())}</b><button class="mini-btn" data-rush-attune="${i}">RUSH ${speedGemCost(j.end)} GEM${speedGemCost(j.end)===1?'':'S'}</button></div>`).join(''):'<div class="notice">No Core is attuning. Choose a channel below.</div>'}</div><div class="attune-grid">${['earth','leaf','wind','ember','aether'].map(e=>`<button class="secondary attune-btn" data-element="${e}" ${cycle||jobs.length>=attuneSlots()?'disabled':''}>ATTUNE ${ELEMENT_LABELS[e].toUpperCase()} - 20 RES / 20 MIN</button>`).join('')}</div><div class="card-actions"><button class="secondary" id="forgeBlankBtn">FORGE BLANK CORE - 4 GEMS</button><button class="secondary" id="fiveCycleBtn" ${cycle||jobs.length?'disabled':''}>FIVE-CYCLE - 5 BLANK + 100 RES</button></div><div class="game-card event-card ${active?'event-live':'event-closed'}" style="margin-top:10px"><div class="eyebrow">${visit.label} EVENT</div><div class="monster-preview">${monsterSVG(M[visit.id],'Common')}</div><h3>${M[visit.id].name}</h3><p>${active?`Breed ${M[visit.pair[0]].name} + ${M[visit.pair[1]].name} in the Breed panel for a ${Math.round(seasonalVisitChance('flux')*1000)/10}% base encounter chance.`:`The Fluxworks event breeder opens ${eventDateText(visit)}. ${M[visit.id].name} stays permanent only on Seasonal Island.`}</p></div></section><section class="panel"><div class="eyebrow">SYNTHESIS CHAMBER</div><h3>Stability level ${s.level}/3</h3><p>Level 1 handles Triples. Level 2 unlocks Quads that consume a Triple base. Level 3 unlocks Pentaflux, which consumes both Quads plus five tuned Cores.</p><div class="card-actions"><button class="primary" id="synthUpgradeBtn">${s.level>=3?'MAX STABILITY':s.level===1?'UPGRADE - 120,000 COINS + 180 RES':'UPGRADE - 300,000 COINS + 350 RES + 4 CRESTS'}</button></div><div id="synthRecipes" class="card-grid" style="margin-top:10px"></div></section></div>`;
    $$('.attune-btn',root).forEach(b=>b.onclick=()=>startAttune(b.dataset.element));$$('[data-rush-attune]',root).forEach(b=>b.onclick=()=>rushAttune(+b.dataset.rushAttune));if($('#rushCycleBtn'))$('#rushCycleBtn').onclick=rushFiveCycle;$('#forgeBlankBtn').onclick=forgeBlankCore;$('#fiveCycleBtn').onclick=startFiveCycle;$('#synthUpgradeBtn').onclick=upgradeSynth;renderSynthRecipes();
  }
  function forgeBlankCore(){const s=state.synth;if(coreUsed()>=coreCapacity()){toast('Core capacity is full.');return;}if(state.gems<4){toast('Need 4 Gems.');return;}currency('gems',-4);s.neutral++;sfx('buy');save();renderFluxMarket();renderTop();}
  function startAttune(element){
    const s=state.synth;s.attuneJobs=s.attuneJobs||[];if(s.fiveCycle){toast('Five-Cycle is already running.');return;}if(s.attuneJobs.length>=attuneSlots()){toast('Every attunement slot is busy.');return;}if(s.neutral<1){toast('Forge or free a Blank Core first.');return;}if(state.resonance<20){toast('Need 20 Resonance.');return;}
    currency('resonance',-20);s.neutral--;s.attuneJobs.push({element,end:now()+20*60000});sfx('breed');save();renderFluxMarket();renderTop();
  }
  function startFiveCycle(){
    const s=state.synth;s.attuneJobs=s.attuneJobs||[];if(s.attuneJobs.length){toast('Finish active attunements before starting a Five-Cycle.');return;}if(s.neutral<5){toast('Five-Cycle needs 5 Blank Cores.');return;}if(state.resonance<100){toast('Five-Cycle needs 100 Resonance.');return;}if(attuneSlots()<3){toast('Five-Cycle unlocks at Stability level 3.');return;}
    currency('resonance',-100);s.neutral-=5;s.fiveCycle={end:now()+20*60000};sfx('breed');save();renderFluxMarket();renderTop();
  }
  function rushAttune(i){const s=state.synth,j=s.attuneJobs?.[i];if(!j)return;const cost=speedGemCost(j.end);if(state.gems<cost){toast(`Need ${cost} Gems.`);return;}currency('gems',-cost);j.end=now();finishAttune();save();renderFluxMarket();renderTop();}
  function rushFiveCycle(){const s=state.synth,j=s.fiveCycle;if(!j)return;const cost=speedGemCost(j.end);if(state.gems<cost){toast(`Need ${cost} Gems.`);return;}currency('gems',-cost);j.end=now();finishAttune();save();renderFluxMarket();renderTop();}
  function finishAttune(){
    const s=state.synth;s.attuneJobs=s.attuneJobs||[];let changed=false;if(s.fiveCycle&&s.fiveCycle.end<=now()){['earth','leaf','wind','ember','aether'].forEach(e=>s[e]=(s[e]||0)+1);s.fiveCycle=null;changed=true;toast('Five-Cycle complete: one Core attuned to every energy.');}
    const done=s.attuneJobs.filter(j=>j.end<=now());if(done.length){done.forEach(j=>s[j.element]=(s[j.element]||0)+1);s.attuneJobs=s.attuneJobs.filter(j=>j.end>now());changed=true;toast(done.length===1?`${ELEMENT_LABELS[done[0].element]} Core attuned.`:`${done.length} Cores finished attuning.`);}
    if(changed){sfx('hatch');save();}return changed;
  }
  function upgradeSynth(){
    const s=state.synth;if(s.level>=3)return;if(s.level===1){if(state.coins<120000||state.resonance<180){toast('Need 120,000 Coins and 180 Resonance.');return;}currency('coins',-120000);currency('resonance',-180);}
    else {if(state.coins<300000||state.resonance<350||state.crests<4){toast('Need 300,000 Coins, 350 Resonance and 4 Crests.');return;}currency('coins',-300000);currency('resonance',-350);currency('crests',-4);}
    s.level++;gainXP(600*s.level);sfx('mastery');save();renderFluxMarket();renderTop();
  }

  function buyStarter(id){
    const k=state.currentWorld,m=M[id],ws=currentWS();
    if(ownedForm(id,'Common',k)){toast('That Common already lives here.');return;}
    if(state.coins<m.price){toast('Not enough Coins.');sfx('bad');return;}
    if(ws.placed.length>=castleBeds(ws.castle)){toast('Upgrade the Castle for more beds.');return;}
    currency('coins',-m.price);const o=makeOwned(id,'Common',k);state.owned.push(o);ws.placed.push(o.uid);gainXP(35);sfx('buy');save();renderAll();renderMarket();
  }
  function upgradeCastle(){
    const ws=currentWS();if(ws.castle>=5){toast('Castle is already max level.');return;}
    const cost=castleUpgradeCost(ws.castle);if(state.coins<cost){toast('Not enough Coins.');return;}
    currency('coins',-cost);ws.castle++;gainXP(80*ws.castle);sfx('unlock');save();renderAll();renderMarket();
  }
  function lightTorch(){
    const k=state.currentWorld,ws=currentWS();activeTorches(k);
    if(ws.torches.length>=10){toast('All 10 lanterns are already lit.');return;}
    if(state.gems<2){toast('You need 2 Gems.');return;}
    currency('gems',-2);ws.torches.push(now()+86400000);sfx('buy');save();renderAll();renderMarket();
  }

  function renderCrownAttunements(grid){
    const ids=WORLDS.crown.roster.filter(id=>id!=='crownmaw');
    ids.forEach(id=>{
      const m=M[id],card=document.createElement('article');card.className='game-card';
      const missing=FORMS.filter(f=>!ownedForm(id,f,'crown'));
      const next=missing[0]||null;
      const source=next&&state.owned.some(o=>o.id===id&&o.form===next&&o.home!=='crown');
      const cost=next==='Epic'?90:next==='Rare'?45:20;
      card.innerHTML=`<div class="monster-preview">${monsterSVG(m,next||'Epic')}</div><h3>${m.name}</h3><p>Attune an already discovered form from another world into Crownfall.</p><div class="rarity-book">${FORMS.map(f=>`<div class="book-cell ${ownedForm(id,f,'crown')?'got':''}">${f}</div>`).join('')}</div><div class="card-actions"><button class="primary">${!next?'ALL FORMS ATTUNED':source?`ATTUNE ${next.toUpperCase()} - ${cost} RES`:`DISCOVER ${next?next.toUpperCase():''} ELSEWHERE`}</button></div>`;
      const b=card.querySelector('button');b.disabled=!next||!source;b.onclick=()=>attuneToCrown(id,next,cost);grid.appendChild(card);
    });
  }
  function attuneToCrown(id,form,cost){
    const ws=state.worlds.crown;if(state.resonance<cost){toast('Not enough Resonance.');return;}
    if(!state.owned.some(o=>o.id===id&&o.form===form&&o.home!=='crown')){toast('Discover that form on another world first.');return;}
    if(ownedForm(id,form,'crown'))return;
    currency('resonance',-cost);const o=makeOwned(id,form,'crown');state.owned.push(o);if(ws.placed.length<castleBeds(ws.castle))ws.placed.push(o.uid);gainXP(120+cost*2);sfx('unlock');save();renderAll();renderMarket();
  }
  function awakenPipeglen(){
    const k='thistle',ws=state.worlds[k],other=WORLDS[k].roster.filter(id=>id!=='pipeglen');
    if(!other.every(id=>ownedForm(id,'Common',k))){toast('Complete the six other Commons first.');return;}
    const next=!ownedForm('pipeglen','Common',k)?'Common':!ownedForm('pipeglen','Rare',k)?'Rare':!ownedForm('pipeglen','Epic',k)?'Epic':null;
    if(!next){toast('All Pipeglen forms are already awakened.');return;}
    const cost=next==='Common'?{resonance:55,crests:1}:next==='Rare'?{resonance:100,crests:2}:{resonance:220,crests:4};
    if(state.resonance<cost.resonance||state.crests<cost.crests){toast(`Need ${cost.resonance} Resonance and ${cost.crests} Crests.`);return;}
    if(ws.placed.length>=castleBeds(ws.castle)){toast('Upgrade the Castle or remove a performer first.');return;}
    currency('resonance',-cost.resonance);currency('crests',-cost.crests);const o=makeOwned('pipeglen',next,k);state.owned.push(o);ws.placed.push(o.uid);gainXP(next==='Epic'?900:next==='Rare'?520:320);sfx('mastery');toast(`Pipeglen ${next} awakened.`);save();renderAll();renderMarket();
  }
  function awakenCrown(){
    const k='crown',ws=state.worlds[k],ids=WORLDS[k].roster.filter(id=>id!=='crownmaw');
    if(!ids.every(id=>ownedForm(id,'Common',k))){toast('Attune the six required Commons first.');return;}
    const next=!ownedForm('crownmaw','Common',k)?'Common':!ownedForm('crownmaw','Rare',k)?'Rare':!ownedForm('crownmaw','Epic',k)?'Epic':null;
    if(!next){toast('All Crownmaw forms are already awake.');return;}
    const cost=next==='Common'?{resonance:100,crests:3}:next==='Rare'?{resonance:180,crests:5}:{resonance:360,crests:8};
    if(state.resonance<cost.resonance||state.crests<cost.crests){toast(`Need ${cost.resonance} Resonance and ${cost.crests} Crests.`);return;}
    if(ws.placed.length>=castleBeds(ws.castle)){toast('Upgrade the Castle or remove a performer first.');return;}
    currency('resonance',-cost.resonance);currency('crests',-cost.crests);const o=makeOwned('crownmaw',next,k);state.owned.push(o);ws.placed.push(o.uid);gainXP(next==='Epic'?1800:next==='Rare'?1200:900);sfx('mastery');toast(`Crownmaw ${next} awakened.`);save();renderAll();renderMarket();
  }

  const SYNTH_RECIPES=[
    {id:'rivetwisp',level:1,cores:{earth:1,wind:1,aether:1},time:150},
    {id:'briarcoil',level:1,cores:{leaf:1,ember:1,aether:1},time:165},
    {id:'drumflare',level:1,cores:{earth:1,leaf:1,ember:1},time:180},
    {id:'phasekiln',level:2,base:['rivetwisp'],cores:{ember:2},time:300},
    {id:'thornmotor',level:2,base:['drumflare'],cores:{wind:2},time:330},
    {id:'pentaflux',level:3,base:['phasekiln','thornmotor'],cores:{earth:1,leaf:1,wind:1,ember:1,aether:1},crests:3,time:600}
  ];
  function synthFormRoll(id){
    if(!FORMS.some(f=>ownedForm(id,f,'flux')))return 'Common';
    const s=state.synth,epic=.01+(s.level-1)*.012+(state.worlds.flux.mastered?.02:0),rare=.08+(s.level-1)*.035;
    let f=Math.random()<epic?'Epic':Math.random()<rare?'Rare':'Common';
    if(ownedForm(id,f,'flux'))f=FORMS.find(x=>!ownedForm(id,x,'flux'))||f;return f;
  }
  function renderSynthRecipes(){
    const root=$('#synthRecipes');if(!root)return;const s=state.synth;
    if(s.job){
      const m=M[s.job.id],cost=speedGemCost(s.job.end);root.innerHTML=`<article class="game-card synth-active"><div class="monster-preview">${monsterSVG(m,s.job.form)}</div><div class="eyebrow">SYNTHESIS ACTIVE</div><h3>${m.name} - ${s.job.form}</h3><div class="big-timer" id="synthTimer">${secText(s.job.end-now())}</div><p>Fluxworks uses the same scaling speed-up economy as late breeding. Long unstable syntheses can take hours.</p><div class="card-actions"><button class="secondary" id="finishSynthBtn">STABILIZE NOW - ${cost} GEM${cost===1?'':'S'}</button></div></article>`;
      $('#finishSynthBtn').onclick=()=>{const cost=speedGemCost(s.job.end);if(state.gems<cost){toast(`Need ${cost} Gems.`);return;}currency('gems',-cost);s.job.end=now();finishSynthJob();renderFluxMarket();renderTop();};return;
    }
    SYNTH_RECIPES.forEach(r=>{
      const m=M[r.id],locked=s.level<r.level,coreText=Object.entries(r.cores).map(([e,n])=>`${n} ${ELEMENT_LABELS[e]}`).join(' + '),bases=(r.base||[]).map(id=>M[id].name).join(' + ');
      const canCores=Object.entries(r.cores).every(([e,n])=>(s[e]||0)>=n),canBase=(r.base||[]).every(id=>!!ownedForm(id,'Common','flux')||!!ownedForm(id,'Rare','flux')||!!ownedForm(id,'Epic','flux')),canCrest=(r.crests||0)<=state.crests;
      const card=document.createElement('article');card.className='game-card';
      card.innerHTML=`<div class="monster-preview">${monsterSVG(m,'Common')}</div><div class="eyebrow">${m.elements.length===5?'QUINT':m.elements.length===4?'QUAD':'TRIPLE'} SYNTHESIS</div><h3>${m.name}</h3><p>${m.bio}</p><div class="notice">${bases?`Base: ${bases}<br>`:''}Cores: ${coreText}${r.crests?`<br>Crests: ${r.crests}`:''}<br>Stability time: ${r.time>=60?(r.time/60).toFixed(1)+' hr':r.time+' min'}</div><div class="card-actions"><button class="primary">${locked?`REQUIRES STABILITY ${r.level}`:canCores&&canBase&&canCrest?'SYNTHESIZE':`MISSING COMPONENTS`}</button></div>`;
      const b=card.querySelector('button');b.disabled=locked||!canCores||!canBase||!canCrest;b.onclick=()=>startSynth(r.id);root.appendChild(card);
    });
  }
  function startSynth(id){
    const s=state.synth,r=SYNTH_RECIPES.find(x=>x.id===id);if(!r||s.job||s.level<r.level)return;
    if(!Object.entries(r.cores).every(([e,n])=>(s[e]||0)>=n)){toast('Not enough attuned Cores.');return;}
    const bases=[];for(const bid of (r.base||[])){const o=state.owned.find(x=>x.id===bid&&x.home==='flux');if(!o){toast(`Need a ${M[bid].name} base on Fluxworks.`);return;}bases.push(o);}
    if(state.crests<(r.crests||0)){toast('Not enough Crests.');return;}
    Object.entries(r.cores).forEach(([e,n])=>s[e]-=n);bases.forEach(removeOwned);if(r.crests)currency('crests',-r.crests);
    const form=synthFormRoll(id);s.job={id,form,end:now()+r.time*60000};sfx('breed');save();renderFluxMarket();renderTop();
  }
  function finishSynthJob(){
    const s=state.synth;if(!s.job||s.job.end>now())return false;const j=s.job;if(ownedForm(j.id,j.form,'flux')){s.neutral+=M[j.id].elements.length;s.job=null;toast('Duplicate form destabilized into Blank Cores.');save();return true;}
    const o=makeOwned(j.id,j.form,'flux');state.owned.push(o);const ws=state.worlds.flux;if(ws.placed.length<castleBeds(ws.castle))ws.placed.push(o.uid);
    if(j.form==='Rare')state.stats.rare++;if(j.form==='Epic')state.stats.epic++;state.stats.synths=(state.stats.synths||0)+1;gainXP(M[j.id].elements.length*180);s.job=null;sfx('mastery');showDiscovery(j.id,j.form,'flux','SYNTHESIS COMPLETE');toast(`${M[j.id].name} ${j.form} stabilized.`);save();return true;
  }

  function renderBreed(){
    const k=state.currentWorld,ws=currentWS(),root=$('#modalBody');
    if(k==='flux'&&!visitActive(k)){root.innerHTML=`<div class="panel" style="max-width:760px;margin:auto"><div class="eyebrow">FLUXWORKS SYNTHESIS</div><h3>Ordinary breeding is disabled here.</h3><p>Fluxworks uses Attunement and Synthesis. During the ${SEASONAL_VISITS.flux.label} event, its Resonance Breeder opens for the limited ${M[SEASONAL_VISITS.flux.id].name} combination.</p><div class="card-actions"><button class="primary" id="fluxMarketBtn">OPEN ATTUNER + SYNTHESIS</button></div></div>`;$('#fluxMarketBtn').onclick=()=>openPanel('market');return;}
    if(k==='crown'&&!visitActive(k)){root.innerHTML=`<div class="panel" style="max-width:760px;margin:auto"><div class="eyebrow">CROWNFALL ATTUNEMENT</div><h3>The final islet normally uses the Resonator.</h3><p>During the ${SEASONAL_VISITS.crown.label} event, a special breeding duet opens for ${M[SEASONAL_VISITS.crown.id].name}. Outside that event, attune earlier performers through Crownfall Market and awaken Crownmaw.</p><div class="card-actions"><button class="primary" id="crownMarketBtn">OPEN CROWNFALL MARKET</button></div></div>`;$('#crownMarketBtn').onclick=()=>openPanel('market');return;}
    if(ws.breed){renderBreedJob(ws.breed);return;}
    if(ws.nursery){renderNursery(ws.nursery);return;}
    const candidates=state.owned.filter(o=>o.home===k&&o.level>=4);
    const base=BREED_BASE_MINUTES[k]||45,visit=SEASONAL_VISITS[k],eventLive=visit&&visitActive(k);
    root.innerHTML=`<div class="two-col"><section class="panel"><h3>${k==='seasonal'?'Festival Breeding Hall':k==='flux'||k==='crown'?'Limited Event Breeder':'Breeding structure'}</h3><p>${k==='seasonal'?'Combine the permanent Festival Ensemble and previously discovered seasonals. All fourteen holiday recipes remain open here year-round.':k==='flux'||k==='crown'?`This breeder exists only for the active ${visit.label} visitor. The seasonal is deliberately difficult and cannot be bought.`:'Choose two level 4 or higher performers. Breeding can fail, later worlds are harder, and rare results take longer.'}</p><div class="statline"><span>World difficulty</span><b>${WORLDS[k].difficulty}/10</b></div><div class="statline"><span>Event visitor</span><b>${eventLive?`${M[visit.id].name} LIVE`:(visit?'DORMANT':'SEASONAL ISLAND - ALWAYS OPEN')}</b></div><div class="breeder-slots"><div class="breeder-slot" id="breedA">SELECT FIRST</div><b class="breeder-plus">+</b><div class="breeder-slot" id="breedB">SELECT SECOND</div></div><div class="possible-results" id="breedPrediction"><div class="notice gold">Select two compatible performers to reveal every possible outcome.</div></div><div class="card-actions"><button class="primary" id="startBreedBtn">START BREEDING</button></div></section><section class="panel"><h3>Eligible performers</h3><div class="card-grid" id="breedGrid"></div></section></div>`;
    const grid=$('#breedGrid');
    if(!candidates.length)grid.innerHTML='<div class="notice">Feed a performer to level 4 before it can breed.</div>';
    candidates.forEach(o=>{const m=M[o.id],card=document.createElement('article');card.className='game-card breeder-choice';card.innerHTML=`<div class="monster-preview">${monsterSVG(m,o.form)}</div><h3>${m.name}</h3><div class="tags"><span class="tag ${o.form.toLowerCase()}">${o.form}</span>${m.elements.map(e=>`<span class="tag">${ELEMENT_LABELS[e]}</span>`).join('')}</div><div class="card-actions"><button class="secondary">SELECT</button></div>`;card.querySelector('button').onclick=()=>selectBreeder(o.uid);grid.appendChild(card);});
    $('#startBreedBtn').onclick=startBreed;updateBreedUI();
  }

  function selectBreeder(id){
    if(breedPick.includes(id))breedPick=breedPick.filter(x=>x!==id);
    else if(breedPick.length<2)breedPick.push(id);
    else breedPick=[breedPick[1],id];
    updateBreedUI();
  }
  function breedPlan(){
    if(breedPick.length<2)return null;const a=state.owned.find(o=>o.uid===breedPick[0]),b=state.owned.find(o=>o.uid===breedPick[1]);if(!a||!b||a.uid===b.uid)return null;
    const k=state.currentWorld,pair=[a.id,b.id].sort().join('|');
    if(k==='seasonal'){const id=festivalTargetFromPair(a.id,b.id);return id?{mode:'festival',target:id,a,b}:null;}
    if((k==='flux'||k==='crown')){const v=SEASONAL_VISITS[k];return v&&visitActive(k)&&visitPairMatches(k,a.id,b.id)?{mode:'visitOnly',target:v.id,visit:v,a,b}:null;}
    const normal=COMBO[comboKey([...M[a.id].elements,...M[b.id].elements])],validNormal=normal&&WORLDS[k].roster.includes(normal)?normal:null;
    const v=SEASONAL_VISITS[k],seasonal=v&&visitActive(k)&&visitPairMatches(k,a.id,b.id)?v:null;
    return validNormal?{mode:'normal',target:validNormal,visit:seasonal,a,b}:null;
  }
  function formOdds(k,seasonal=false){
    const torch=activeTorches(k).length;
    if(seasonal){
      // Post-Transcendent balance patch: Rare/Epic seasonals are still special, but no longer brutally rare.
      const epic=.010+torch*.0015+(k==='seasonal'?.005:0),rare=.070+torch*.0045+(k==='seasonal'?.020:0);
      return {Epic:epic,Rare:rare,Common:Math.max(0,1-epic-rare)};
    }
    const epic=.018+torch*.0025+(state.worlds.moon.mastered?.012:0)+Math.min(.06,state.epicPity*(state.worlds.thistle.mastered?.004:.002));const rare=.075+torch*.008+(state.worlds.moon.mastered?.02:0);return {Epic:epic,Rare:rare,Common:Math.max(0,1-epic-rare)};
  }
  function rollForm(k,seasonal=false){const o=formOdds(k,seasonal),r=Math.random();if(r<o.Epic){state.epicPity=0;state.stats.epic++;return 'Epic';}if(r<o.Epic+o.Rare){state.epicPity++;state.stats.rare++;return 'Rare';}state.epicPity++;return 'Common';}
  function festivalBreedChance(id){const pair=FESTIVAL_RECIPES[id]||[],seasonalParents=pair.filter(x=>M[x]?.seasonal).length;const base=seasonalParents>=2?.14:seasonalParents===1?.19:.28;return clamp(base+(state.worlds.seasonal.mastered?.025:0),base,.34);}
  function seasonalIslandMinutes(id,form){const pair=FESTIVAL_RECIPES[id]||[],tier=pair.filter(x=>M[x]?.seasonal).length,base=110+tier*125,rarity=form==='Epic'?1.55:form==='Rare'?1.25:1;return Math.min(600,Math.round(base*rarity));}
  function resultTile(id,form,pct,label=''){const m=M[id];return `<div class="possible-card ${form.toLowerCase()} ${m.seasonal?'seasonal-result':''}"><div class="mini-monster">${monsterSVG(m,form)}</div><b>${m.name}</b><span>${form}${label?` - ${label}`:''}</span><strong>${Math.max(.1,pct).toFixed(pct<1?1:0)}%</strong></div>`;}
  function updateBreedUI(){
    if(!$('#breedA'))return;['breedA','breedB'].forEach((id,i)=>{const o=state.owned.find(x=>x.uid===breedPick[i]);$('#'+id).innerHTML=o?`${monsterSVG(M[o.id],o.form)}<b>${M[o.id].name}</b><small>${o.form}</small>`:(i?'SELECT SECOND':'SELECT FIRST');if(o){const svg=$('#'+id+' svg');if(svg){svg.style.width='75px';svg.style.height='75px';}}});
    const pred=$('#breedPrediction');if(!pred)return;const plan=breedPlan();if(!plan){pred.innerHTML='<div class="notice gold">No valid recipe yet. On normal worlds, the parents must combine into a species in this world. Event seasonals use the recipe shown in Market.</div>';return;}
    const k=state.currentWorld,o=formOdds(k,plan.mode!=='normal'),tiles=[];let success=0,fail=0;
    if(plan.mode==='festival'){success=festivalBreedChance(plan.target);fail=1-success;FORMS.forEach(f=>tiles.push(resultTile(plan.target,f,success*o[f]*100,'SEASONAL')));}
    else if(plan.mode==='visitOnly'){success=seasonalVisitChance(k);fail=1-success;FORMS.forEach(f=>tiles.push(resultTile(plan.target,f,success*o[f]*100,'LIMITED')));}
    else {const eventChance=plan.visit?seasonalVisitChance(k):0,normalSuccess=(1-eventChance)*breedSuccessChance(k,plan.target);fail=Math.max(0,1-eventChance-normalSuccess);if(plan.visit){const so=formOdds(k,true);FORMS.forEach(f=>tiles.push(resultTile(plan.visit.id,f,eventChance*so[f]*100,'LIMITED')));}const no=formOdds(k,false);FORMS.forEach(f=>tiles.push(resultTile(plan.target,f,normalSuccess*no[f]*100)));}
    tiles.push(resultTile(plan.a.id,'Common',fail*50,'FAIL'));tiles.push(resultTile(plan.b.id,'Common',fail*50,'FAIL'));
    const targetWait=plan.mode==='festival'?seasonalIslandMinutes(plan.target,'Common'):plan.mode==='visitOnly'?seasonalBreedMinutes(k,'Common'):breedMinutes(k,plan.target,'Common');pred.innerHTML=`<div class="prediction-head"><span><b>Possible monsters</b><small>Odds include form rarity and failure paths.</small></span><b>${targetWait>=60?(targetWait/60).toFixed(1)+' hr':'~'+targetWait+' min'} featured wait</b></div><div class="result-strip">${tiles.join('')}</div>`;
  }
  function predictedBreed(){return breedPlan()?.target||null;}
  function startBreed(){
    const k=state.currentWorld,ws=currentWS(),plan=breedPlan();if(!plan){toast('Those performers do not make a valid result here.');sfx('bad');return;}const a=plan.a,b=plan.b;let id=plan.target,form='Common',success=false,eventSeasonal=false;
    if(plan.mode==='festival'){success=Math.random()<festivalBreedChance(id);if(success){form=rollForm(k,true);eventSeasonal=true;}}
    else if(plan.mode==='visitOnly'){success=Math.random()<seasonalVisitChance(k);if(success){form=rollForm(k,true);eventSeasonal=true;}}
    else {if(plan.visit&&Math.random()<seasonalVisitChance(k)){id=plan.visit.id;form=rollForm(k,true);success=true;eventSeasonal=true;}else{success=Math.random()<breedSuccessChance(k,plan.target);if(success)form=rollForm(k,false);}}
    if(!success){const parent=Math.random()<.5?a:b;id=parent.id;form='Common';state.stats.failedBreeds++;}
    const minutes=success&&M[id].seasonal?(k==='seasonal'?seasonalIslandMinutes(id,form):seasonalBreedMinutes(k,form)):breedMinutes(k,id,form);
    ws.breed={id,form,target:plan.target,failed:!success,eventSeasonal,successChance:success?1:0,end:now()+minutes*60000,started:now(),parents:[a.id,b.id]};state.stats.breeds++;gainXP(45+(M[plan.target]?.elements.length||1)*35);breedPick=[];sfx('breed');save();renderBreed();
  }
  function renderBreedJob(job){
    const root=$('#modalBody'),left=Math.max(0,job.end-now()),done=left<=0,cost=speedGemCost(job.end),failed=!!job.failed;
    const visual=done?`<div class="monster-preview" style="height:220px">${monsterSVG(M[job.id],job.form)}</div>`:'<div class="mystery-egg"><i></i><b>?</b></div>';
    root.innerHTML=`<div class="panel" style="max-width:680px;margin:auto;text-align:center">${visual}<div class="eyebrow">${done?(failed?'BREED FAILED':'BREEDING SUCCESS'):'BREEDING IN PROGRESS'}</div><h3>${done?`${failed?'Returned':'Discovered'} ${M[job.id].name} - ${job.form}`:'Result hidden until completion'}</h3><div class="timer" id="jobTimer">${done?'READY':secText(left)}</div><p>${done?(failed?'The target combination failed. One parent returned as a Common egg.':'The combination succeeded. Move the egg into the Nursery.'):'Later worlds take longer and fail more often. Closing the game will not pause the timer.'}</p><div class="card-actions"><button class="primary" id="claimBreedBtn">${done?'MOVE TO NURSERY':`FINISH FOR ${cost} GEM${cost===1?'':'S'}`}</button></div></div>`;
    $('#claimBreedBtn').onclick=()=>{if(done)moveToNursery();else finishBreed();};
  }
  function finishBreed(){const ws=currentWS(),cost=speedGemCost(ws.breed.end);if(state.gems<cost){toast(`You need ${cost} Gems.`);return;}currency('gems',-cost);ws.breed.end=now();save();renderBreed();renderTop();}
  function moveToNursery(){
    const k=state.currentWorld,ws=currentWS(),j=ws.breed;if(!j||j.end>now())return;
    const speed=state.worlds.glass.mastered ? .9 : 1,minutes=Math.max(3,Math.round(nurseryMinutes(k,j.id,j.form)*speed));
    ws.nursery={id:j.id,form:j.form,failed:!!j.failed,end:now()+minutes*60000};ws.breed=null;sfx('hatch');save();renderBreed();
  }
  function renderNursery(job){
    const root=$('#modalBody'),left=Math.max(0,job.end-now()),done=left<=0,cost=speedGemCost(job.end);
    root.innerHTML=`<div class="panel" style="max-width:680px;margin:auto;text-align:center"><div class="monster-preview" style="height:220px">${monsterSVG(M[job.id],job.form)}</div><div class="eyebrow">NURSERY</div><h3>${M[job.id].name} - ${job.form}</h3><div class="timer" id="jobTimer">${done?'READY TO HATCH':secText(left)}</div><p>${done?'Hatch the performer into your collection.':'The egg is resonating in the Nursery. Longer species also require longer incubation.'}</p><div class="card-actions"><button class="primary" id="hatchBtn">${done?'HATCH':`FINISH FOR ${cost} GEM${cost===1?'':'S'}`}</button></div></div>`;
    $('#hatchBtn').onclick=()=>{if(done)hatchNursery();else finishNursery();};
  }
  function finishNursery(){const ws=currentWS(),cost=speedGemCost(ws.nursery.end);if(state.gems<cost){toast(`You need ${cost} Gems.`);return;}currency('gems',-cost);ws.nursery.end=now();save();renderBreed();renderTop();}
  function hatchNursery(){
    const k=state.currentWorld,ws=currentWS(),j=ws.nursery;if(!j||j.end>now())return;
    ws.nursery=null;
    if(ownedForm(j.id,j.form,k)){
      const r=j.form==='Epic'?32:j.form==='Rare'?12:4;currency('resonance',r);toast(`Duplicate ${j.form} converted into ${r} Resonance.`);sfx('coin');
    }else{
      const o=makeOwned(j.id,j.form,k);state.owned.push(o);
      if(ws.placed.length<castleBeds(ws.castle))ws.placed.push(o.uid);
      if(M[j.id].seasonal)state.stats.seasonals=(state.stats.seasonals||0)+1;
      const bonus=j.form==='Epic'?140:j.form==='Rare'?65:25;currency('resonance',bonus);gainXP(70+bonus);sfx('hatch');showDiscovery(j.id,j.form,k,M[j.id].seasonal?'SEASONAL DISCOVERED':'NEW PERFORMER');toast(`${M[j.id].name} ${j.form} joined ${WORLDS[k].name}.`);
    }
    save();renderAll();renderBreed();
  }

  function renderCollection(){
    const k=state.currentWorld,root=$('#modalBody'),w=WORLDS[k];
    root.innerHTML=`<div class="form-tabs">${FORMS.map(f=>`<button data-form="${f}" class="${f===formFilter?'active':''}">${f.toUpperCase()}</button>`).join('')}</div><div class="notice">Rares and Epics change anatomy, silhouette details and instrument hardware. They are not simple palette swaps.</div><div class="card-grid" id="collectionGrid" style="margin-top:10px"></div>`;
    $$('.form-tabs button',root).forEach(b=>b.onclick=()=>{formFilter=b.dataset.form;renderCollection();});
    const grid=$('#collectionGrid');
    w.roster.forEach(id=>{
      const m=M[id],o=ownedForm(id,formFilter,k),card=document.createElement('article');card.className='game-card'+(o?'':' locked');
      card.innerHTML=`<div class="monster-preview" style="${o?'':'filter:brightness(0)'}">${monsterSVG(m,formFilter)}</div><h3>${o?m.name:'Undiscovered'}</h3><p>${o?m.bio:'Breed and explore to discover this form.'}</p><div class="rarity-book">${FORMS.map(f=>`<div class="book-cell ${ownedForm(id,f,k)?'got':''}">${f}</div>`).join('')}</div>${o?`<div class="card-actions"><button class="secondary">DETAILS</button></div>`:''}`;
      if(o)card.querySelector('button').onclick=()=>openMonster(o.uid);grid.appendChild(card);
    });
  }

  function openMonster(id){
    const o=state.owned.find(x=>x.uid===id);if(!o)return;
    currentPanel='monster:'+id;openModal(M[o.id].name,'PERFORMER');renderMonsterDetail(o);
  }
  function renderMonsterDetail(o){
    const m=M[o.id],root=$('#modalBody'),ws=state.worlds[o.home],placed=ws.placed.includes(o.uid);
    const feedCost=Math.floor(90*Math.pow(o.level,1.55));
    root.innerHTML=`<div class="two-col"><section class="panel" style="text-align:center"><div class="monster-preview" style="height:320px">${monsterSVG(m,o.form)}</div><h3>${m.name} - ${o.form}</h3><div class="tags" style="justify-content:center">${m.elements.map(e=>`<span class="tag">${ELEMENT_LABELS[e]}</span>`).join('')}<span class="tag">${m.sound}</span></div><p>${m.bio}</p></section><section class="panel"><h3>Performer controls</h3><div class="statline"><span>Level</span><b>${o.level}/${MAX_LEVEL}</b></div><div class="statline"><span>Income per hour</span><b>${fmt(incomePerHour(o))} Coins</b></div><div class="statline"><span>Home</span><b>${WORLDS[o.home].name}</b></div><div class="card-actions"><button class="primary" id="feedBtn">${o.level>=MAX_LEVEL?'MAX LEVEL':`FEED ${fmt(feedCost)} COINS`}</button><button class="secondary" id="placeBtn">${placed?'REMOVE FROM STAGE':'PLACE ON STAGE'}</button></div><div class="field-row"><label>Part volume</label><div class="range-wrap"><input type="range" id="monsterVol" min="0" max="200" value="${o.volume}"><span class="range-value" id="monsterVolVal">${o.volume}%</span></div></div><div class="card-actions"><button class="secondary" id="muteBtn">${o.muted?'UNMUTE PART':'MUTE PART'}</button></div></section></div>`;
    $('#feedBtn').onclick=()=>{if(o.level>=MAX_LEVEL)return;if(state.coins<feedCost){toast('Not enough Coins.');return;}currency('coins',-feedCost);o.level++;gainXP(15+o.level*4);sfx('feed');save();renderTop();renderMonsterDetail(o);renderWorld();};
    $('#placeBtn').onclick=()=>togglePlacement(o);
    $('#muteBtn').onclick=()=>{o.muted=!o.muted;save();renderMonsterDetail(o);renderWorld();};
    $('#monsterVol').oninput=e=>{o.volume=+e.target.value;$('#monsterVolVal').textContent=o.volume+'%';save();};
  }
  function togglePlacement(o){
    const ws=state.worlds[o.home],i=ws.placed.indexOf(o.uid);
    if(i>=0)ws.placed.splice(i,1);
    else{if(ws.placed.length>=castleBeds(ws.castle)){toast('No free Castle beds.');return;}ws.placed.push(o.uid);}
    save();renderMonsterDetail(o);renderWorld();
  }

  function goalProgress(g){
    if(g.type==='owned')return state.owned.length;
    if(g.type==='hybrid')return state.owned.filter(o=>M[o.id].elements.length>1).length;
    if(g.type==='rare')return state.owned.filter(o=>o.form==='Rare').length;
    if(g.type==='epic')return state.owned.filter(o=>o.form==='Epic').length;
    if(g.type==='fullworld')return Object.keys(WORLDS).filter(k=>commonComplete(k)).length;
    if(g.type==='world')return state.unlocked.includes(g.world)?1:0;
    if(g.type==='species')return state.owned.some(o=>o.id===g.species)?1:0;
    if(g.type==='scratch')return state.stats.scratches||0;
    if(g.type==='synth')return state.stats.synths||0;
    if(g.type==='seasonal')return state.owned.filter(o=>M[o.id]?.seasonal).length;
    if(g.type==='mastered')return Object.values(state.worlds).filter(w=>w.mastered).length;
    return 0;
  }
  function commonComplete(k){return WORLDS[k].roster.every(id=>id==='crownmaw'?!!ownedForm(id,'Common',k):!!ownedForm(id,'Common',k));}
  function canMaster(k){return commonComplete(k)&&songPower(k)>=worldPowerTarget(k);}
  function renderGoals(){
    const k=state.currentWorld,root=$('#modalBody'),ws=state.worlds[k];
    root.innerHTML=`<div class="two-col"><section class="panel"><h3>World mastery</h3><p>${WORLDS[k].reward}</p><div class="notice ${canMaster(k)?'gold':''}">${commonComplete(k)?'Common roster complete.':'Complete every Common in this world.'} Song power: ${fmt(songPower(k))}/${fmt(worldPowerTarget(k))}.</div><div class="card-actions"><button class="primary" id="masterBtn">${ws.mastered?'MASTERED':canMaster(k)?'CLAIM MASTERY':'NOT READY'}</button></div></section><section class="panel"><h3>Long goals</h3><div id="goalList"></div></section></div>`;
    $('#masterBtn').onclick=()=>claimMastery(k);
    const list=$('#goalList');
    DEFAULT_GOALS.forEach(g=>{
      const p=goalProgress(g),done=p>=g.n,claimed=state.goalClaims.includes(g.id),row=document.createElement('div');row.className='goal-row '+(done?'complete':'');
      row.innerHTML=`<div><strong>${g.title}</strong><p>${g.text} Progress ${Math.min(p,g.n)}/${g.n}</p></div><button class="mini-btn">${claimed?'CLAIMED':done?'CLAIM':'LOCKED'}</button>`;
      const b=row.querySelector('button');b.disabled=claimed||!done;b.onclick=()=>claimGoal(g);list.appendChild(row);
    });
  }
  function claimGoal(g){
    if(state.goalClaims.includes(g.id)||goalProgress(g)<g.n)return;
    state.goalClaims.push(g.id);Object.entries(g.reward).forEach(([k,v])=>k==='xp'?gainXP(v):currency(k,v));sfx('goal');save();renderAll();renderGoals();
  }
  function claimMastery(k){
    const ws=state.worlds[k];if(ws.mastered||!canMaster(k)){toast('Mastery requirements are not complete.');return;}
    ws.mastered=true;currency('crests',WORLDS[k].difficulty>=7?3:1);currency('resonance',35+WORLDS[k].difficulty*8);gainXP(250+WORLDS[k].difficulty*120);sfx('mastery');toast(`${WORLDS[k].name} mastered. Its permanent reward is active.`);save();renderAll();renderGoals();
  }

  const WORLD_ORDER=['meadow','glass','moon','seasonal','gear','storm','thistle','flux','crown'];
  function renderMap(){
    const root=$('#modalBody');
    root.innerHTML=`<div class="notice">The three late-game showpieces are Stormforge Crag, Thistledrone Islet and Crownfall Islet. They have dedicated arrangements and permanent mastery rewards.</div><div class="world-grid" id="worldGrid" style="margin-top:10px"></div>`;
    const grid=$('#worldGrid');
    WORLD_ORDER.forEach(k=>{
      const w=WORLDS[k],unlocked=state.unlocked.includes(k),card=document.createElement('article');card.className='world-card'+(unlocked?'':' locked');
      card.style.setProperty('--world-bg',`linear-gradient(145deg,${w.colors[0]},${w.colors[2]})`);
      const complete=worldRosterOwned(k).length;
      card.innerHTML=`<div class="eyebrow">${w.type} | DIFFICULTY ${w.difficulty}/10</div><h3>${w.name}</h3><p>${w.desc}</p><div class="statline"><span>Common roster</span><b>${complete}/${w.roster.length}</b></div><div class="statline"><span>Mastery</span><b>${state.worlds[k].mastered?'COMPLETE':'INCOMPLETE'}</b></div><div class="card-actions"><button class="primary">${unlocked?(k===state.currentWorld?'CURRENT':'TRAVEL'):`UNLOCK L${w.unlockLevel}`}</button></div>${!unlocked?`<p style="margin-top:7px">${fmt(w.unlockCost)} Coins${w.crestCost?` + ${w.crestCost} Crests`:''}</p>`:''}`;
      card.querySelector('button').onclick=()=>unlocked?travel(k):unlockWorld(k);grid.appendChild(card);
    });
  }
  function unlockWorld(k){
    const w=WORLDS[k];if(state.unlocked.includes(k)){travel(k);return;}
    const gated=(k==='storm'&&!state.worlds.gear.mastered)||(k==='thistle'&&!state.worlds.storm.mastered)||(k==='flux'&&!state.worlds.thistle.mastered)||(k==='crown'&&!state.worlds.flux.mastered);
    if(gated){const need=k==='storm'?'Gearwake Islet':k==='thistle'?'Stormforge Crag':k==='flux'?'Thistledrone Islet':'Fluxworks Islet';toast(`Master ${need} first.`);return;}
    if(state.level<w.unlockLevel){toast(`Reach level ${w.unlockLevel} first.`);return;}
    if(state.coins<w.unlockCost){toast('Not enough Coins.');return;}
    if(state.crests<w.crestCost){toast('Not enough Crests. Master earlier worlds and goals.');return;}
    currency('coins',-w.unlockCost);currency('crests',-w.crestCost);state.unlocked.push(k);state.currentWorld=k;gainXP(120+w.difficulty*60);sfx('unlock');save();stopSong();renderAll();renderMap();
  }
  function travel(k){state.currentWorld=k;stopSong();save();closeModal();renderAll();}

  const WHEEL_PRIZES=[
    {label:'2,500 Coins',short:'2.5K COINS',coins:2500,w:24},
    {label:'10 Gems',short:'10 GEMS',gems:10,w:16},
    {label:'25 Resonance',short:'25 RES',resonance:25,w:16},
    {label:'9,000 Coins',short:'9K COINS',coins:9000,w:14},
    {label:'25 Gems',short:'25 GEMS',gems:25,w:10},
    {label:'80 Resonance',short:'80 RES',resonance:80,w:9},
    {label:'3 Crests',short:'3 CRESTS',crests:3,w:6},
    {label:'JACKPOT: 250,000 Coins + 250 Gems + 1,000 Resonance + 25 Crests',short:'JACKPOT',coins:250000,gems:250,resonance:1000,crests:25,w:5,jackpot:true}
  ];
  function weightedPrize(list){const sum=list.reduce((a,p)=>a+p.w,0);let r=Math.random()*sum;for(const p of list){r-=p.w;if(r<=0)return p;}return list[list.length-1];}
  function renderArcade(){
    const root=$('#modalBody'),free=state.daily.wheel!==today(),ticket=state.scratchTicket;
    root.innerHTML=`<div class="two-col"><section class="panel" style="text-align:center"><h3>Resonance Wheel</h3><p>Eight labeled wedges, a fixed pointer, and a true 5 percent jackpot. Paid rerolls cost 2 Gems.</p><div class="wheel-wrap"><div class="wheel-pointer"></div><div class="wheel" id="wheel">${WHEEL_PRIZES.map((p,i)=>`<span class="wheel-label ${p.jackpot?'jackpot-label':''}" style="--i:${i}">${p.short}</span>`).join('')}<div class="wheel-hub">CW</div></div></div><div class="card-actions"><button class="primary" id="spinBtn">${free?'FREE DAILY SPIN':'SPIN FOR 2 GEMS'}</button></div><div class="big-reward" id="wheelResult"></div></section><section class="panel scratch-panel"><div class="scratch-head"><div><div class="eyebrow">MONSTER SCRATCH</div><h3>${ticket?`${WORLDS[ticket.world].name} ${ticketTier(ticket.tier||'standard').name}`:'Five ticket tiers'}</h3></div><span class="scratch-cost">STANDARD TO TRANSCENDENT</span></div><p>Scratch all nine panels. Seasonal odds rise from 0.25 percent on Standard to 30 percent on Transcendent. Ultimate and Transcendent are premium cooldown tickets with dramatically stronger Rare/Epic form odds. Scratch seasonals ignore event dates.</p><div id="scratchArea"></div></section></div>`;
    $('#spinBtn').onclick=spinWheel;renderScratchArea();
  }
  function applyPrize(p){['coins','gems','resonance','crests'].forEach(k=>{if(p[k])currency(k,p[k]);});}
  function spinWheel(){
    const free=state.daily.wheel!==today();if(!free&&state.gems<2){toast('You need 2 Gems for another spin.');return;}const btn=$('#spinBtn');if(btn.disabled)return;btn.disabled=true;if(!free)currency('gems',-2);else state.daily.wheel=today();
    const p=weightedPrize(WHEEL_PRIZES),idx=WHEEL_PRIZES.indexOf(p),current=((wheelRotation%360)+360)%360,jitter=(Math.random()*16-8),center=-idx*45,desired=((center+jitter)%360+360)%360,delta=(desired-current+360)%360;wheelRotation+=1800+delta;$('#wheel').style.transform=`rotate(${wheelRotation}deg)`;
    setTimeout(()=>{applyPrize(p);sfx(p.jackpot?'mastery':'coin');const r=$('#wheelResult');r.textContent=p.label;r.classList.toggle('jackpot-win',!!p.jackpot);save();renderTop();btn.textContent='SPIN FOR 2 GEMS';btn.disabled=false;},2400);
  }
  const SCRATCH_TIERS={
    standard:{name:'Standard Ticket',seasonal:.0025,top:.02,monster:.55,rareMult:1,epicMult:1,cooldown:0,skipCost:6,mode:'normal'},
    grand:{name:'Grand Ticket',seasonal:.01,top:.035,monster:.62,rareMult:1.25,epicMult:1.25,cooldown:3*86400000,skipCost:16,mode:'cooldown'},
    supreme:{name:'Supreme Ticket',seasonal:.03,top:.10,monster:.67,rareMult:2,epicMult:2,cooldown:10*86400000,skipCost:35,mode:'cooldown'},
    ultimate:{name:'Ultimate Ticket',seasonal:.10,top:.20,monster:.65,rareChance:.80,epicChance:.20,cooldown:14*86400000,skipCost:60,mode:'cooldown'},
    transcendent:{name:'Transcendent Ticket',seasonal:.30,top:.30,monster:.38,rareChance:.60,epicChance:.35,cooldown:21*86400000,skipCost:100,mode:'cooldown'}
  };
  function ticketTier(t){return SCRATCH_TIERS[t]||SCRATCH_TIERS.standard;}
  function cooldownLeft(tier){const cfg=ticketTier(tier);if(!cfg.cooldown)return 0;const last=state.scratchCooldowns?.[tier]||0;return Math.max(0,last+cfg.cooldown-now());}
  function cooldownLabel(ms){if(ms<=0)return 'READY';const h=Math.ceil(ms/3600000),d=Math.floor(h/24),r=h%24;return d>0?`${d}d ${r}h`:`${h}h`;}
  function scratchFormRoll(seasonal=false,tier='standard'){
    const cfg=ticketTier(tier),r=Math.random();
    // Ultimate: every monster is Rare or Epic. Transcendent: 95% Rare-or-better overall.
    // For their seasonal jackpot specifically, both top tickets guarantee Rare/Epic as requested.
    if(tier==='ultimate')return r<.20?'Epic':'Rare';
    if(tier==='transcendent'){
      if(seasonal)return r<.35?'Epic':'Rare';
      if(r<.35)return 'Epic';if(r<.95)return 'Rare';return 'Common';
    }
    const baseEpic=seasonal?.02:.03,baseRare=seasonal?.12:.18;
    const epic=Math.min(.18,baseEpic*cfg.epicMult),rare=Math.min(.58,baseRare*cfg.rareMult);
    if(r<epic)return 'Epic';if(r<epic+rare)return 'Rare';return 'Common';
  }
  function scratchSeasonal(k){
    // Scratch tickets intentionally ignore live event dates. Breeding remains event-gated.
    if(k==='seasonal'){const a=WORLDS.seasonal.roster.filter(id=>M[id]?.seasonal);return a[Math.floor(Math.random()*a.length)]||null;}
    const v=SEASONAL_VISITS[k];return v?v.id:null;
  }
  function scratchTopTier(k){const roster=WORLDS[k].roster.filter(id=>M[id]&&!M[id].festivalStarter),quads=roster.filter(id=>M[id].elements.length===4&&!M[id].seasonal);if(quads.length)return quads[Math.floor(Math.random()*quads.length)];const ranked=roster.filter(id=>!M[id].seasonal).sort((a,b)=>M[b].elements.length-M[a].elements.length);return ranked[0]||null;}
  function scratchOtherMonster(k){if(k==='seasonal'){const starters=WORLDS[k].roster.filter(id=>M[id]?.festivalStarter);return starters[Math.floor(Math.random()*starters.length)]||null;}const roster=WORLDS[k].roster.filter(id=>M[id]&&!M[id].seasonal&&!M[id].festivalStarter&&M[id].id!=='crownmaw');const pool=roster.length?roster:WORLDS[k].roster.filter(id=>M[id]&&!M[id].festivalStarter);return pool[Math.floor(Math.random()*pool.length)]||null;}
  function makeScratchPrize(k,tier='standard'){
    const cfg=ticketTier(tier),r=Math.random();let id=null,labelTier='';
    if(r<cfg.seasonal){id=scratchSeasonal(k);labelTier='SEASONAL';}
    else if(r<cfg.seasonal+cfg.top){id=scratchTopTier(k);labelTier='TOP-TIER';}
    else if(r<cfg.seasonal+cfg.top+cfg.monster){id=scratchOtherMonster(k);labelTier='MONSTER';}
    if(id){const form=scratchFormRoll(!!M[id].seasonal,tier);return {kind:'monster',id,form,world:k,tier:labelTier,label:`${form} ${M[id].name}`,rarity:form.toLowerCase()};}
    const used=cfg.seasonal+cfg.top+cfg.monster,cr=(r-used)/Math.max(.0001,1-used);
    if(cr<.28){const pool=tier==='transcendent'?[100,160,240,350]:tier==='ultimate'?[60,90,140,220]:tier==='supreme'?[18,25,35,55,80]:tier==='grand'?[10,16,24,36,50]:[4,6,8,12,20],gems=pool[Math.floor(Math.random()*pool.length)];return {kind:'currency',label:`${gems} Gems`,gems,rarity:gems>=100?'jackpot':'resource'};}
    if(cr<.52){const pool=tier==='transcendent'?[350,550,800,1200]:tier==='ultimate'?[220,350,550,800]:tier==='supreme'?[90,140,220,350]:tier==='grand'?[55,90,140,220]:[20,35,55,90],res=pool[Math.floor(Math.random()*pool.length)];return {kind:'currency',label:`${res} Resonance`,resonance:res,rarity:res>=550?'jackpot':'resource'};}
    if(cr<.82){const pool=tier==='transcendent'?[120000,180000,260000,400000]:tier==='ultimate'?[70000,120000,180000,260000]:tier==='supreme'?[26000,45000,70000,120000]:tier==='grand'?[14000,26000,45000,70000]:[4500,8000,14000,26000],coins=pool[Math.floor(Math.random()*pool.length)];return {kind:'currency',label:`${fmt(coins)} Coins`,coins,rarity:coins>=120000?'jackpot':'resource'};}
    const crests=tier==='transcendent'?(Math.random()<.5?12:9):tier==='ultimate'?(Math.random()<.45?9:7):tier==='supreme'?(Math.random()<.35?6:Math.random()<.6?4:3):tier==='grand'?(Math.random()<.3?4:Math.random()<.6?3:2):(Math.random()<.22?3:Math.random()<.5?2:1);
    return {kind:'currency',label:`${crests} Crest${crests===1?'':'s'}`,crests,rarity:'jackpot'};
  }
  function scratchDecoys(prize){const labels=['8 GEMS','40 RES','12K COINS','1 CREST','RARE MONSTER','EPIC MONSTER','QUAD','BONUS'];return labels.filter(x=>!prize.label.toUpperCase().includes(x.split(' ')[0]));}
  function ticketButtonLabel(tier){
    const cfg=ticketTier(tier);
    if(tier==='standard'){const free=state.daily.scratch!==today();return free?'CLAIM FREE TICKET':'BUY TICKET - 6 GEMS';}
    const left=cooldownLeft(tier);
    return left<=0?'CLAIM READY TICKET':`SKIP ${cooldownLabel(left)} - ${cfg.skipCost} GEMS`;
  }
  function ticketCanCreate(tier){
    const cfg=ticketTier(tier);
    if(tier==='standard')return state.daily.scratch!==today()||state.gems>=6;
    return cooldownLeft(tier)<=0||state.gems>=cfg.skipCost;
  }
  function createScratchTicket(tier='standard'){
    const cfg=ticketTier(tier);
    if(tier==='standard'){
      const free=state.daily.scratch!==today();if(!free&&state.gems<6){toast('You need 6 Gems for another Standard Ticket.');return;}if(!free)currency('gems',-6);else state.daily.scratch=today();
    }else{
      const left=cooldownLeft(tier);if(left>0){if(state.gems<cfg.skipCost){toast(`You need ${cfg.skipCost} Gems to skip the ${cfg.name} wait.`);return;}currency('gems',-cfg.skipCost);}state.scratchCooldowns[tier]=now();
    }
    const k=state.currentWorld,prize=makeScratchPrize(k,tier),winLabel=prize.label.toUpperCase(),decoys=scratchDecoys(prize),tiles=[];
    for(let i=0;i<3;i++)tiles.push({label:winLabel,win:true});for(let i=3;i<9;i++)tiles.push({label:decoys[(i-3)%decoys.length]||'BONUS',win:false});for(let i=tiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]];}
    state.scratchTicket={world:k,tier,prize,tiles,revealed:[],claimed:false};save();renderArcade();renderTop();
  }
  function ticketCard(tier){
    const cfg=ticketTier(tier),left=tier==='standard'?0:cooldownLeft(tier),ready=tier==='standard'?state.daily.scratch!==today():left<=0;
    const seasonal=(cfg.seasonal*100).toFixed(cfg.seasonal<.01?2:0),top=(cfg.top*100).toFixed(cfg.top<.1?1:0);
    const rare=tier==='ultimate'?80:tier==='transcendent'?60:Math.round((.18*cfg.rareMult)*100);
    const epic=tier==='ultimate'?20:tier==='transcendent'?35:Math.round((.03*cfg.epicMult)*100);
    const copy=tier==='standard'?'One free daily, then 6 Gems each.':tier==='grand'?'Refreshes every 3 days. Better Rare/Epic odds.':tier==='supreme'?'Refreshes every 10 days. Double Rare/Epic odds and a 10% Quad/top-tier chance.':tier==='ultimate'?'One free use every 14 days. Skip the remaining wait for 60 Gems. Every monster is Rare or Epic.':'One free use every 21 days. Skip the remaining wait for 100 Gems. 95% of monster prizes are Rare-or-better; seasonal wins are always Rare or Epic.';
    const status=tier==='standard'?(ready?'DAILY FREE READY':'FREE USED TODAY'):(ready?'COOLDOWN READY':`NEXT USE IN ${cooldownLabel(left)}`);
    return `<article class="ticket-tier ${tier}"><div class="ticket-tier-head"><span>${tier.toUpperCase()}</span><b>${cfg.name}</b></div><div class="ticket-tier-odds"><span><b>${seasonal}%</b> seasonal</span><span><b>${top}%</b> Quad/top</span><span><b>${rare}%</b> Rare</span><span><b>${epic}%</b> Epic</span></div><p>${copy}</p><div class="ticket-status ${ready?'ready':''}">${status}</div><button class="${tier==='transcendent'||tier==='ultimate'?'primary':'secondary'}" data-ticket-tier="${tier}" ${ticketCanCreate(tier)?'':'disabled'}>${ticketButtonLabel(tier)}</button></article>`;
  }
  function renderScratchArea(){
    const root=$('#scratchArea');if(!root)return;const t=state.scratchTicket;
    if(!t){root.innerHTML=`<div class="scratch-blank"><div class="ticket-emblem">CW</div><b>${WORLDS[state.currentWorld].name}</b><span>All ticket tiers draw from the world you are standing on. Scratch seasonals are available year-round even when their breeding event is closed.</span></div><div class="ticket-tier-grid">${ticketCard('standard')}${ticketCard('grand')}${ticketCard('supreme')}${ticketCard('ultimate')}${ticketCard('transcendent')}</div>`;$$('[data-ticket-tier]',root).forEach(b=>b.onclick=()=>createScratchTicket(b.dataset.ticketTier));return;}
    if(!t.tier)t.tier='standard';const cfg=ticketTier(t.tier),all=t.revealed.length===9;
    root.innerHTML=`<div class="scratch-ticket rarity-${t.prize.rarity} tier-${t.tier}"><div class="ticket-title"><span>${WORLDS[t.world].name} - ${cfg.name.toUpperCase()}</span><b>${t.claimed?'PRIZE CLAIMED':all?'MATCH FOUND':'SCRATCH 9 PANELS'}</b></div><div class="scratch-grid">${t.tiles.map((x,i)=>`<button class="scratch-cell ${t.revealed.includes(i)?'revealed':''} ${t.revealed.includes(i)&&x.win?'winner':''}" data-i="${i}" ${t.revealed.includes(i)||t.claimed?'disabled':''}>${t.revealed.includes(i)?x.label:''}</button>`).join('')}</div><div class="scratch-progress">${t.revealed.length}/9 scratched</div><div class="big-reward">${t.claimed?`WON: ${t.prize.label}`:all?'Three matching panels. Claiming reward...':'Find the three matching prize panels.'}</div></div>${t.claimed?`<div class="card-actions"><button class="primary" id="newScratchBtn">CHOOSE NEXT TICKET</button></div>`:''}`;
    $$('.scratch-cell',root).forEach(b=>b.onclick=()=>scratchTile(+b.dataset.i));if($('#newScratchBtn'))$('#newScratchBtn').onclick=()=>{state.scratchTicket=null;save();renderArcade();};
  }
  function scratchTile(i){const t=state.scratchTicket;if(!t||t.claimed||t.revealed.includes(i))return;t.revealed.push(i);sfx(t.tiles[i].win?'coin':'tap');save();if(t.revealed.length>=9){claimScratchTicket();}renderScratchArea();}
  function claimScratchTicket(){const t=state.scratchTicket;if(!t||t.claimed)return;t.claimed=true;const p=t.prize;if(p.kind==='currency'){applyPrize(p);}else{const k=p.world;
      // Seasonal duplicate protection: if Scratch rolls an Epic seasonal the player already owns
      // on this world, but the Common form is still missing, convert the duplicate Epic into the
      // missing Common instead of paying duplicate Resonance.
      if(M[p.id]?.seasonal&&p.form==='Epic'&&ownedForm(p.id,'Epic',k)&&!ownedForm(p.id,'Common',k)){
        p.form='Common';p.rarity='common';p.label=`Common ${M[p.id].name} (Epic duplicate protection)`;
      }
      if(ownedForm(p.id,p.form,k)){const res=p.form==='Epic'?100:p.form==='Rare'?35:12;currency('resonance',res);p.label+=` (duplicate -> ${res} Resonance)`;}else{const o=makeOwned(p.id,p.form,k);state.owned.push(o);if(state.worlds[k].placed.length<castleBeds(state.worlds[k].castle))state.worlds[k].placed.push(o.uid);if(p.form==='Rare')state.stats.rare++;if(p.form==='Epic')state.stats.epic++;if(M[p.id].seasonal)state.stats.seasonals++;gainXP(p.form==='Epic'?420:p.form==='Rare'?220:120);showDiscovery(p.id,p.form,k,M[p.id].seasonal?'SCRATCH SEASONAL':'SCRATCH DISCOVERY');}}
    state.stats.scratches=(state.stats.scratches||0)+1;sfx(p.kind==='monster'&&p.form==='Epic'?'mastery':'hatch');save();renderTop();renderWorld();
  }

  let ownerSession=false;
  function renderSettings(){
    const root=$('#modalBody');
    root.innerHTML=`<div class="two-col"><section class="panel"><h3>Audio</h3>${volumeField('Master volume','master')}${volumeField('Music volume','music')}${volumeField('SFX volume','sfx')}<div class="field-row"><label>Reduced visual effects</label><button class="secondary" id="reduceBtn">${state.settings.reduced?'ON':'OFF'}</button></div><div class="notice">Volume controls expose the full 0 to 20,000 percent range. A compressor keeps extreme settings stable while preserving the boost.</div></section><section class="panel"><h3>Save data</h3><p>Progress saves locally. Export a backup before clearing browser data or replacing a build.</p><div class="card-actions"><button class="secondary" id="exportBtn">EXPORT SAVE</button><button class="secondary" id="importBtn">IMPORT SAVE</button></div><textarea id="saveBox" class="select-input" style="min-height:120px;margin-top:9px;resize:vertical" placeholder="Exported save JSON appears here. Paste a save here to import."></textarea><div class="card-actions"><button class="danger" id="resetBtn">RESET ALL DATA</button></div></section></div><section class="panel" style="margin-top:12px"><h3>Owner menu</h3><div id="ownerArea"></div></section><div class="footer-note">Choruswild uses original code, art and procedural audio. It does not ship copyrighted My Singing Monsters assets or songs.</div>`;
    ['master','music','sfx'].forEach(k=>{const el=$('#vol_'+k);el.oninput=e=>{state.settings[k]=+e.target.value;$('#val_'+k).textContent=state.settings[k]+'%';setAudioLevels();save();};});
    $('#reduceBtn').onclick=()=>{state.settings.reduced=!state.settings.reduced;save();renderSettings();};
    $('#exportBtn').onclick=()=>{$('#saveBox').value=JSON.stringify(state);$('#saveBox').select();toast('Save data exported into the text box.');};
    $('#importBtn').onclick=importSave;
    $('#resetBtn').onclick=resetData;
    renderOwnerArea();
  }
  function volumeField(label,k){return `<div class="field-row"><label>${label}</label><div class="range-wrap"><input type="range" id="vol_${k}" min="0" max="20000" step="10" value="${state.settings[k]}"><span class="range-value" id="val_${k}">${state.settings[k]}%</span></div></div>`;}
  function importSave(){
    try{const next=JSON.parse($('#saveBox').value.trim());if(!next||typeof next!=='object'||!next.worlds)throw new Error('bad');localStorage.setItem(SAVE_KEY,JSON.stringify(next));state=load();ownerSession=false;stopSong();renderAll();renderSettings();toast('Save imported.');}catch(e){toast('That save data is not valid.');}
  }
  function resetData(){
    if(!confirm('Reset all Choruswild progress on this device?'))return;
    localStorage.removeItem(SAVE_KEY);state=freshState();ownerSession=false;stopSong();save();closeModal();renderAll();toast('Save data reset.');
  }
  function renderOwnerArea(){
    const root=$('#ownerArea');if(!root)return;
    if(!ownerSession){root.innerHTML=`<div class="owner-lock"><p>Enter the owner access code to open developer controls for this session.</p><div class="field-row"><input type="text" id="ownerCode" autocomplete="off" placeholder="Owner code"><button class="primary" id="ownerUnlockBtn">UNLOCK</button></div></div>`;$('#ownerUnlockBtn').onclick=()=>{if($('#ownerCode').value===OWNER_CODE){ownerSession=true;sfx('unlock');renderOwnerArea();}else{toast('Incorrect owner code.');sfx('bad');}};return;}
    const currencies=['coins','gems','resonance','crests'];
    root.innerHTML=`<div class="notice gold">Owner controls are unlocked for this session only.</div><div class="owner-controls" style="margin-top:10px">${currencies.map(k=>`<div class="owner-card"><h4>${k[0].toUpperCase()+k.slice(1)}</h4><input type="number" id="owner_${k}" value="${Math.floor(state[k])}" min="0"><div class="card-actions"><button class="mini-btn" data-set="${k}">SET</button><button class="mini-btn" data-add="${k}">ADD</button></div></div>`).join('')}</div><div class="card-actions" style="margin-top:10px"><button class="secondary" id="ownerUnlockAll">UNLOCK ALL WORLDS</button><button class="secondary" id="ownerGrantForms">GRANT CURRENT WORLD FORMS</button><button class="secondary" id="ownerTimers">FINISH TIMERS</button><button class="secondary" id="ownerLevel">SET LEVEL 50</button></div>`;
    $$('[data-set]',root).forEach(b=>b.onclick=()=>{const k=b.dataset.set;state[k]=Math.max(0,+$('#owner_'+k).value||0);save();renderTop();renderOwnerArea();});
    $$('[data-add]',root).forEach(b=>b.onclick=()=>{const k=b.dataset.add;currency(k,+$('#owner_'+k).value||0);save();renderTop();renderOwnerArea();});
    $('#ownerUnlockAll').onclick=()=>{state.unlocked=[...WORLD_ORDER];WORLD_ORDER.forEach(k=>state.worlds[k].castle=5);state.level=Math.max(state.level,34);save();renderAll();renderOwnerArea();toast('All worlds unlocked and Castles maxed.');};
    $('#ownerGrantForms').onclick=grantCurrentWorldForms;
    $('#ownerTimers').onclick=()=>{const ws=currentWS();if(ws.breed)ws.breed.end=now();if(ws.nursery)ws.nursery.end=now();save();toast('Current world timers finished.');};
    $('#ownerLevel').onclick=()=>{state.level=50;state.xp=0;save();renderTop();renderOwnerArea();};
  }
  function grantCurrentWorldForms(){
    const k=state.currentWorld,ws=currentWS();ws.castle=5;
    WORLDS[k].roster.forEach(id=>FORMS.forEach(form=>{
      if(!ownedForm(id,form,k)){const o=makeOwned(id,form,k);state.owned.push(o);if(form==='Common'&&ws.placed.length<castleBeds(ws.castle))ws.placed.push(o.uid);}
    }));
    save();renderAll();renderOwnerArea();toast('All Common, Rare and Epic forms granted for this world.');
  }

  function ensureAudio(){
    if(audio)return audio;
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    const ctx=new C(),master=ctx.createGain(),music=ctx.createGain(),sfxg=ctx.createGain(),comp=ctx.createDynamicsCompressor();
    const verb=ctx.createConvolver(),wet=ctx.createGain(),delay=ctx.createDelay(.7),feedback=ctx.createGain(),delayWet=ctx.createGain();
    comp.threshold.value=-10;comp.knee.value=18;comp.ratio.value=10;comp.attack.value=.003;comp.release.value=.18;
    const impulse=ctx.createBuffer(2,Math.floor(ctx.sampleRate*1.35),ctx.sampleRate);
    for(let ch=0;ch<2;ch++){const d=impulse.getChannelData(ch);for(let i=0;i<d.length;i++){const x=1-i/d.length;d[i]=(Math.random()*2-1)*x*x*.36;}}
    verb.buffer=impulse;wet.gain.value=.16;delay.delayTime.value=.24;feedback.gain.value=.16;delayWet.gain.value=.10;
    music.connect(master);music.connect(verb);verb.connect(wet).connect(master);music.connect(delay);delay.connect(feedback).connect(delay);delay.connect(delayWet).connect(master);
    sfxg.connect(master);master.connect(comp).connect(ctx.destination);
    audio={ctx,master,music,sfx:sfxg,verb,wet,delay,noise:null};setAudioLevels();return audio;
  }
  function volGain(v){if(v<=100)return v/100;return Math.min(12,Math.pow(v/100,.55));}
  function setAudioLevels(){if(!audio)return;audio.master.gain.value=volGain(state.settings.master);audio.music.gain.value=volGain(state.settings.music);audio.sfx.gain.value=volGain(state.settings.sfx);}
  function midi(n){return 440*Math.pow(2,(n-69)/12);}
  function oscNode(ctx,type,freq,start,dur,gain,target,detune=0,filterFreq=0){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);o.detune.value=detune;
    g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),start+.012);g.gain.exponentialRampToValueAtTime(.0001,start+Math.max(.04,dur));
    if(filterFreq){const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=filterFreq;o.connect(f).connect(g);}else o.connect(g);
    g.connect(target);o.start(start);o.stop(start+dur+.05);return o;
  }
  function noiseHit(dur,gain,target,highpass=700){
    const a=ensureAudio();if(!a)return;const {ctx}=a;const len=Math.max(1,Math.floor(ctx.sampleRate*dur));const b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
    const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=b;f.type='highpass';f.frequency.value=highpass;g.gain.value=gain;src.connect(f).connect(g).connect(target);src.start();
  }
  function playInstrument(kind,note,dur=.2,vel=.7,partVol=1){
    const a=ensureAudio();if(!a||state.settings.music<=0)return;const {ctx,music}=a,t=ctx.currentTime+.006,v=.045*vel*partVol;
    const hz=midi(note||48);
    if(kind==='kick'){const o=oscNode(ctx,'sine',92,t,.2,v*2.9,music);o.frequency.exponentialRampToValueAtTime(40,t+.18);return;}
    if(kind==='snare'){noiseHit(.12,v*1.2,music,760);oscNode(ctx,'triangle',185,t,.09,v*.65,music);return;}
    if(kind==='hat'){noiseHit(.045,v*.58,music,4600);return;}
    if(kind==='crash'){noiseHit(.52,v*1.35,music,2100);noiseHit(.3,v*.75,music,5200);return;}
    if(kind==='tom'){const o=oscNode(ctx,'sine',Math.max(92,hz/2),t,.2,v*1.55,music);o.frequency.exponentialRampToValueAtTime(Math.max(58,hz/3),t+.18);noiseHit(.05,v*.28,music,420);return;}
    if(kind==='metal'){noiseHit(.11,v*.42,music,1800);oscNode(ctx,'triangle',hz*2.1,t,.18,v*.35,music);return;}
    if(kind==='handdrum'){oscNode(ctx,'sine',130,t,.11,v*1.4,music);noiseHit(.055,v*.55,music,400);return;}
    if(kind==='water'){const o=oscNode(ctx,'sine',hz*1.35,t,.22,v*1.2,music);o.frequency.exponentialRampToValueAtTime(hz,t+.18);return;}
    if(kind==='bell'||kind==='glass'){
      oscNode(ctx,'sine',hz,t,dur*1.7,v*1.05,music);oscNode(ctx,'sine',hz*2.01,t,dur*1.35,v*.38,music);oscNode(ctx,'triangle',hz*3.03,t,dur*.9,v*.18,music);return;
    }
    if(kind==='marimba'){oscNode(ctx,'sine',hz,t,.22,v*1.25,music);oscNode(ctx,'triangle',hz*2,t,.1,v*.35,music);return;}
    if(kind==='pluck'){oscNode(ctx,'triangle',hz,t,Math.min(.34,dur),v*1.2,music);oscNode(ctx,'sine',hz*2,t,.12,v*.24,music);return;}
    if(kind==='whistle'){const o=oscNode(ctx,'sine',hz,t,dur,v*.92,music);const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=5.2;lg.gain.value=6;l.connect(lg).connect(o.frequency);l.start(t);l.stop(t+dur);return;}
    if(kind==='fiddle'){const o=oscNode(ctx,'sawtooth',hz,t,dur,v*.62,music,0,2300);const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=5.5;lg.gain.value=8;l.connect(lg).connect(o.frequency);l.start(t);l.stop(t+dur);return;}
    if(kind==='reed'){oscNode(ctx,'sawtooth',hz,t,dur,v*.46,music,-7,1700);oscNode(ctx,'square',hz*2,t,dur,v*.14,music,6,2300);oscNode(ctx,'sine',hz/2,t,dur,v*.28,music,0,900);return;}
    if(kind==='drone'){oscNode(ctx,'sawtooth',hz/2,t,dur,v*.34,music,-10,1150);oscNode(ctx,'sine',hz,t,dur,v*.28,music,7,1500);return;}
    if(kind==='organ'){oscNode(ctx,'sine',hz,t,dur,v*.54,music);oscNode(ctx,'triangle',hz*2,t,dur,v*.22,music);oscNode(ctx,'sine',hz*.5,t,dur,v*.30,music);return;}
    if(kind==='bass'){oscNode(ctx,'sawtooth',hz/2,t,dur,v*.9,music,0,650);oscNode(ctx,'sine',hz/2,t,dur,v*.55,music);return;}
    if(kind==='brass'||kind==='horn'){oscNode(ctx,'sawtooth',hz,t,dur,v*.48,music,-5,1900);oscNode(ctx,'sawtooth',hz,t,dur,v*.42,music,5,1900);return;}
    if(kind==='guitar'||kind==='distguitar'){oscNode(ctx,'sawtooth',hz,t,dur,v*.72,music,-11,3200);oscNode(ctx,'square',hz,t,dur,v*.38,music,9,2600);oscNode(ctx,'sawtooth',hz*2,t,Math.min(.12,dur),v*.12,music,0,4200);if(kind==='distguitar')noiseHit(.025,v*.16,music,2600);return;}
    if(kind==='powerchord'){oscNode(ctx,'sawtooth',hz,t,dur,v*.62,music,-10,3000);oscNode(ctx,'sawtooth',hz*Math.pow(2,7/12),t,dur,v*.48,music,7,2900);oscNode(ctx,'square',hz/2,t,dur,v*.26,music,0,1300);noiseHit(.022,v*.13,music,3000);return;}
    if(kind==='industrial'){const o=oscNode(ctx,'sine',Math.max(75,hz/2),t,.16,v*1.35,music);o.frequency.exponentialRampToValueAtTime(Math.max(45,hz/3),t+.14);noiseHit(.07,v*.62,music,1200);oscNode(ctx,'square',hz*1.7,t,.08,v*.18,music,0,2600);return;}
    if(kind==='distbass'){oscNode(ctx,'sawtooth',hz/2,t,dur,v*1.05,music,-6,720);oscNode(ctx,'square',hz/2,t,dur,v*.46,music,6,900);return;}
    if(kind==='glitchpluck'){oscNode(ctx,'triangle',hz,t,Math.min(.18,dur),v*1.05,music,-8,3500);oscNode(ctx,'square',hz*2,t,.055,v*.2,music,11,5000);return;}
    if(kind==='fluxlead'){oscNode(ctx,'sawtooth',hz,t,dur,v*.55,music,-9,2700);oscNode(ctx,'triangle',hz*1.5,t,dur,v*.33,music,7,3300);oscNode(ctx,'sine',hz*2,t,dur*.7,v*.16,music);return;}
    if(kind==='spookorgan'){oscNode(ctx,'sine',hz,t,dur,v*.58,music);oscNode(ctx,'square',hz/2,t,dur,v*.24,music,0,1200);oscNode(ctx,'triangle',hz*1.5,t,dur,v*.22,music);return;}
    if(kind==='sleigh'){noiseHit(.06,v*.35,music,4200);oscNode(ctx,'sine',hz*2,t,.25,v*.5,music);oscNode(ctx,'sine',hz*2.5,t,.2,v*.26,music);return;}
    if(kind==='firework'){oscNode(ctx,'sine',hz*1.5,t,.12,v*.7,music);noiseHit(.18,v*.65,music,1800);return;}
    if(kind==='harp'||kind==='acoustic'){oscNode(ctx,'triangle',hz,t,Math.min(.45,dur),v*1.05,music);oscNode(ctx,'sine',hz*2,t,.18,v*.25,music);return;}
    if(kind==='tap'){noiseHit(.035,v*.5,music,2500);oscNode(ctx,'sine',hz*2,t,.05,v*.32,music);return;}
    if(kind==='steel'){oscNode(ctx,'sine',hz,t,.42,v*1.0,music);oscNode(ctx,'sine',hz*2.02,t,.3,v*.34,music);return;}
    if(kind==='trumpet'){oscNode(ctx,'sawtooth',hz,t,dur,v*.52,music,-4,2400);oscNode(ctx,'square',hz,t,dur,v*.22,music,5,2600);return;}
    if(kind==='snareline'){noiseHit(.09,v*.9,music,1200);oscNode(ctx,'triangle',190,t,.08,v*.35,music);return;}
    if(kind==='partyhorn'){const o=oscNode(ctx,'square',hz,t,dur,v*.36,music,0,2800);o.frequency.linearRampToValueAtTime(hz*1.18,t+Math.min(.16,dur));return;}
    if(kind==='synth'){oscNode(ctx,'square',hz,t,dur,v*.38,music,-8,2400);oscNode(ctx,'sawtooth',hz*1.005,t,dur,v*.34,music,8,1900);return;}
    if(kind==='choir'){oscNode(ctx,'sine',hz,t,dur,v*.68,music,-8);oscNode(ctx,'triangle',hz*1.005,t,dur,v*.43,music,8);oscNode(ctx,'sine',hz*2,t,dur,v*.15,music);return;}
    if(kind==='crown'){oscNode(ctx,'sawtooth',hz,t,dur,v*.38,music,-9,2100);oscNode(ctx,'triangle',hz*1.5,t,dur,v*.32,music,5);oscNode(ctx,'sine',hz*2,t,dur,v*.22,music);return;}
    oscNode(ctx,'triangle',hz,t,dur,v,music);
  }
  function sfx(name){
    const a=ensureAudio();if(!a||state.settings.sfx<=0)return;const {ctx,sfx}=a,t=ctx.currentTime+.004;
    const map={coin:[760,.12,'triangle'],buy:[410,.12,'sine'],bad:[115,.2,'square'],breed:[330,.18,'triangle'],hatch:[640,.32,'triangle'],feed:[520,.1,'sine'],goal:[880,.28,'triangle'],level:[980,.34,'sine'],unlock:[720,.35,'triangle'],mastery:[520,.55,'sine']};
    const q=map[name]||[300,.08,'sine'];oscNode(ctx,q[2],q[0],t,q[1],.045,sfx);if(['hatch','goal','level','unlock','mastery'].includes(name))oscNode(ctx,'triangle',q[0]*1.5,t+.09,q[1],.032,sfx);
  }

  function scaleNote(w,step,deg=0,oct=0){
    const chord=w.chords[Math.floor(step/8)%w.chords.length]||0;
    const sc=w.scale;const d=((deg%sc.length)+sc.length)%sc.length;
    const octave=Math.floor(deg/sc.length);
    return w.root+chord+sc[d]+12*(oct+octave);
  }
  function ev(note,len=1,vel=.8,kind=null){return {note,len,vel,kind};}
  function songEvents(k,id,s){
    const w=WORLDS[k],q=s%(w.steps||128),p=q%16,bar=Math.floor(q/16),section=Math.floor(bar/4),n=(d,o=0)=>scaleNote(w,q,d,o),out=[];
    const every=(step,offset=0)=>((p-offset+16)%step===0);
    if(M[id]?.seasonal&&k!=='seasonal'){
      if(id==='petalbop'&&p%2===0)out.push(ev(n((p/2+bar)%w.scale.length,0),1,.56,'pluck'));
      else if(id==='sunburst'&&[3,7,11,15].includes(p))out.push(ev(n((p/4+bar+3)%w.scale.length,1),2,.64,'steel'));
      else if(id==='gourdgeist'&&[0,8].includes(p))out.push(ev(n((section+bar)%w.scale.length,0),7,.62,'spookorgan'));
      else if(id==='midnightpop'&&([7,15].includes(p)||(section>=2&&[3,11].includes(p))))out.push(ev(n((bar+section)%w.scale.length,1),1,.65,'firework'));
      else if(id==='starspangle'){if([4,12].includes(p))out.push(ev(48,1,.95,'snareline'));if(p%2===1)out.push(ev(68,1,.2,'hat'));if(bar%4===0&&p===0)out.push(ev(70,1,.52,'crash'));}
      else if(id==='cloverclack'&&[2,4,6,10,12,14].includes(p))out.push(ev(72,1,.5,'tap'));
      else if(id==='heartstring'&&p%4===0)out.push(ev(n((p/4+section)%w.scale.length,0),3,.64,'harp'));
      else if(id==='yulebell'&&[2,6,10,14].includes(p))out.push(ev(n((p/4+section)%w.scale.length,1),2,.62,'sleigh'));
      return out;
    }

    if(w.profile==='meadow'){
      if(id==='stonelet'&&[0,8].includes(p))out.push(ev(40,1,1,'kick'));
      if(id==='sprigpipe'&&[1,5,9,13].includes(p))out.push(ev(n([0,2,4,2][Math.floor(p/4)]+section%2,1),2,.8));
      if(id==='galegoat'&&p===0)out.push(ev(n((bar+section)%4,0),6,.72));
      if(id==='mossdrum'&&([4,12].includes(p)||(section>1&&p===14)))out.push(ev(44,1,.8,'handdrum'));
      if(id==='whirlhorn'&&[2,10].includes(p))out.push(ev(n(section%2?1:3,-1),3,.66));
      if(id==='reedram'&&[3,7,11,15].includes(p))out.push(ev(n((p/4|0)+bar+section,0),2,.66));
      if(id==='thrumvine'&&p%2===0&&!(section===0&&p%4))out.push(ev(n((p/2+bar+section)%5,0),1,.58));
      if(id==='rillkip'&&[3,7,11,15].includes(p))out.push(ev(n((p/4+section)%5,1),1,.48,'water'));
      if(id==='canopulse'){if([4,12].includes(p))out.push(ev(n((bar+2)%5,0),2,.72,'marimba'));if(section>=2&&[6,14].includes(p))out.push(ev(47,1,.38,'handdrum'));}
    }else if(w.profile==='glass'){
      if(id==='stonelet'&&[0,8].includes(p))out.push(ev(38,1,.95,'kick'));
      if(id==='droplet'&&[2,6,10,14].includes(p))out.push(ev(n((p/2+section)%5,1),1,.63));
      if(id==='glimmerbug'&&[3,7,11,15].includes(p))out.push(ev(n((4-(p/4|0)+section)%5,1),2,.52));
      if(id==='reefdrum'&&p%2===0)out.push(ev(n((p/2+2+section)%5,0),1,.63));
      if(id==='crystalox'&&[0,8].includes(p))out.push(ev(n((bar+section)%3,0),5,.5));
      if(id==='brookbell'&&[1,4,9,12].includes(p))out.push(ev(n(([4,2,3,1][[1,4,9,12].indexOf(p)]+section)%5,1),3,.62));
      if(id==='prismjaw'&&((section%2&&p%2===1)||[5,13].includes(p)))out.push(ev(n((p+bar+section)%5,0),2,.6));
      if(id==='chimeskiff'&&[1,5,9,13].includes(p))out.push(ev(n((p/4+bar)%5,1),3,.48,'bell'));
      if(id==='reefgale'&&[0,6,8,14].includes(p))out.push(ev(n((p+section)%5,0),2,.56,'glass'));
    }else if(w.profile==='moon'){
      if(id==='sprigpipe'&&[2,10].includes(p))out.push(ev(n((bar%2?3:1)+section%2,1),4,.48));
      if(id==='droplet'&&[6,14].includes(p))out.push(ev(n(section%3,0),1,.5));
      if(id==='glimmerbug'&&[0,8].includes(p))out.push(ev(n((4+section)%5,1),5,.42));
      if(id==='padfin'&&p%4===0)out.push(ev(n((p/4+bar+section)%5,0),2,.5));
      if(id==='moonbloom'&&p===0){out.push(ev(n(0,0),12,.34),ev(n(2,0),12,.3),ev(n(4,0),12,.26));}
      if(id==='brookbell'&&[5,13].includes(p))out.push(ev(n((3+section)%5,1),4,.5));
      if(id==='rootoracle'&&p===8){out.push(ev(n(1+section%2,0),8,.38),ev(n(3+section%2,0),8,.33));}
      if(id==='candlewisp'&&[4,12].includes(p))out.push(ev(n((section+2)%5,0),6,.42,'choir'));
      if(id==='duskhush'&&p===0){out.push(ev(n(0,0),14,.32,'choir'),ev(n(3,0),14,.24,'choir'));if(section>=2)out.push(ev(n(4,1),5,.28,'glass'));}
    }else if(w.profile==='gear'){
      if(id==='stonelet'){
        if([0,8].includes(p))out.push(ev(38,1,1,'kick'));
        if(section>0&&[4,12].includes(p))out.push(ev(42,1,.55,'metal'));
      }
      if(id==='cinderjaw'&&p%4===0)out.push(ev(n((p/4+bar+section)%4,-1),2,.76));
      if(id==='glimmerbug'&&p%4===2)out.push(ev(n((bar+p+section)%5,1),1,.48));
      if(id==='lavafret'&&[1,4,7,9,12,15].includes(p))out.push(ev(n((p+bar+section)%5,0),1,.62));
      if(id==='crystalox'&&[3,11].includes(p))out.push(ev(n((4+section)%5,0),2,.5));
      if(id==='coilchoir'&&p%2===0&&!(section===0&&p%4))out.push(ev(n((p/2+section)%5,0),1,.45));
      if(id==='gearclast'&&([0,5,10,15].includes(p)||(section===2&&[3,13].includes(p))))out.push(ev(n((bar*2+p+section)%5,1),2,.65));
      if(id==='hydrobolt'&&[2,6,10,14].includes(p))out.push(ev(55+(p%4),1,.45,'industrial'));
      if(id==='steamclank'){if([0,8].includes(p))out.push(ev(39,1,.78,'industrial'));if(section>=2&&[5,13].includes(p))out.push(ev(n((bar+section)%5,-1),3,.55,'distbass'));}
    }else if(w.profile==='rock'){
      // 20-bar rock arrangement: intro, riff A, chorus, breakdown, final double-time climb.
      if(id==='stonelet'){
        const kick=section===0?[0,8]:section===1?[0,6,8,14]:section===2?[0,3,6,8,11,14]:section===3?[0,8,10]:[0,2,6,8,10,14];
        if(kick.includes(p))out.push(ev(36,1,1.25,'kick'));
        if([4,12].includes(p))out.push(ev(46,1,section>=2?1.12:1.0,'snare'));
        if(p%2===1)out.push(ev(63,1,section>=4?.34:.25,'hat'));
        if(bar%4===0&&p===0&&section>0)out.push(ev(70,1,.82,'crash'));
        if(bar%4===3&&((section===1&&[13,14,15].includes(p))||(section>=2&&[12,13,14,15].includes(p))))out.push(ev(46+p,1,.92,'tom'));
      }
      if(id==='cinderjaw'){const bass=[0,0,3,5,0,6,5,3];if(p%2===0)out.push(ev(n(bass[p/2|0]+(section===3?1:0),-1),2,.92,'distbass'));}
      if(id==='lavafret'){const hits=section===0?[0,8]:section===1?[0,3,6,8,11,14]:section===2?[0,2,4,6,8,10,12,14]:section===3?[0,8]:[0,2,5,6,8,10,13,14];if(hits.includes(p))out.push(ev(n((bar+section)%5,0),section===3?5:2,.82,'powerchord'));}
      if(id==='bramblepick'){const hits=section<2?[2,5,10,13]:section===2?[1,3,5,7,9,11,13,15]:section===3?[4,12]:[1,3,5,7,9,11,13,15];if(hits.includes(p))out.push(ev(n((p+bar)%5,0),1,.58,'distguitar'));}
      if(id==='sparkhowl'){const leads=[[5,13],[1,5,9,13],[2,5,9,14],[3,7,11,15],[1,3,6,9,11,14]];if(leads[Math.min(section,4)].includes(p))out.push(ev(n((p/2+bar+section)%5,1),2,.76,'distguitar'));}
      if(id==='galegoat'&&([6,14].includes(p)||(section===2&&[2,10].includes(p))))out.push(ev(n((bar+section)%5,0),3,.64,'brass'));
      if(id==='whirlhorn'&&((section%2===0&&[2,10].includes(p))||(section%2===1&&[3,7,11,15].includes(p))))out.push(ev(n((1+bar+section)%5,0),2,.58,'horn'));
      if(id==='brassback'){if(p%4===0)out.push(ev(n((bar+section)%5,0),3,.74,'powerchord'));if(section>=2&&[6,14].includes(p))out.push(ev(n((bar+4)%5,1),2,.52,'distguitar'));}
      if(id==='brambleamp'){if([0,8].includes(p)){out.push(ev(n((bar+1)%5,0),6,.74,'powerchord'),ev(n((bar+3)%5,0),6,.38,'distguitar'));}if(section>=3&&[4,12].includes(p))out.push(ev(43,1,.52,'kick'));}
    }else if(w.profile==='reed'){
      // 20-bar highland suite. Pipeglen is the lead, not a copied Pladdie melody.
      if(id==='sprigpipe'&&([2,10].includes(p)||(section>=3&&[6,14].includes(p))))out.push(ev(n((bar+2+section)%5,1),2,.5));
      if(id==='galegoat'&&[0,8].includes(p))out.push(ev(n((bar+section)%3,0),5,.48));
      if(id==='glimmerbug'&&[3,7,11,15].includes(p)&&section!==0)out.push(ev(n((p+bar+section)%5,1),1,.42));
      if(id==='reedram'){
        const dance=section===2?[1,3,6,9,11,14]:section>=3?[1,3,5,7,9,11,13,15]:[1,5,9,13];
        if(dance.includes(p))out.push(ev(n((p/2|0)+bar+section,0),1,.54));
      }
      if(id==='skylume'&&([5,13].includes(p)||(section===4&&[1,9].includes(p))))out.push(ev(n((4-bar%2+section)%5,1),3,.5));
      if(id==='thornchoir'){
        if(p===0){out.push(ev(n(0,0),14,.3),ev(n(2,0),14,.27));if(section>=3)out.push(ev(n(4,0),14,.22));}
        if(section===4&&p===8)out.push(ev(n(3,1),7,.32,'choir'));
      }
      if(id==='pipeglen'){
        // Sustained bag-like drone with changing original lead phrases.
        if(p===0){out.push(ev(n(section%2?0:1,-1),15,.40,'drone'));if(section>=2)out.push(ev(n(4,-1),15,.18,'drone'));}
        const phrases=[
          {s:[0,4,6,8,12,14],d:[0,2,3,4,2,1]},
          {s:[0,2,5,7,10,12,15],d:[0,1,3,4,3,2,0]},
          {s:[1,3,6,9,11,13,15],d:[2,4,3,1,2,4,3]},
          {s:[0,3,5,8,10,12,14],d:[4,3,2,0,1,2,3]},
          {s:[0,2,4,6,8,10,12,14,15],d:[0,2,4,3,1,3,4,2,0]}
        ];
        const ph=phrases[Math.min(section,phrases.length-1)],ix=ph.s.indexOf(p);if(ix>=0)out.push(ev(n(ph.d[ix]+(bar%2),1),section===4?2.4:2,.76,'reed'));
      }
      if(id==='cairncap'){if([0,4,8,12].includes(p))out.push(ev(48+(p/4|0),1,.62,'handdrum'));if(section>=3&&[6,14].includes(p))out.push(ev(52,1,.4,'tom'));}
      if(id==='highlandra'){if(p===0)out.push(ev(n(section%2?0:4,-1),15,.34,'drone'));if([2,6,10,14].includes(p))out.push(ev(n((bar+p/4+section)%5,1),2,.58,'reed'));}
    }else if(w.profile==='flux'){
      if(id==='rivetwisp'){const seq=section%2?[1,4,7,9,12,15]:[0,3,6,8,11,14];if(seq.includes(p))out.push(ev(n((p+bar+section)%6,1),1,.58,'glitchpluck'));}
      if(id==='briarcoil'&&p%2===0)out.push(ev(n((p/2+section)%6,0),2,.46,'synth'));
      if(id==='drumflare'){const kicks=section<3?[0,8,10]:[0,3,6,8,11,14];if(kicks.includes(p))out.push(ev(38,1,.9,'industrial'));if([4,12].includes(p))out.push(ev(47,1,.7,'snare'));if(section>=3&&p%2===1)out.push(ev(65,1,.15,'hat'));}
      if(id==='phasekiln'&&p%2===0)out.push(ev(n(([0,0,3,5,0,6,4,3][p/2|0]+section)%6,-1),2,.88,'distbass'));
      if(id==='thornmotor'){const hits=section%2?[1,3,6,9,11,14]:[0,4,7,8,12,15];if(hits.includes(p))out.push(ev(n((p+bar)%6,0),1,.66,'industrial'));}
      if(id==='pentaflux'){
        if([0,8].includes(p))out.push(ev(n((bar+section)%6,0),6,.58,'powerchord'));
        const lead=section<3?[2,6,10,14]:section<5?[1,4,7,9,12,15]:[0,2,4,6,8,10,12,14];
        if(lead.includes(p))out.push(ev(n((p/2+bar+section)%6,1),2,.78,'fluxlead'));
        if(section>=4&&bar%4===3&&[13,14,15].includes(p))out.push(ev(50+p,1,.62,'tom'));
      }
    }else if(w.profile==='seasonal'){
      if(id==='lanternling'&&[2,6,10,14].includes(p))out.push(ev(n((p/4+bar)%7,1),2,.44,'bell'));
      if(id==='ribbonram'&&p%4===0)out.push(ev(n((p/4+section)%7,0),3,.48,'harp'));
      if(id==='paradepod'){if([4,12].includes(p))out.push(ev(48,1,.72,'snareline'));if([0,8].includes(p))out.push(ev(38,1,.7,'kick'));}
      if(id==='carolfin'&&[0,8].includes(p))out.push(ev(n((bar+section)%7,0),5,.45,'reed'));
      if(id==='gourdgeist'&&[0,8].includes(p))out.push(ev(n(section%4,0),7,.48,'spookorgan'));
      if(id==='yulebell'&&[2,6,10,14].includes(p))out.push(ev(n((p/4+section)%7,1),2,.48,'sleigh'));
      if(id==='harvesthorn'&&[1,5,9,13].includes(p))out.push(ev(n((p/4+bar)%7,0),2,.5,'fiddle'));
      if(id==='midnightpop'&&([7,15].includes(p)||(section>=3&&[3,11].includes(p))))out.push(ev(n((bar+section)%7,1),1,.48,'firework'));
      if(id==='heartstring'&&p%4===0)out.push(ev(n((p/4+section)%7,0),3,.5,'harp'));
      if(id==='cloverclack'&&[2,4,6,10,12,14].includes(p))out.push(ev(72,1,.38,'tap'));
      if(id==='eggleap'&&[0,4,8,12].includes(p))out.push(ev(n((p/4+bar)%7,0),1,.56,'marimba'));
      if(id==='sunburst'&&[3,7,11,15].includes(p))out.push(ev(n((p/4+5)%7,1),2,.52,'steel'));
      if(id==='petalbop'&&p%2===0)out.push(ev(n((p/2+bar)%7,0),1,.42,'pluck'));
      if(id==='fiestafly'&&[0,6,8,14].includes(p))out.push(ev(n((bar+section+4)%7,0),3,.58,'trumpet'));
      if(id==='starspangle'){if([4,12].includes(p))out.push(ev(48,1,.68,'snareline'));if(section>=2&&p%2===1)out.push(ev(67,1,.12,'hat'));}
      if(id==='leafturn'&&[1,5,9,13].includes(p))out.push(ev(n((p/4+bar+2)%7,0),2,.46,'acoustic'));
      if(id==='birthdaycake'&&[6,14].includes(p))out.push(ev(n((bar+5)%7,1),2,.5,'partyhorn'));
      if(id==='snowmelt'&&[2,10].includes(p))out.push(ev(n((bar+section)%7,1),4,.44,'glass'));
    }else if(w.profile==='final'){
      // 28 bars: orchestra over a true rock rhythm section. Crownmaw supplies the kit and conductor layers.
      if(id==='thrumvine'){const density=section<2?4:section<5?2:1;if(p%density===0)out.push(ev(n((p/density+bar+section)%6,0),1,.46,'pluck'));}
      if(id==='prismjaw'&&([2,6,10,14].includes(p)||(section>=4&&[0,8].includes(p))))out.push(ev(n((p/4|0)+2+section,1),2,.48,'glass'));
      if(id==='rootoracle'&&p===0){out.push(ev(n(0,0),14,.28,'choir'),ev(n(2,0),14,.24,'choir'));if(section>=2)out.push(ev(n(4,0),14,.19,'choir'));}
      if(id==='gearclast'){const seq=section%2?[1,4,7,9,12,15]:[0,3,6,8,11,14];if(seq.includes(p))out.push(ev(n((p+bar+section)%6,0),1,.46,'synth'));if(section>=4&&p%2===1)out.push(ev(70,1,.14,'hat'));}
      if(id==='brassback'){if(p%4===0)out.push(ev(n((bar+1+section)%6,0),3,.78,'powerchord'));if(section>=3&&[2,6,10,14].includes(p))out.push(ev(n((bar+3+p/4)%6,1),2,.48,'distguitar'));}
      if(id==='thornchoir'&&p===8){out.push(ev(n(1+section%2,0),8,.3,'choir'),ev(n(3+section%2,0),8,.27,'choir'));if(section>=3)out.push(ev(n(5,0),8,.21,'choir'));}
      if(id==='crownmaw'){
        const kicks=section<2?[0,8]:section<4?[0,6,8,14]:section<6?[0,3,6,8,11,14]:[0,2,6,8,10,14];
        if(kicks.includes(p))out.push(ev(36,1,1.24,'kick'));
        if([4,12].includes(p))out.push(ev(46,1,1.08,'snare'));
        if(section>=1&&p%2===1)out.push(ev(64,1,section>=6?.32:.23,'hat'));
        if(bar%4===0&&p===0&&section>0)out.push(ev(72,1,.86,'crash'));
        if(bar%4===3&&section>=2&&[12,13,14,15].includes(p))out.push(ev(48+p,1,.9,'tom'));
        if(p===0){out.push(ev(n(0,-1),14,.42,'organ'),ev(n(2,0),14,.3,'organ'));if(section>=2)out.push(ev(n(4,0),14,.18,'organ'));}
        const leads=[[4,12],[4,10,12],[2,6,10,14],[1,5,9,13],[0,4,8,12],[0,2,4,6,8,10,12,14],[1,3,5,7,9,11,13,15]];
        const set=leads[Math.min(section,6)];if(set.includes(p))out.push(ev(n((bar+4+(p/4|0))%6,1),section>=5?2:3,.72,'crown'));
      }
    }
    return out;
  }

  function pulseMonster(o){
    if(state.settings.reduced)return;const el=$(`.monster[data-uid="${o.uid}"]`);if(!el)return;el.classList.remove('performing',M[o.id].anim);void el.offsetWidth;el.classList.add('performing',M[o.id].anim);setTimeout(()=>el.classList.remove('performing',M[o.id].anim),520);
  }
  function songTick(){
    const k=state.currentWorld,w=WORLDS[k],ws=state.worlds[k],stepSec=60/w.tempo/4;
    ws.placed.map(x=>state.owned.find(o=>o.uid===x)).filter(Boolean).forEach(o=>{
      if(o.muted)return;const events=songEvents(k,o.id,songStep);if(!events.length)return;
      const pv=(o.volume||100)/100;events.forEach(e=>playInstrument(e.kind||M[o.id].sound,e.note,e.len*stepSec,e.vel,pv));pulseMonster(o);
    });
    songStep=(songStep+1)%(w.steps||128);
  }
  function startSong(){
    if(songTimer)return;const a=ensureAudio();if(a&&a.ctx.state==='suspended')a.ctx.resume();
    if(!currentWS().placed.length){toast('Place at least one performer first.');return;}
    songStep=0;songTick();const ms=60000/WORLDS[state.currentWorld].tempo/4;songTimer=setInterval(songTick,ms);$('#performanceBtn').textContent='STOP SONG';
  }
  function stopSong(){if(songTimer){clearInterval(songTimer);songTimer=null;}songStep=0;if($('#performanceBtn'))$('#performanceBtn').textContent='PLAY SONG';}
  function toggleSong(){songTimer?stopSong():startSong();}

  function updateTimers(){
    const attuned=finishAttune(),synthDone=finishSynthJob();
    if(currentPanel==='breed'){
      const ws=currentWS(),job=ws.breed||ws.nursery;if(job){const left=job.end-now(),el=$('#jobTimer');if(left<=0){if(el&&el.textContent!=='READY'&&el.textContent!=='READY TO HATCH')renderBreed();}else if(el)el.textContent=secText(left);}
    }
    if(currentPanel==='market'&&state.currentWorld==='flux'){
      if(attuned||synthDone)renderFluxMarket();else{(state.synth.attuneJobs||[]).forEach((j,i)=>{const el=$(`.attune-live[data-index="${i}"]`);if(el)el.textContent=secText(j.end-now());});if(state.synth.fiveCycle&&$('.cycle-live'))$('.cycle-live').textContent=secText(state.synth.fiveCycle.end-now());if(state.synth.job&&$('#synthTimer'))$('#synthTimer').textContent=secText(state.synth.job.end-now());}
    }
    renderTop();
  }

  function bindStatic(){
    document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
    $('#closeModalBtn').onclick=closeModal;$('#modalLayer').addEventListener('click',e=>{if(e.target.id==='modalLayer')closeModal();});
    $('#settingsBtn').onclick=()=>openPanel('settings');$('#mapBtn').onclick=()=>openPanel('map');$('#performanceBtn').onclick=toggleSong;
    const collect=$('#collectAllBtn');if(collect)collect.onclick=collectAll;
    $$('#dock button').forEach(b=>b.onclick=()=>{const p=b.dataset.panel;if(p==='island'){closeModal();return;}openPanel(p);});
    window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(document.hidden){save();stopSong();}});
  }

  function init(){
    offlineProgress();grantDaily();bindStatic();renderAll();setInterval(updateTimers,1000);save();
    if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
  init();
})();
