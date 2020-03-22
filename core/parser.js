class Parser {
    parse(prefix) {
        //Check if message starts with prefix
        let input = global.msg.content;
        if (prefix) {
            if (!input.startsWith(prefix)) return;
            input = input.replace(prefix, '');
        }

        //Get command with regexp
        let command = input.replace(/\s.*/, '');
        //Get suffix from whats left
        let suffix = input.replace(command, '').trim();
        return {
            command: command,
            suffix: suffix
        };
    }
}

export default new Parser();
