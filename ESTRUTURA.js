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
		local: "oaklab",
		script: function(args, usuario){
			if(arg[0]=='pikachu' || arg[0]=='eevee'){
				pokedb.collection('pokemon').findOne({id: arg}, function(err, poke){
					if(!poke){
						console.log("nenhum "+arg+" encontrado");
					}else{
						poke.level = 5;
						poke.exp = 0;
						poke.next = 10;
						poke.owner = player.pid;
						poke.iv = pokemon.gerarIv(true);
						poke.ev = pokemon.gerarEv();
						poke.stats = pokemon.calcularStats(poke);
						poke = pokemon.gerarNature(poke);

						console.log(poke);
						// pokedb.collection('keys').removeOne({id: "firstpoke", pid: usuario.id});
						// pokedb.collection('keys').insertOne({id: "oakparcel", pid: usuario.id});
						// pokedb.collection('keys').insertOne({id: "gotpoke", pid: usuario.id});
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
			pokedb.collection('keys').insertOne({id: "talkedmom", pid: usuario.id});
			pokedb.collection('keys').insertOne({id: "pallet", pid: usuario.id});
		}
	},{
		key: "talkedmom",
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
	}
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
		key: "gotpoke",
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
