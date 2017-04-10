"use strict";

/**
 * Insert historic data straight into InfluxDB
 */

const config    = require('./config');
const Influx    = require('influx');

/**
 * Models
 */
const readingModel = require('./models/reading');

/**
 * Influx setup
 */
const influx = new Influx.InfluxDB({
    host:       config.influxdb.host,
    port:       config.influxdb.port,
    username:   config.influxdb.username,
    password:   config.influxdb.password,
    database:   config.influxdb.database,
    schema:     readingModel
});

const sensors = {
    1: { type: 'temperature', unit: 'celcius' },
    2: { type: 'humidity', unit: 'percent' },
    3: { type: 'wind', unit: 'beaufort' },
    4: { type: 'rainfall', unit: 'millimeters'}
};

/**
 * Insert reading for every minute
 */
let date = new Date();
date.setSeconds(0);

for (let day = 1; day < 2; day++) { // 100 days

    date.setDate(date.getDate() - day);

    for (let hour = 1; hour <= 24; hour++) { // 24 hours

        date.setHours(hour);

        for (let minute = 1; minute <= 60; minute++) { // 60 minutes

            date.setMinutes(minute);

            // pick a sensor
            var message = {
                'uuid': config.uuids[Math.floor((Math.random() * config.uuids.length))],
                'location': 'CHIBB',
                'readings': [],
                'battery': parseFloat(((Math.random() * 100) + 1).toFixed(2))
            };

            // add sensor types & readings
            for (let i = 0; i < Math.floor((Math.random() * 5) + 1); i++) {

                let sensor = Math.floor((Math.random() * 4) + 1);

                // save it
                influx.writePoints([
                    {
                        measurement: 'readings',
                        fields: {
                            uuid: message.uuid,
                            location: message.location,
                            type: sensors[sensor]['type'],
                            reading: parseFloat(((Math.random() * 30) + 1).toFixed(2)),
                            unit: sensors[sensor]['unit'],
                            battery: message.battery
                        },
                        timestamp: date,
                    }
                ]).catch(err => {
                    console.error(`Error saving data to InfluxDB! ${err.stack}`)
                });

                sleep(1000);
            }
        }
    }
}

function sleep(milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}