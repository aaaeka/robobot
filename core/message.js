import Discord from 'discord.js';

class Message {
    error(error) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Error')
            .setColor('#ff5050')
            .setDescription(error)
        global.msg.channel.send(embed);
    }

    simple(text, color = '#a2fc71') {
        const embed = new Discord.MessageEmbed()
            .setTitle(text)
            .setColor(color)
        global.msg.channel.send(embed);
    }

    queueAdd(added, queueSize) {
        let text;
        if (typeof added !== 'number')
            text = `Succesfully added song '${added}' to queue`;
        else
            text = `Sucessfully added ${added} songs to queue`;

        const embed = new Discord.MessageEmbed()
            .setTitle(text)
            .setColor('#a2fc71')
            .setFooter(`Currently in queue: ${queueSize} song(s)`)
        global.msg.channel.send(embed);
    }

    video(title, author, link, queueSize, thumbnail, authorAvatar, authorLink) {
        const embed = new Discord.MessageEmbed()
            .setURL(link)
            .setAuthor(author, authorAvatar, authorLink)
            .setTitle(title)
            .setColor('#a2fc71')
            .setImage(thumbnail)
            .setFooter(`Currently in queue: ${queueSize} song(s)`)
        global.msg.channel.send(embed);
    }

    queue(title, list) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('#a2fc71')

        list.forEach((item, key) => {
            ++key;
            embed.addField(key + '.', item, true);
        });

        global.msg.channel.send(embed);
    }

}

export default new Message();
