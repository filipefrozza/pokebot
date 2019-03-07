exports.data = {
	pokedb: null,
	usuario: null,
	mensagens: null,
	config: null
};

exports.register = function(){
	pokedb = exports.data.pokedb;
	usuario = exports.data.usuario;
	mensagens = exports.data.mensagens;
	config = exports.data.config;

	pokedb.collection('users').find({pid: usuario.id}).toArray(function(err, result){
		if(err) throw err;

		if(result.length == 0){
        	try{
		    	var data = {
			        nome:usuario.username,
			        pid: usuario.id,
			        level: 1,
			        server: 1,
			        exp: 0,
			        next: 10,
			        region: "pallet",
					place: "home"
			    }
			    
				pokedb.collection('users').insertOne(data, config, (err, result) => {
					if (err) return err;

					console.log("Jogador "+usuario.username+" adicionado ao Servidor de Kanto");
					pokedb.collection('keys').insertOne({pid: usuario.id, id: "talkmom"});
					mensagens.enviarGenerico("Parabéns "+usuario.username, "Registrado com sucesso no Servidor Kanto!");
				});
		    }catch(err){
		    	console.log("não conseguiu salvar");
		    	console.log(err);
		    	console.log(JSON.stringify(data));
		    	mensagens.enviarGenerico("Ops","Não foi possível registrar :c");
		    }
		}else{
			console.log("Jogador "+usuario.username+" já está registrado no Servidor de Kanto");
			mensagens.enviarGenerico("Calma aí","Você já está registrado");
		}
	});
};

exports.check = function(){
	pokedb = exports.data.pokedb;
	usuario = exports.data.usuario;
	mensagens = exports.data.mensagens;
	config = exports.data.config;

	pokedb.collection('users').findOne({pid: usuario.id}, function(err, user){
		if(err) throw err;
		if(user == null) return err;
		pokedb.collection('keys').find({pid: usuario.id}).toArray(function(err, arrkeys){
			keys = [];
			for(k in arrkeys){
				keys.push(arrkeys[k].id);
			}
			pokedb.collection('events').find({key: {$in: keys}, local: {$in: [user.region, user.place]}}).toArray(function(err, events){
				if(err) throw err;

				if(events.length == 0){
					mensagens.enviarGenerico("Check", "Você não tem ações para tomar agora");
				}else{
					mensagens.listarTriggers(events);
				}
			});
		});
	});
};

exports.trigger = function(cmd, args){
	pokedb = exports.data.pokedb;
	usuario = exports.data.usuario;
	mensagens = exports.data.mensagens;
	config = exports.data.config;

	pokedb.collection('users').findOne({pid: usuario.id}, function(err, user){
		if(err) throw err;
		if(user == null) return err;
		pokedb.collection('keys').find({pid: usuario.id}).toArray(function(err, arrkeys){
			keys = [];
			for(k in arrkeys){
				keys.push(arrkeys[k].id);
			}
			pokedb.collection('events').findOne({key: {$in: keys}, local: {$in: [user.region, user.place]}, trigger: cmd}, function(err, event){
				if(err) throw err;

				if(event == null){
					mensagens.enviarGenerico("Ops", "Comando "+cmd+" não faz nada nesse local");
				}else{
					// mensagens.enviarGenerico("Okay", "Comando "+cmd+" pertence a esse local");
					console.log(args);
					if(event.args==0){
						eval("script = "+event.script.code);
						script(usuario);
					}else if(event.args!=args.length){
						mensagens.enviarGenerico("Ops", "Quantidade de parâmetros incorreto");
					}else{
						try{
							eval(event.script.code);
							script(args, usuario);
						}catch(e){
							console.log(e);
						}
					}
				}
			});
		});
	});
};