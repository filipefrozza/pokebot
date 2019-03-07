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

exports.listarTriggers = function(events){
    triggers = [];

    for(e in events){
        triggers.push("**"+events[e].trigger+"** "+events[e].name);
    }

    exports.message.channel.send({
        embed: {
            title: '**PokeBot**',
            color: 11534368,
            // description: '',
            fields: [{
                name: "Comandos",
                value: triggers.join('\n')
              }
            ]
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