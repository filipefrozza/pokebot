exports.data = {
	client: null,
	auth: null,
	pokemon: null,
	pokedb: null,
	mensagens: null,
	cronjob: null
};

exports.iniciarBot = function(){
	client = exports.data.client;
	auth = exports.data.auth;
	pokemon = exports.data.pokemon;
	pokedb = exports.data.pokedb;
	mensagens = exports.data.mensagens;
	cronjob = exports.data.cronjob;

	var config = {
        w: 'majority',
        wtimeout: 10000,
        serializeFunctions: true,
        forceServerObjectId: true
    };

	client.on("ready", () => {
	  	// This event will run if the bot starts, and logs in, successfully.
	  	console.log(`Bot iniciou, com ${client.users.size} usuários, em ${client.channels.size} canais de ${client.guilds.size} grupos.`); 
	  	// Example of changing the bot's playing game to something useful. `client.user` is what the
	  	// docs refer to as the "ClientUser".
	  	client.user.setActivity('você', {type: "WATCHING"});
	  	pokemon.data = {
	  		pokedb: pokedb,
	  		mensagens: mensagens,
	  		config: config
	  	};
	});

	client.on("message", async message => {
	    if (message.content.substring(0, 1) == '$') {
	        var args = message.content.substring(1).split(' ');
	        var cmd = args[0];
	        var usuario = message.author;
	        pokemon.data.usuario = usuario;
	        mensagens.message = message;
	       
	        args = args.splice(1);
	        switch(cmd) {
	            case 'intro':
	            	console.log("enviando mensagem");
	                mensagens.enviarIntro();

	                break;
	            case 'register':
	            	console.log("Jogador "+usuario.username+" querendo começar");
	            	pokemon.register();

	            	break;

	            case 'check':
	            	console.log("Jogador "+usuario.username+" checando");
	            	pokemon.check();

	            	break;

	            default:
	            	console.log("Jogador "+usuario.username+" tentando usar comando "+cmd);
	            	pokemon.trigger(cmd, args);

	            	break;
	        }
	    }
	});

	client.login(auth.token);

	// new cronjob('*/20 * * * * *', function() {
	// 	pokemon.spawnar(pokedb);
	// }, null, true, 'America/Los_Angeles');
}