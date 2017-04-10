"use strict";

/**
 * Generate fake sensor data for the MQTT-broker
 */

const config = require('./config');
const mqtt = require('mqtt');

// Create a client connection
const client = mqtt.connect(config.mqtt.host, {
    port:       config.mqtt.port,
    clientId:   'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username:   config.mqtt.username,
    password:   config.mqtt.password
});

const sensors = {
    1: { type: 'temperature', unit: 'celcius' },
    2: { type: 'humidity', unit: 'percent' },
    3: { type: 'wind', unit: 'beaufort' },
    4: { type: 'rainfall', unit: 'millimeters'}
};

const message = {
    'uuid': config.uuids[Math.floor((Math.random() * config.uuids.length))],
    'location': 'CHIBB',
    'readings': [],
    'battery': parseFloat(((Math.random() * 100) + 1).toFixed(2))
};

for (let i = 0; i < Math.floor((Math.random() * 5) + 1); i++) {

    let sensor = Math.floor((Math.random() * 4) + 1);

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