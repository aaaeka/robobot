import Discord from 'discord.js';

class Message {
    error(string) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Error')
            .setColor('#ff5050')
            .setDescription(string)
        global.msg.channel.send(embed);
    }
}

export default new Message();
