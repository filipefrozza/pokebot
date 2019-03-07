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

exports.goto = function(arg){
	pokedb = exports.data.pokedb;
	usuario = exports.data.usuario;
	mensagens = exports.data.mensagens;
	config = exports.data.config;

	pokedb.collection('users').findOne({pid: usuario.id}, function(err, user){
		if(err) throw err;
		if(user == null) return err;

		pokedb.collection('regions').findOne({id: user.region}, function(err, reg){
			if(err) throw err;
			if(reg == null) return err;

			if(reg.type == 'city'){
				if(arg == reg.id){
					pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: ""}});
					return;
				}else if(user.place != ""){
					mensagens.enviarGenerico("Ops", "Você deve sair do prédio antes");
					return;
				}else if(reg.connections.includes(arg)){
					pokedb.collection('places').findOne({id: arg}, function(err, place){
						if(err) throw err;
						if(place == null){
							mensagens.enviarGenerico("Ops", "Local ainda em desenvolvimento");
						}else{
							pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: arg, region: place.region}});
							mensagens.enviarGenerico("**Andou**", "Você foi para "+place.name+" - "+place.region);
						}
					});
					return;
				}
				pokedb.collection('builds').findOne({region: reg.id, id: arg}, function(err, builds){
					if(err) throw err;
					if(builds == null){
						mensagens.enviarGenerico("Ops", "Não é possível ir até "+arg);

						return;
					}else{
						if(builds.key){
							pokedb.collection('keys').findOne({pid: usuario.id, id: builds.key}, function(err, key){
								if(err) throw err;
								if(key == null){
									mensagens.enviarGenerico("Ops", "Você ainda não pode ir para esse lugar");
								}else{
									//adicionar interrupções dps
									pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: arg}});
								}
							});
						}
					}
				});
			}else{
				pokedb.collection('places').findOne({id: user.place, connections: arg}, function(err, place){
					if(err) throw err;
					if(place == null){
						mensagens.enviarGenerico("Ops", "Não é possível ir até "+args);
					}else{
						pokedb.collection('regions').findOne({id: arg}, function(err, reg){
							if(err) throw err;
							if(reg == null){
								pokedb.collection('places').findOne({id: arg}, function(err, place){
									if(err) throw err;
									if(place == null){
										mensagens.enviarGenerico("Ops", "Esse lugar ainda está em desenvolvimento");
									}else{
										if(place.key){
											pokedb.collection('keys').findOne({pid: usuario.id, id: place.key}, function(err, key){
												if(err) throw err;
												if(key == null){
													mensagens.enviarGenerico("Ops", "Você ainda não pode ir para esse lugar");
												}else{
													//adicionar interrupções dps
													pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: arg}});
													mensagens.enviarGenerico("**Andou**", "Você foi para "+place.name+" - "+place.region);
												}
											});
										}
									}
								});
							}else{
								if(region.key){
									pokedb.collection('keys').findOne({pid: usuario.id, id: region.key}, function(err, key){
										if(err) throw err;
										if(key == null){
											mensagens.enviarGenerico("Ops", "Você ainda não pode ir para esse lugar");
										}else{
											//adicionar interrupções dps
											pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {region: arg, place: ""}});
											mensagens.enviarGenerico("**Andou**", "Você foi para "+region.name);
										}
									});
								}
							}
						});
					}
				});
			}
		});
	});
};