//----ESTRUTURA----//

users = [
	{
		name: "Frozen",
		pid: x,
		server: "kanto",
		level: 0,
		server: 1,
		exp: 0,
		next: 10,
		region: "pallet",
		place: "home",
		battle: false
	}
];

server: [
	{
		name: "PokeTeste",
		multiplier: 5,
		island: "Kanto",
		id: "kanto"
	}
];

events: [
	{
		key: "firstpoke",
		name: "Escolher seu pokemon",
		type: "comando",
		trigger: "choose",
		args: 1,
		local: "oakslab",
		script: function(args, usuario){
			if(args[0]=='pikachu' || args[0]=='eevee'){
				pokedb.collection('pokemons').findOne({id: args[0]}, function(err, poke){
					if(!poke){
						console.log("nenhum "+args[0]+" encontrado");
					}else{
						poke.level = 5;
						poke.exp = 0;
						poke.next = 10;
						poke.owner = usuario.pid;
						poke.iv = pokemon.gerarIv(true);
						poke.ev = pokemon.gerarEv();
						poke = pokemon.gerarNature(poke);
						poke = pokemon.calcularStats(poke);

						pokedb.collection('catched').insertOne(poke, function(err, res){
							if(err) throw err;

							mensagens.enviarGenerico("Parabéns","Você recebeu um ".poke.name." nv5");
						});
						pokedb.collection('keys').removeOne({id: "firstpoke", pid: usuario.id});
						pokedb.collection('keys').insertOne({id: "oakparcel", pid: usuario.id});
						pokedb.collection('keys').insertOne({id: "gotpoke", pid: usuario.id});
					}
				});
			}else{
				mensagens.enviarGenerico('Ops','Você precisa escolher entre pikachu e eevee');
			}
		}
	},{
		key: "talkmom",
		name: "Falar com sua mãe",
		type: "comando",
		trigger: "talk",
		args: 0,
		local: "home",
		script: function(usuario){
			mensagens.enviarGenerico('**Mãe**','Bom dia filho, está um ótimo dia para passear');
			pokedb.collection('keys').removeOne({id: "talkmom", pid: usuario.id});
			pokedb.collection('keys').insertOne({id: "blockroute1", pid: usuario.id});
			pokedb.collection('keys').insertOne({id: "pallet", pid: usuario.id});
			pokedb.collection('keys').insertOne({id: "firstpoke", pid: usuario.id});
		}
	},{
		key: "blockroute1",
		name: "Ser parado pelo oak",
		type: "interrupção",
		trigger: "",
		args: 0,
		local: "route1",
		script: function(usuario){
			mensagens.enviarGenerico('**Oak**','Cuidado '+usuario.username+' é perigoso lá fora\nVenha até meu laboratório\n\n**$goto lab**');
		}
	}
];

tamed = [
	
];

mochila = [
	{
		name: "Potion",
		id: "potion",
		type: "heal",
		affect: "hp",
		value: 10,
		amount: 1,
		owner: "Frozen"
	}
];

pokemons = [
	{
		index: 1,
		id: "bulbasaur",
		name: "Bulbasaur",
		type: ["Grass"],
		region: ["route1"],
		place: [],
		base: {
			hp: 45,
			atk: 49,
			def: 49,
			spatk: 65,
			spdef: 65,
			spd: 45
		}
	},{
		index: 2,
		id: "ivysaur",
		name: "Ivysaur",
		type: ["Grass"],
		region: [],
		place: []
	},{
		index: 3,
		id: "venusaur",
		name: "Venusaur",
		type: ["Grass"],
		region: [],
		place: []
	},{
		index: 4,
		id: "charmander",
		name: "Charmander",
		type: ["Fire"],
		region: [],
		place: []
	},{
		index: 5,
		id: "charmeleon",
		name: "Charmeleon",
		type: ["Fire"],
		region: [],
		place: []
	},{
		index: 6,
		id: "charizard",
		name: "Charizard",
		type: ["Fire","Fly"],
		region: [],
		place: []
	},{
		index: 7,
		id: "squirtle",
		name: "Squirtle",
		type: ["Water"],
		region: [],
		place: []
	},{
		index: 8,
		id: "wartortle",
		name: "Wartortle",
		type: ["Water"],
		region: [],
		place: []
	},{
		index: 9,
		id: "blastoise",
		name: "Blastoise",
		type: ["Water"],
		region: [],
		place: []
	},{
		index: 9,
		id: "caterpie",
		name: "Caterpie",
		type: ["Bug"],
		region: [],
		place: []
	},{
		index: 9,
		id: "metapod",
		name: "Metapod",
		type: ["Bug"],
		region: [],
		place: []
	},{
		index: 9,
		id: "eevee",
		name: "Eevee",
		type: ["Normal"],
		region: [],
		place: [],
		base: {
			hp: 55,
			atk: 55,
			def: 50,
			spatk: 45,
			spdef: 65,
			spd: 55
		}	
	}
	[ ] 11 Metapod
	[ ] 12 Butterfree
	[ ] 13 Weedle
	[ ] 14 Kakuna
	[ ] 15 Beedrill
	[ ] 16 Pidgey
	[ ] 17 Pidgeotto
	[ ] 18 Pidgeot
	[ ] 19 Rattata
	[ ] 20 Raticate
	[ ] 21 Spearow
	[ ] 22 Fearow
	[ ] 23 Ekans
	[ ] 24 Arbok
	[ ] 25 Pikachu
	[ ] 26 Raichu
	[ ] 27 Sandshrew
	[ ] 28 Sandslash
	[ ] 29 Nidoran♀
	[ ] 30 Nidorina
	[ ] 31 Nidoqueen
	[ ] 32 Nidoran♂
	[ ] 33 Nidorino
	[ ] 34 Nidoking
	[ ] 35 Clefairy
	[ ] 36 Clefable
	[ ] 37 Vulpix
	[ ] 38 Ninetales
	[ ] 39 Jigglypuff
	[ ] 40 Wigglytuff
	[ ] 41 Zubat
	[ ] 42 Golbat
	[ ] 43 Oddish
	[ ] 44 Gloom
	[ ] 45 Vileplume
	[ ] 46 Paras
	[ ] 47 Parasect
	[ ] 48 Venonat
	[ ] 49 Venomoth
	[ ] 50 Diglett
	[ ] 51 Dugtrio
	[ ] 52 Meowth
	[ ] 53 Persian
	[ ] 54 Psyduck
	[ ] 55 Golduck
	[ ] 56 Mankey
	[ ] 57 Primeape
	[ ] 58 Growlithe
	[ ] 59 Arcanine
	[ ] 60 Poliwag
	[ ] 61 Poliwhirl
	[ ] 62 Poliwrath
	[ ] 63 Abra
	[ ] 64 Kadabra
	[ ] 65 Alakazam
	[ ] 66 Machop
	[ ] 67 Machoke
	[ ] 68 Machamp
	[ ] 69 Bellsprout
	[ ] 70 Weepinbell
	[ ] 71 Victreebel
	[ ] 72 Tentacool
	[ ] 73 Tentacruel
	[ ] 74 Geodude
	[ ] 75 Graveler
	[ ] 76 Golem
	[ ] 77 Ponyta
	[ ] 78 Rapidash
	[ ] 79 Slowpoke
	[ ] 80 Slowbro
	[ ] 81 Magnemite
	[ ] 82 Magneton
	[ ] 83 Farfetch'd
	[ ] 84 Doduo
	[ ] 85 Dodrio
	[ ] 86 Seel
	[ ] 87 Dewgong
	[ ] 88 Grimer
	[ ] 89 Muk
	[ ] 90 Shellder
	[ ] 91 Cloyster
	[ ] 92 Gastly
	[ ] 93 Haunter
	[ ] 94 Gengar
	[ ] 95 Onix
	[ ] 96 Drowzee
	[ ] 97 Hypno
	[ ] 98 Krabby
	[ ] 99 Kingler
	[ ] 100 Voltorb
	[ ] 101 Electrode
	[ ] 102 Exeggcute
	[ ] 103 Exeggutor
	[ ] 104 Cubone
	[ ] 105 Marowak
	[ ] 106 Hitmonlee
	[ ] 107 Hitmonchan
	[ ] 108 Lickitung
	[ ] 109 Koffing
	[ ] 110 Weezing
	[ ] 111 Rhyhorn
	[ ] 112 Rhydon
	[ ] 113 Chansey
	[ ] 114 Tangela
	[ ] 115 Kangaskhan
	[ ] 116 Horsea
	[ ] 117 Seadra
	[ ] 118 Goldeen
	[ ] 119 Seaking
	[ ] 120 Staryu
	[ ] 121 Starmie
	[ ] 122 Mr. Mime
	[ ] 123 Scyther
	[ ] 124 Jynx
	[ ] 125 Electabuzz
	[ ] 126 Magmar
	[ ] 127 Pinsir
	[ ] 128 Tauros
	[ ] 129 Magikarp
	[ ] 130 Gyarados
	[ ] 131 Lapras
	[ ] 132 Ditto
	[ ] 133 Eevee
	[ ] 134 Vaporeon
	[ ] 135 Jolteon
	[ ] 136 Flareon
	[ ] 137 Porygon
	[ ] 138 Omanyte
	[ ] 139 Omastar
	[ ] 140 Kabuto
	[ ] 141 Kabutops
	[ ] 142 Aerodactyl
	[ ] 143 Snorlax
	[ ] 144 Articuno
	[ ] 145 Zapdos
	[ ] 146 Moltres
	[ ] 147 Dratini
	[ ] 148 Dragonair
	[ ] 149 Dragonite
	[ ] 150 Mewtwo
	[ ] 151 Mew
];

items = [
	{
		name: "Potion",
		id: "potion",
		type: "heal",
		affect: "hp",
		value: 20
	}
];

keys = [
	{
		id: "talkmom",
		pid: "xxxxxxxxx"
	}
]

regions = [
	{
		name: "Pallet Town",
		id: "pallet",
		connections: ["r1entrance"],
		type: "city",
		key: "pallet"
	},{
		name: "Route 1",
		id: "route1",
		connections: [],
		type: "route",
		key: null,
		minlv: 2,
		maxlv: 4
	}
];

places = [
	{
		name: "Entrada",
		id: "r1entrance",
		region: "route1",
		key: null,
		npc: [],
		connections: ["pallet","r1mid"]
	},{
		name: "Meio",
		id: "r1mid",
		region: "route1",
		key: null,
		npc: [],
		connections: ["r1entrance","r1final"]
	},{
		name: "Final",
		id: "r1final",
		region: "route1",
		key: null,
		npc: [],
		connections: ["viridian","r1mid"]
	}
];

builds = [
	{
		name: "Home",
		id: "home",
		region: "pallet",
		key: null
	},{
		name: "Oak's Lab",
		id: "oakslab",
		region: "pallet",
		key: null
	}
];

spawns = [
	{
		index: 1,
		id: "bulbasaur",
		name: "Bulbasaur",
		type: "Grass",
		level: 3,
		place: [],
		region: ["route1"]
	}
];

moves = [
	
];
