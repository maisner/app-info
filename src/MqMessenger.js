class MqMessenger {

	constructor (onMessageCallback) {
		var q = 'appInfo.msg.queue';
		var exchange = 'appInfo.msg.exchange';

		function bail (err) {
			console.error(err);
			process.exit(1);
		}

		// Consumer
		function consumer (conn, callback) {
			var ok = conn.createChannel(on_open);

			function on_open (err, ch) {
				if (err != null) bail(err);
				let queue = ch.assertQueue('', {durable: false});
				ch.bindQueue(queue.queue, exchange);
				ch.consume(queue.queue, function (msg) {
					if (msg !== null) {
						callback(msg.content.toString())
						// console.log(msg.content.toString());
						ch.ack(msg);
					}
				});
			}
		}

		require('amqplib/callback_api')
			.connect('amqp://localhost:5673', function (err, conn) {
				if (err != null) bail(err);
				consumer(conn, onMessageCallback);
				// publisher(conn);
			});
	}
}

module.exports = MqMessenger;
