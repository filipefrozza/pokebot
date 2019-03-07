const auth = require('./auth.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
// var dinoex = require('./dino-ex.js');
var pokemon = require('./pokemon.js');
var bot = require('./bot.js');
var mensagens = require('./mensagens.js');
var pokedb;
var cronjob = require('cron').CronJob;

MongoClient.connect('mongodb://localhost:27017/pokemon',{ useNewUrlParser: true }, function(err, mongo){
	if (err) return console.log(err);
  	pokedb = mongo.db("pokemon"); // whatever your database name is
  	console.log("Mongo conectado");
  	bot.data = {
  		client: client,
  		auth: auth,
  		pokemon: pokemon,
  		pokedb: pokedb,
  		mensagens: mensagens,
  		cronjob: cronjob
  	};
  	bot.iniciarBot();
});
