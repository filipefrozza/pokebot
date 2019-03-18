exports.message = null;

exports.enviarIntro = function(){
	exports.message.channel.send({
        embed: {
            title: '**PokeBot**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: "Seja Paciente",
		        value: "Jogo em desenvolvimento"
		      }
		    ]
        },
        content: ''
    });
};

exports.enviarCheckagem = function(user, events, region, connections, poke){
    fields = [];
    triggers = [];

    fields.push({
        name: user.nome+" Lv"+user.level,
        value: "("+user.exp+"/"+user.next+")"
    });

    fields.push({
        name: "Região: "+region.name,
        value: "**Local:** "+user.place
    });

    if(events.length == 0){
        triggers.push("Nenhum comando especial nesse local");
    }else{
        for(e in events){
            triggers.push("**"+events[e].trigger+"** "+events[e].name);
        }
    }

    fields.push({
        name: "Comandos",
        value: triggers.join('\n')
    });

    if(region.type == 'city'){
        field = {
            name: "**Prédios**",
            value: connections.join(', ')
        };
    }else{
        field = {
            name: "**Conexões**",
            value: connections.join(', ')
        };
    }

    fields.push(field);

    fields.push({
        name: "**\nTime\n**",
        value: "** **"
    });

    if(poke.length == 0){
        fields.push({
            name: "**Você ainda não possui pokemons",
            value: "** **"
        });
    }else{
        console.log(poke);
        for(p in poke){
            fields.push({
                name: poke[p].name,
                value: "Lv "+poke[p].level,
                inline: true
            });
        }
        while(fields.length%3!=0){
            fields.push({
                name: "** **",
                value: "** **",
                inline: true
            });
        }
    }

    exports.message.channel.send({
        embed: {
            title: '**PokeBot**',
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });
};

exports.enviarGenerico = function(title, texto){
    exports.message.channel.send({
        embed: {
            title: '**PokeBot**',
            color: 11534368,
            // description: '',
            fields: [{
                name: title,
                value: texto
              }
            ]
        },
        content: ''
    });
};