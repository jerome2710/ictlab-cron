var config = require('./config');
var mqtt = require('mqtt');

var options = {
    port:       config.mqtt.port,
    clientId:   'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username:   config.mqtt.username,
    password:   config.mqtt.password
};

// Create a client connection
var client = mqtt.connect(config.mqtt.host, options);

var uuids = [
    '50e1aead-9d27-499f-9329-2b6524039a55',
    '7e2cf1fd-9d96-46f8-bae5-665d80a2d89a',
    '18a350ec-eb24-46e2-93b5-09b34c0c7f6b',
    'ad138068-4fa3-4b3f-ad0e-64da9a93bc47',
    '69de1acc-8fc9-4127-83e8-34b671ad19e0'
];

var sensors = {
    1: { type: 'temperature', unit: 'celcius' },
    2: { type: 'humidity', unit: 'percent' },
    3: { type: 'wind', unit: 'beaufort' },
    4: { type: 'rainfall', unit: 'millimeters'}
};

var message = {
    'uuid': uuids[Math.floor((Math.random() * uuids.length))],
    'location': 'CHIBB',
    'readings': [],
    'battery': parseFloat(((Math.random() * 100) + 1).toFixed(2))
};

for (var i = 0; i < Math.floor((Math.random() * 5) + 1); i++) {

    var sensor = Math.floor((Math.random() * 4) + 1);

    message['readings'].push({
        type: sensors[sensor]['type'],
        reading: parseFloat(((Math.random() * 30) + 1).toFixed(2)),
        unit: sensors[sensor]['unit'],
        timestamp: Math.floor(Date.now() / 1000)
    });
}

client.on('connect', function() {
    client.publish('sensors', JSON.stringify(message), function() {
        client.end();
    });
});