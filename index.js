import * as fs from 'fs';
import Discord from 'discord.js';

import parser from './core/parser.js';
import execute from './core/execute.js';

const client = new Discord.Client();

//Get config
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('message', msg => {
    global.msg = msg;
    const parsed = parser.parse(config.prefix);

    //If parser returned nothing stop execution
    if (!parsed) return;

    const executed = execute.command(config.prefix, parsed.command, parsed.suffix);
})

client.login(config.token);
