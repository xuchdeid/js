const Fund = require('./Fund').Fund;
const EventEmitter = require('events').EventEmitter;
require('console.table');

'use strict';

/**
 * 显示最新的数据
 * @param {*} value 
 */
function showLastValue(value) {
    let Expansion = value.Expansion;
    let Datas = value.Datas;
    let data = Datas[Datas.length - 1];
    if (data) {
        let list = data.split(',');
        let _value = list[list.length - 1];
        let _last_value = list.length >= 2 ? list[list.length - 2] : _value;
        let trend = ' →';
        if (_last_value < _value) {
            trend = ' ↗︎';
        } else if (_last_value > _value) {
            trend = ' ↘︎';
        }
        if (_value > 0) {
            printRedConsole(30, Expansion.SHORTNAME, '(' + _value + ')' + trend);
        } else {
            printGreenConsole(30, Expansion.SHORTNAME, '(' + _value + ')' + trend);
        }
    } else {
        printRedConsole(30, Expansion.SHORTNAME, '(---)');
    }
}

/**
 * 最新的数据
 * @param {*} value 
 */
function getLastValue(value) {
    let Expansion = value.Expansion;
    let Datas = value.Datas;
    let data = Datas[Datas.length - 1];
    if (data) {
        let list = data.split(',');
        let _value = list[list.length - 1];
        let _last_value = list.length >= 2 ? list[list.length - 2] : _value;
        let trend = '  →';
        if (_last_value < _value) {
            trend = '  ↗︎';
        } else if (_last_value > _value) {
            trend = '  ↘︎';
        }

        return {
            name: Expansion.SHORTNAME,
            value: _value,
            trend: trend
        };
    } else {
        return {
            name: Expansion.SHORTNAME,
            value: '-------',
            trend: '  -'
        };
    }
}

function showTodayAll(value) {
    let Expansion = value.Expansion;
    let Datas = value.Datas;

    if (Datas && Datas.length > 0) {
        let process_datas = [];
        Datas.map(data => {
            let list = data.split(',');
            process_datas.push(list[list.length - 1]);
        });

        let _data = '';
        process_datas.map(data => {
            _data += data + ',';
        });

        let last = process_datas[process_datas.length - 1];
        if (last > 0) {
            printRedConsole(10, Expansion.SHORTNAME, '(' + _data + ')');
        } else {
            printGreenConsole(10, Expansion.SHORTNAME, '(' + _data + ')');
        }
    } else {
        printRedConsole(10, Expansion.SHORTNAME, '(---)');
    }    
}

/**
 * 显示今天所有数据（画图表）
 * @param {*} value 
 */
function showTodayValues(value) {
    let Expansion = value.Expansion;
    let Datas = value.Datas;

    if (Datas && Datas.length > 0) {
        //console.log(Datas);
        printRedConsole(10, Expansion.SHORTNAME, '(-)');
        let process_datas = [];
        let max, min;
        Datas.map(data => {
            let list = data.split(',');
            let _value = parseInt((list[list.length - 1] * 100).toFixed(0));
            if (max == undefined || _value > max) {
                max = _value;
            }
            if (min == undefined || _value < min) {
                min = _value;
            }
            process_datas.push(_value);
        });
        //console.log(process_datas);
        //console.log("max:" + max + " min:" + min);
        let length = max - min;
        let result = [];
        process_datas.map(data => {
            result.push((data - min) / length);
        });

        let y = ''.padEnd(100, '-') + '> y';
        console.log(y);
        let start = (0 - min) / length;
        result.map(value => {
            drawLine(100, value, start);
        });
        let x = ''.padEnd(parseInt((100 * start).toFixed(0)), ' ') + ' ';
        let _x = ''.padEnd(parseInt((100 * start).toFixed(0)), ' ') + 't';
        console.log(x);
        console.log(_x);
    } else {
        printRedConsole(10, Expansion.SHORTNAME, '(---)');
    }
}

function drawLine(max, value, start) {
    let _value = parseInt((max * value).toFixed(0));
    let _start = parseInt((max * start).toFixed(0));

    let line = '';
    for (let i = 0; i < max; i++) {
        //if (i == _start) {
        //    line += '|';
        //} else if (i == _value) {
        //    line += '-';
        //} else {
        //    line += ' ';
        //}
        if (i == _start) {
            line += '|';
        } else if (((_value < _start) && (i >= _value && i < _start)) ||
            ((_value > _start) && (i > _start && i <= _value))) {
            line += '-';
        } else {
            line += ' ';
        }
    }

    /*if (_value >= _start) {
        console.log('\x1b[31m%s\x1b[0m', line);
    } else {
        console.log('\x1b[32m%s\x1b[0m', line);
    }*/

    console.log(line);
}

function printRedConsole(size, name, value) {
    let _data = name + value;
    let space_length = size - _data.length;
    let _value_string = '';
    if (space_length > 0) {
        for (let i = 0; i < space_length; i++) {
            _value_string += ' ';
        }
        _value_string += value;
    } else {
        _value_string = value;
    }

    console.log('\x1b[36m%s \x1b[31m%s\x1b[0m', name, _value_string);
}

function printGreenConsole(size, name, value) {
    let _data = name + value;
    let space_length = size - _data.length;
    let _value_string = '';
    if (space_length > 0) {
        for (let i = 0; i < space_length; i++) {
            _value_string += ' ';
        }
        _value_string += value;
    } else {
        _value_string = value;
    }

    console.log('\x1b[36m%s \x1b[32m%s\x1b[0m', name, _value_string);
}

let fund = new Fund();
//var fcodes = ['161715', '241001', '001542', '501301', '004346', '000962', '420003', '001810', '160716', '001878', '164906', '210009', '519696', '378006', '162415', '000961', '378546', '001549', '519983', '377016', '002400', '001559', '002086'];
let fcodes = ['519696', '001630', '000962', '001878', '004343', '501301', '210009', '164401', '001559', '001549', '000961'];
let event = new EventEmitter(); 

event.on('refresh', () => {
    console.clear();
    event.emit('next');
    console.time('net');
    fund.gets(fcodes)
        .then(results => {
            let shows = [];
            results.map(value => {
                //showLastValue(value);
                shows.push(getLastValue(value));
            });
            console.table(shows);
            console.timeEnd('net');
        })
        .catch(error => {
            console.log(error.message);
            console.timeEnd('net');
        });
});

event.on('next', () => {
    setTimeout(function() {
        event.emit('refresh');
    }, 60000);
});

event.emit('refresh');