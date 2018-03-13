var Http = require('./Http').Http;

'use strict';

module.exports = {
    Fund: Fund
}

function Fund() {
    this._http = new Http('https://fundmobapi.eastmoney.com');
}

Fund.prototype.gets = function(list) {
    return Promise.resolve(list)
        .then(
            list => {
                var all = [];
                list.map(value => {
                    all.push(this.get(value));
                });
                return Promise.all(all);
        
            }
        );
}

Fund.prototype.get = function(id) {
    var params = {
        FCODE: id,
        RANGE: "y",
        deviceid: "Wap",
        plat: "Wap",
        product: "EFund",
        version: "2.0.0"
    };
    return this._http.get('/FundMApi/FundVarietieValuationDetail.ashx', params);
}