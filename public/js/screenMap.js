require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Directions",
    "esri/layers/RouteLayer",
    "esri/widgets/BasemapToggle"
], (esriConfig, Map, SceneView, Graphic, GraphicsLayer, Directions, RouteLayer, BasemapToggle) => {
    var apikey = esriConfig.apiKey = "AAPK6e879e37c5854b9c8d3f10e493fd9de3Gb_AV0_tofBllBWMWTtzqXiNNAXNTth2CKUWay0efrsMdaxKVRwQ6X0cjcbUaOJK";
    const routeLayer = new RouteLayer();
    const map = new Map({
        basemap: {
            portalItem: {
                id: "868ee22ceb3341129b3531b514d5c749"
            }
        },
        layers: [routeLayer]
    });
    const view = new SceneView({
        container: "viewDiv",
        map: map,
        scale: 50000000,
        center: [120, 38],
        constraints: { //设置约束条件
            minZoom: 2,
            maxZoom: 18
        }
    });

    view.ui._removeComponents(["attribution"]);
    let basemapToggle = new BasemapToggle({
        view: view,  // The view that provides access to the map's "streets-vector" basemap
        nextBasemap: "hybrid"  // Allows for toggling to the "hybrid" basemap
    });
    view.ui.add(basemapToggle, {
        position: "bottom-left"
    });
    const graphicsLayer = new GraphicsLayer();

    let directionsWidget = new Directions({
        layer: routeLayer,
        apikey,
        view
    });

    view.ui.add(directionsWidget, {
        position: "top-right"
    });
    //获取城市点
    $.ajax({
        url: '/api/getCityChoose',
        data: {
            city: 'locationInfo'
        },
        method: "GET",
    }).done(function (data) {
        if (data[0].ret) {
            let parse = JSON.parse(data[0].code);
            let cityList = parse.locationInfo;
            for (let i = 0; i < cityList.length; i++) {
                var pointCity = { //Create a point
                    type: "point",
                    longitude: cityList[i].longitude,
                    latitude: cityList[i].latitude
                };
                var pointCityFonts = { //Create a point
                    type: "point",
                    longitude: cityList[i].longitude,
                    latitude: cityList[i].latitude
                };

                var maskerCity = {
                    type: "simple-marker",
                    color: '#00E5FF',  // Orange
                    outline: {
                        color: [255, 255, 255], // White
                        width: 1
                    },
                    myData: { //自定义数据
                        cid: cityList[i].name,
                        cnm: cityList[i].chinese,
                        type: 'stock'
                    }
                };

                var maskerCityFonts = {
                    type: "text",
                    color: '#00E5FF',
                    text: cityList[i].chinese,
                    xoffset: 10,
                    yoffset: 10,
                    font: {
                        size: 12,
                    }

                };
                var pointGraphicCity = new Graphic({
                    geometry: pointCity,
                    symbol: maskerCity
                });

                var pointGraphicCityFonts = new Graphic({
                    geometry: pointCityFonts,
                    symbol: maskerCityFonts
                });
                graphicsLayer.add(pointGraphicCity);
                graphicsLayer.add(pointGraphicCityFonts);
            }
        }
    });

    //获取深圳边界
    $.ajax({
        url: '/api/getCityChoose',
        data: {
            city: 'shenzhen'
        },
        method: "GET",
    }).done(function (data) {
        if (data[0].ret) {
            $.each(JSON.parse(data[0].code), (i, row) => {
                let plGraphic = new Graphic({
                    'geometry': {
                        'type': 'polygon',
                        'rings': row
                    },
                    'symbol': {
                        'width': 2,
                        'type': 'simple-line',
                        'color': '#00E5FF'
                    }
                })
                graphicsLayer.add(plGraphic);
            })
            map.add(graphicsLayer);
        }
    });

    $.ajax({
        url: '/api/getCityChoose',
        data: {
            city: 'beijing'
        },
        method: "GET",
    }).done(function (data) {
        if (data[0].ret) {
            $.each(JSON.parse(data[0].code), (i, row) => {
                let plGraphic = new Graphic({
                    'geometry': {
                        'type': 'polygon',
                        'rings': row
                    },
                    'symbol': {
                        'width': 2,
                        'type': 'simple-line',
                        'color': '#00E5FF'
                    }
                })
                graphicsLayer.add(plGraphic);
            })
            map.add(graphicsLayer);
        }
    });

    //地图点击事件
    view.on('click', e => {
        if (e.button == 0) {
            view.hitTest(e).then(res => {
                let cityId = res.results[0].graphic.symbol.myData.cid;
                let cityName = res.results[0].graphic.symbol.myData.cnm;

                var index = layer.open({
                    title: cityName,
                    type: 2,
                    content: '../pages/idea/invest-city-settle.html?cityId=' + cityId,
                    area: ['1920px', '100vh'],
                })
                layer.full(index);
            });
        }
    });
});