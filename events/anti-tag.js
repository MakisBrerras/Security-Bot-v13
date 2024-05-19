const client = require('../index');
let isEnabled = true // false to disable

client.on('messageCreate', async message => {
    if (isEnabled) {
        if (message.content.includes('@everyone') || message.content.includes('@here')) {

            if (message.member.permissions.has('MANAGE_CHANNELS')) return;
    
            message.delete();
        }
    }
})