const request = require('request');

function buildGetRequest(url, params) {
    url += '?';
    for (name in params) {
        url += name + '=' + params[name] + '&';
    }
    return url.substr(0, url.length - 1);
}

function _get(url, params) {
    var _url = buildGetRequest(url, params);
    return new Promise((resolve, reject) => {
        request.get(_url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                result = JSON.parse(body);
                resolve(result);
            } else {
                reject(new Error(error));
            }
        });
    });
}

function getLastById(id) {
    const params = {
        FCODE: id,
        RANGE: "y",
        deviceid: "Wap",
        plat: "Wap",
        product: "EFund",
        version: "2.0.0"
    };
    
    const url = "https://fundmobapi.eastmoney.com/FundMApi/FundVarietieValuationDetail.ashx";

    return _get(url, params);
}

function getByList(tips, fcodes) {
    Promise
    .resolve(fcodes)
    .then(list => {
        var all = [];
        list.map(value => {
            all.push(getLastById(value));
        });
        return Promise.all(all);
    })
    .then(results => {
        console.log(tips)
        results.map(value => {
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
        })
    })
    .catch(error => {
        console.log(error.message);
    });
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

var fcodes = ['519696', '001630', '000962', '001878', '004343', '501301', '210009'];
getByList("=========================================", fcodes);

var fcodes = ['161715', '241001', '001542', '501301', '004346', '000962', '420003', '001810', '160716', '001878', '164906', '210009', '519696', '378006', '162415', '000961', '378546', '001549', '519983', '377016', '002400', '001559', '002086'];
getByList("*****************************************", fcodes);