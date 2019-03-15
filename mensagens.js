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

exports.enviarCheckagem = function(user, events, region, connections){
    triggers = [];

    if(events.length == 0){
        triggers.push("Nenhum comando especial nesse local");
    }else{
        for(e in events){
            triggers.push("**"+events[e].trigger+"** "+events[e].name);
        }
    }

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

    exports.message.channel.send({
        embed: {
            title: '**PokeBot**',
            color: 11534368,
            // description: '',
            fields: [{
                name: user.nome+" Lv"+user.level,
                value: "("+user.exp+"/"+user.next+")"
            },{
                name: "Região: "+region.name,
                value: "**Local:** "+user.place
            },{
                name: "Comandos",
                value: triggers.join('\n')
            },field
        ]},
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