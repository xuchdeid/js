const XLSX = require('xlsx');
require('http').globalAgent.maxSockets = 10;
const request = require('request');

const debug = 0;

function buildGetRequest(url, params) {
    url += '?';
    for (name in params) {
        url += name + '=' + params[name] + '&';
    }
    return url.substr(0, url.length - 1);
}

var httpCount = 0;

function _get(url, params) {
    var _url = buildGetRequest(url, params);
    return new Promise((resolve, reject) => {
        httpCount++;
        request.get(_url, function(error, response, body) {
            httpCount--;
            console.log(httpCount);
            if (!error && response.statusCode == 200) {
                result = JSON.parse(body);
                resolve(result);
            } else {
                reject(new Error(error));
            }
        });
    });
}

/*function get(url, params, onSuccess, onError) {
    var _url = buildGetRequest(url, params);
    //console.log("get " + _url);
    index++;
    request.get(_url, function(error, response, body) {
        index--;
        console.log("index:" + index);
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);
            onSuccess(result);
        } else {
            console.log(body);
            console.log(error);
            onError(error);
        }
    });
}*/

function get(url, params, onSuccess, onError) {
    var _url = buildGetRequest(url, params);
    httpCount++;
    request.get(_url, function(error, response, body) {
        httpCount--;
        console.log(httpCount);
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);
            onSuccess(result);
        } else {
            onError(error);
        }
    });
}

/*function writeCSV(headers, lists, fileName) {
    if (debug) return;
    var _headers = headers
        .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
        .reduce((prev, next) => Object.assign({}, prev, {
            [next.position]: { v: next.v }
        }), {});
    var data = lists
        .map((v, i) => headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
        .reduce((prev, next) => prev.concat(next))
        .reduce((prev, next) => Object.assign({}, prev, {
            [next.position]: { v: next.v }
        }), {});
    // 合并 headers 和 data
    var output = Object.assign({}, _headers, data);
    // 获取所有单元格的位置
    var outputPos = Object.keys(output);
    // 计算出范围
    var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    // 构建 workbook 对象
    var wb = {
        SheetNames: ['mySheet'],
        Sheets: {
            'mySheet': Object.assign({}, output, { '!ref': ref })
        }
    };
    // 导出 Excel
    XLSX.writeFile(wb, fileName);
}*/

const search_params = {
    access_token: "7poanTTBCymmgE0FOn1oKp",
    client: "pc",
    cityCode: "sh",
    community_id: "5011000015238",
    limit_offset: 1,
    limit_count: 200
};

var search_url = "http://soa.dooioo.com/api/v4/online/house/ershoufang/search";

/*function searchSuccess(lists, resultAll) {
    if (lists && lists.length > 0) {
        let min, max;
        let sum = 0;
        for (let i = 0; i < lists.length; i++) {
            let item = lists[i];
            sum += parseFloat(item.average);

            if (!min) {
                min = item;
            }
            if (!max) {
                max = item;
            }
            if (min.average > item.average) {
                min = item;
            }
            if (max.average < item.average) {
                max = item;
            }
        }
        let avarage = (sum / lists.length).toFixed(2);
        //console.log("community_id: " + min.community_id + " count: " + lists.length + " avarage: " + avarage + " min: " + min.average + " max: " + max.average);
        //console.log("community_id: " + min.community_id + " min id：" + "http://sh.lianjia.com/ershoufang/sh" + min.id + ".html 面积：" + min.area + " 总价：" + min.price);
        //console.log("community_id: " + min.community_id + " max id：" + "http://sh.lianjia.com/ershoufang/sh" + max.id + ".html 面积：" + max.area + " 总价：" + max.price);
        //writeCSV(['community_id', 'id', 'area', 'price', 'average', 'url'], lists, 'outputs/search' + min.community_id + '.xlsx');

        resultAll.push({
            id: min.community_id,
            min: min.average,
            max: max.average,
            average: avarage,
            dy: max.average - min.average,
            count: lists.length,
            showName: location[min.community_id].showName,
            latitude: location[min.community_id].latitude,
            longitude: location[min.community_id].longitude
        });

        if (index == 0) {
            //writeCSV(['id', 'min', 'max', 'average', 'dy', 'count', 'showName', 'latitude', 'longitude'], resultAll, 'resultAll.xlsx');
        }
    }
}*/

function _searchByCommunityId(community) {
    var _params = {};
    for (name in search_params) {
        _params[name] = search_params[name];
    }
    _params.community_id = community.id;

    return new Promise((resolve, reject) => {
        get(search_url, _params, function(result) {
            if (result.status === "ok") {
                var lists = [];
                var count = result.data.total_count;
                var list = result.data.list;

                for (var i = 0; i < count; i++) {
                    try {
                        var area = parseFloat(list[i].acreage);
                        var price = parseFloat(list[i].showPrice);
                        lists.push({
                            community_id: community.id,
                            id: list[i].houseSellId,
                            area: area,
                            price: price,
                            average: parseFloat((price / area).toFixed(2)),
                            url: "http://sh.lianjia.com/ershoufang/sh" + list[i].houseSellId + ".html",
                        });
                    } catch (error) {
                        reject(error.message);
                        return;
                    }
                }

                if (lists && lists.length > 0) {
                    let min, max;
                    let sum = 0;
                    for (let i = 0; i < lists.length; i++) {
                        let item = lists[i];
                        sum += parseFloat(item.average);

                        if (!min) {
                            min = item;
                        }
                        if (!max) {
                            max = item;
                        }
                        if (min.average > item.average) {
                            min = item;
                        }
                        if (max.average < item.average) {
                            max = item;
                        }
                    }
                    let avarage = (sum / lists.length).toFixed(2);

                    var _result = {
                        id: min.community_id,
                        min: min.average,
                        max: max.average,
                        average: avarage,
                        dy: max.average - min.average,
                        count: lists.length,
                        showName: community.showName,
                        latitude: community.latitude,
                        longitude: community.longitude
                    };
                    resolve(_result);
                } else {
                    reject(new Error(community.showName + ' lists length is 0!'));
                }
            } else {
                reject(new Error(community.showName + ' ' + JSON.stringify(result)));
            }
        }, function(error) {
            reject(new Eror(community.showName + ' ' + error));
        });
    });
}

/*function searchByCommunityId(community_id, resultAll) {
    var _params = {};
    for (name in search_params) {
        _params[name] = search_params[name];
    }
    _params.community_id = community_id;

    get(search_url, _params, function(result) {
        if (result.status === "ok") {
            var lists = [];
            //console.log(result.data.total_count);
            var count = result.data.total_count;
            var list = result.data.list;

            for (var i = 0; i < count; i++) {
                try {
                    var area = parseFloat(list[i].acreage);
                    var price = parseFloat(list[i].showPrice);
                    lists.push({
                        community_id: community_id,
                        id: list[i].houseSellId,
                        area: area,
                        price: price,
                        average: parseFloat((price / area).toFixed(2)),
                        url: "http://sh.lianjia.com/ershoufang/sh" + list[i].houseSellId + ".html",
                    });
                    //console.log(lists[i]);
                } catch (error) {
                    console.log(JSON.stringify(result));
                    throw error;
                }
            }
            searchSuccess(lists, resultAll);
        } else {
            console.log(result);
        }
        //index++;
        //console.log("index:" + index + " all:" + allCounts + " index_lat:" + index_lat + " size_latitude:" + size_latitude + " index_long:" + index_long + " size_longitude:" + size_longitude);
        //if (index >= allCounts && index_lat >= size_latitude && index_long >= size_longitude) {
        //writeCSV(['id', 'min', 'max', 'average', 'dy', 'count'], resultAll, 'resultAll.xlsx');
        //}
    });
}*/

const list_params = {
    access_token: "7poanTTBCymmgE0FOn1oKp",
    client: "pc",
    cityCode: "sh",
    type: "village",
    siteType: "quyu",
    minLatitude: 31.143173, //0.03
    maxLatitude: 31.170708,
    minLongitude: 121.38811,
    maxLongitude: 121.417035 //0.03
};

var list_map_url = "http://soa.dooioo.com/api/v4/online/house/ershoufang/listMapResult";

function searchAll() {
    var minLatitude = 30.9144138398; //31.216322;
    var minLongitude = 121.2358464801; //121.295075;

    var maxLatitude = 31.3876975508; //31.302106;
    var maxLongitude = 121.9284865585; //121.512896;

    var size_latitude = 5; //15; //(maxLatitude - minLatitude) / step;
    var size_longitude = 5; //23; //(maxLongitude - minLongitude) / step;
    var step = 0.03;
    var index_lat = 0;
    var index_long = 0;

    var resultAll = [];

    for (var lat_i = 0; lat_i < size_latitude; lat_i++, index_lat = lat_i) {
        var _minLatitude = minLatitude + lat_i * step;
        for (var long_j = 0; long_j < size_longitude; long_j++, index_long = long_j) {
            var sear_params = {};
            for (name in list_params) {
                sear_params[name] = list_params[name];
            }

            _minLongitude = minLongitude + long_j * step;

            sear_params.minLatitude = _minLatitude;
            sear_params.maxLatitude = _minLatitude + step;
            sear_params.minLongitude = _minLongitude;
            sear_params.maxLongitude = _minLongitude + step;

            _get(list_map_url, sear_params)
                .then(result => {
                    if (result.status === "ok") {
                        var lists = [];
                        var count = result.dataCount;
                        var list = result.dataList;
                        var allCounts = list.length;

                        if (allCounts == 0) {
                            throw new Error('allCounts is 0!');
                        }
                        for (var i = 0; i < allCounts; i++) {
                            lists.push({
                                id: list[i].dataId,
                                saleTotal: list[i].saleTotal,
                                showName: list[i].showName,
                                latitude: list[i].latitude,
                                longitude: list[i].longitude
                            });
                        }
                        return lists;
                    } else {
                        throw new Error(JSON.stringify(result));
                    }
                })
                .then(lists => {
                    var all = [];
                    lists.map(value => {
                        //console.log(value);
                        all.push(_searchByCommunityId(value));
                    });
                    return Promise.all(all);
                })
                .then(results => {
                    results.map(value => {
                        //console.log(value);
                        resultAll.push(value);
                    })
                })
                .catch(error => {
                    //console.log(error.message);
                });
        }
    }

    console.log('resultAll.length ' + resultAll.length);
}

searchAll();