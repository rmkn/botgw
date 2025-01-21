const { App } = require('@slack/bolt');

const app = new App({
    logLevel: 'debug',
    socketMode: true,
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN
});

app.message(async ({ client, message, logger, say, context }) => {
    if (message.subtype !== undefined) {
        return;
    }
    try {
        const userinfo = await client.users.info({
            user: message.user
        });

        var msg = {
            type: message.type,
            user: message.user,
            text: message.text,
            thread_ts: message.thread_ts,
            channel: message.channel,
            name: userinfo.user.name,
            real_name: userinfo.user.real_name,
            ts: message.ts,
            botUserId: context.botUserId
        }
        logger.debug(context, message, msg, userinfo);

        const response = await fetch(process.env.URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msg)
	});
        if (response.ok) {
            const data = await response.text();
	    if (data != "") {
                say({text:data, thread_ts:msg.thread_ts});
            }
        }
    } catch (e) {
      logger.error(e);
    }
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app started');
})();
