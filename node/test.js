var Fund = require('./Fund').Fund;

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

        if (_value > 0) {
            printRedConsole(10, Expansion.SHORTNAME, "(" + _value + ")");
        } else {
            printGreenConsole(10, Expansion.SHORTNAME, "(" + _value + ")");
        }
    } else {
        printRedConsole(10, Expansion.SHORTNAME, "(---)");
    }
}

/**
 * 显示今天所有数据
 * @param {*} value 
 */
function showTodayValues(value) {
    let Expansion = value.Expansion;
    let Datas = value.Datas;

    if (Datas && Datas.length > 0) {
        //console.log(Datas);
        printRedConsole(10, Expansion.SHORTNAME, "(-)");
        let process_datas = [];
        let max, min;
        Datas.map(data => {
            let list = data.split(',');
            var _value = parseInt((list[list.length - 1] * 100).toFixed(0));
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
        })
        let x = ''.padEnd(parseInt((100 * start).toFixed(0)), ' ') + ' ';
        let _x = ''.padEnd(parseInt((100 * start).toFixed(0)), ' ') + 't';
        console.log(x);
        console.log(_x);
    } else {
        printRedConsole(10, Expansion.SHORTNAME, "(---)");
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
    var _data = name + value;
    var space_length = size - _data.length;
    var _value_string = '';
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
    var _data = name + value;
    var space_length = size - _data.length;
    var _value_string = '';
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

var fund = new Fund();
//var fcodes = ['161715', '241001', '001542', '501301', '004346', '000962', '420003', '001810', '160716', '001878', '164906', '210009', '519696', '378006', '162415', '000961', '378546', '001549', '519983', '377016', '002400', '001559', '002086'];
var fcodes = ['519696', '001630', '000962', '001878', '004343', '501301', '210009', '164401', '001559', '001549', '000961'];
fund.gets(fcodes)
    .then(
        results => {
            results.map(value => {
                showLastValue(value);
            });
        }
    )
    .catch(
        error => {
            console.log(error.message);
        }
    );