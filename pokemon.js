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
		if(user.place == arg){
			mensagens.enviarGenerico("Ops", "Você já está em "+arg);
			return;
		}

		pokedb.collection('regions').findOne({id: user.region}, function(err, reg){
			if(err) throw err;
			if(reg == null){
				console.log("Região "+user.region+" não encontrada");
				return;
			}

			if(reg.type == 'city'){
				if(arg == reg.id){
					if(user.place == ""){
						mensagens.enviarGenerico("Ops", "Você já está em "+arg);
					}else{
						pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: ""}});
						mensagens.enviarGenerico("**Andou**", "Você saiu de "+user.place);
					}
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
							if(place.key){
								var res = pokedb.collection('keys').findOne({id: place.key, pid: usuario.id}, function(err, key){
									if(err) throw err;
									if(key == null) return false;
									return true;
								});
								if(!res){
									mensagens.enviarGenerico("Ops", "Você ainda não pode ir para esse local");
									return;
								}
							}
							pokedb.collection('events').findOne({type: "interrupção", local: arg}, function(err, event){
								if(err) throw err;
								if(event == null){
									pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: arg, region: place.region}});
									mensagens.enviarGenerico("**Andou**", "Você foi para "+place.name+" - "+place.region);		
								}else{
									eval("script = "+event.script.code);
									script(usuario);
								}
							});
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
									mensagens.enviarGenerico("**Andou**", "Você foi para "+place.name+" - "+place.region);
								}
							});
						}else{
							pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: arg}});
							mensagens.enviarGenerico("**Andou**", "Você foi para "+builds.name+" - "+builds.region);
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
											var res = pokedb.collection('keys').findOne({pid: usuario.id, id: place.key}, function(err, key){
												if(err) throw err;
												if(key == null){
													return false
												}else{
													return true
												}
											});
											if(!res){
												mensagens.enviarGenerico("Ops", "Você ainda não pode ir para esse lugar");
												return;
											}
										}
										pokedb.collection('events').findOne({type: "interrupção", local: arg}, function(err, event){
											if(err) throw err;
											if(event == null){
												pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {place: arg, region: place.region}});
												mensagens.enviarGenerico("**Andou**", "Você foi para "+place.name+" - "+place.region);		
											}else{
												eval("script = "+event.script.code);
												script(usuario);
											}
										});
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
								}else{
									pokedb.collection('users').updateOne({pid: usuario.id}, {$set: {region: arg, place: ""}});
									mensagens.enviarGenerico("**Andou**", "Você foi para "+region.name);
								}
							}
						});
					}
				});
			}
		});
	});
};

exports.gerarIv = function(especial){
	var iv;
	if(especial){
		iv = {
			hp: 25+~~(Math.random()*7),
			atk: 25+~~(Math.random()*7),
			def: 25+~~(Math.random()*7),
			spatk: 25+~~(Math.random()*7),
			spdef: 25+~~(Math.random()*7),
			spd: 25+~~(Math.random()*7)
		};
	}else{
		iv = {
			hp: ~~(Math.random()*32),
			atk: ~~(Math.random()*32),
			def: ~~(Math.random()*32),
			spatk: ~~(Math.random()*32),
			spdef: ~~(Math.random()*32),
			spd: ~~(Math.random()*32)
		};
	}

	return iv;
};

exports.gerarEv = function(especial){
	var Ev;
	if(especial){
		ev = {
			hp: 0,
			atk: 0,
			def: 0,
			spatk: 0,
			spdef: 0,
			spd: 0
		};
	}else{
		ev = {
			hp: 0,
			atk: 0,
			def: 0,
			spatk: 0,
			spdef: 0,
			spd: 0
		};
	}

	return e;
};

exports.gerarNature = function(poke){
	natures = {
		adamant: {
			atk: +10,
			spatk: -10
		},
		bashful: {

		},
		bold: {
			def: +10,
			atk: -10
		},
		brave: {
			atk: +10,
			spd: -10
		},
		calm: {
			spdef: +10,
			atk: -10
		},
		careful: {
			spdef: +10,
			spatk: -10
		},
		docile: {

		},
		gentle: {
			spdef: +10,
			def: -10
		},
		hardy: {

		},
		hasty: {
			spd: +10,
			def: -10
		},
		impish: {
			def: +10,
			spatk: -10
		},
		jolly: {
			spd: +10,
			spatk: -10
		},
		lax: {
			def: +10,
			spdef: -10
		},
		lonely: {
			atk: +10,
			def: -10
		},
		mild: {
			spatk: +10,
			def: -10
		},
		modest: {
			spatk: +10,
			atk: -10
		},
		naive: {
			spd: +10,
			spdef: -10
		},
		naughty: {
			atk: +10,
			spdef: -10
		},
		quiet: {
			spatk: +10,
			spd: -10
		},
		quirky: {
			spatk: +10,
			spd: -10
		},
		rash: {
			spatk: +10,
			spdef: -10
		},
		relaxed: {
			def: +10,
			spd: -10
		},
		sassy: {
			spdef: +10,
			spd: -10
		},
		serious: {
			
		},
		timid: {
			spd: +10,
			atk: -10
		}
	};

	r = ~~(Math.random()*natures.length);
	keys = Object.keys(natures);
	poke.nature = keys[r];
	poke.naturebonus = natures[keys[r]];

	return poke;
};

exports.calcularStats = function(pokemon){
	pokemon.stats = {
		hp: ((2*pokemon.base.hp+pokemon.iv.hp+(pokemon.ev.hp/4))*pokemon.level)/100+pokemon.level+10,
		atk: ((2*pokemon.base.atk+pokemon.iv.atk+(pokemon.ev.atk/4))*pokemon.level)/100+5,
		def: ((2*pokemon.base.def+pokemon.iv.def+(pokemon.ev.def/4))*pokemon.level)/100+5,
		spatk: ((2*pokemon.base.spatk+pokemon.iv.spatk+(pokemon.ev.spatk/4))*pokemon.level)/100+5,
		spdef: ((2*pokemon.base.spdef+pokemon.iv.spdef+(pokemon.ev.spdef/4))*pokemon.level)/100+5,
		spd: ((2*pokemon.base.spd+pokemon.iv.spd+(pokemon.ev.spd/4))*pokemon.level)/100+5
	}
};