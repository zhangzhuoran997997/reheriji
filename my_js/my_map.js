// ---------- 初始化 ----------

// 初始化地图
var mymap = L.map('map',{
    // 初始化坐标投影方式
    crs: L.CRS.EPSG4326
}).setView([40, 120], 6);

// 初始化左下角比例尺显示
L.control.scale({
    position: 'bottomleft',
    // maxWidth: 100,
    maxWidth: 100,
    imperial: false
}).addTo(mymap);

// 现代地图作为底图
var basemaps = {
    '现代矢量地图': basemap_from_tianditu().addTo(mymap)
};



// 设置疆域显示的不同颜色
function color_style(feature) {
    switch (feature.properties.LABEL_ENG) {
        case 'Dali':
            return {color: "#57e8ff"};
        case 'Xixia':
            return {color: "#48f55e"};
        case 'Jin':
            return {color: "#f83e72"};
        case 'Song':
            return {color: "#fffc00"};
    }
}

// 点击显示疆域国家名称
function onEachFeature(feature, layer) {
// does this feature have a property named popupContent?
    if (feature.properties && feature.properties.LABEL_CHN) {
        layer.bindPopup(feature.properties.LABEL_CHN);
    }
}

// 初始化
function basemap_from_tianditu() {
    var tk = '4ac37b55d321642032d8bc49a90d66d0';
    //var tk = 'd3991e428b0580383705c280e91e59fb';
    return L.tileLayer(
        'https://t1.tianditu.gov.cn/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk='
        +tk,
        {
            attribution: 'Map data &copy; <a href="http://worldmap.harvard.edu/maps/7086">ChinaXmap 6.0</a>, basemap &copy; <a href="http://www.tianditu.gov.cn">天地图</a>',
            zoomOffset: 1
        });
}

function basemap_ano_from_tianditu(){
    var tk = '4ac37b55d321642032d8bc49a90d66d0';
    // var tk = 'd3991e428b0580383705c280e91e59fb';
    return L.tileLayer('http://t0.tianditu.gov.cn/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk='
        +tk,
        {
            zoomOffset: 1
        });
}


// 初始化点组，定义加载点的函数
// 初始化时间轴的设置点位
var from_year = '六月二十四日辛末';
var to_year = '八月初九乙卯';
// 增加对应的图层
var event_marker_group = L.layerGroup();//事件点组图层
var online_marker_group = L.layerGroup(); //人物点组图层
var route_line_group = L.layerGroup(); //路线图层
// 路径途径点数组
var pathPointsArray = [];
var place_location_dict = {};
var place_event_dict = {};
var landscope_location_dict = {};
// 相关人物
var related_person = [];
// 已勾选事件类型/人物类型/地点类型
var checked_type_set = new Set();
var checked_person_set = new Set();
var checked_place_set = new Set();

// ---------- 初始化结束 ----------
load_markers_with_events();
load_markers_with_landscape("1");
// 本质上加了一个图层叠加，在右上角可以选择
// 添加南宋疆域图 不同颜色显示不同国家
$(document).ready(function() {
    $.getJSON("my_data/1142_AD_Song-Jin-Xi_Xia-Dali.json", function(data){
        var geoJSONLayer = {
            // 显示地图标记
            '地图标记': basemap_ano_from_tianditu().addTo(mymap),
            '使行节点': event_marker_group.addTo(mymap),
            '使行路线': route_line_group.addTo(mymap),
            '实景观览': online_marker_group.addTo(mymap)
        };

        // Create layer control
        L.control.layers(basemaps, geoJSONLayer).addTo(mymap);
    })
})
var nianhao_dict = {
    '六月二十四辛末':0,
    '六月二十五壬申':1,
    '六月二十六癸酉':2,
    '六月二十七甲戌':4,
    '六月二十八乙亥':5,
    '六月二十九丙子':6,
    '七月初一丁丑':8,
    '七月二日戊寅':9,
    '七月初三己卯':10,
    '七月初四庚辰':11,
    '七月初五辛巳':12,
    '七月初六壬午':13,
    '七月初七癸未':14,
    '七月初八甲申':16,
    '七月初九乙酉':17,
    '七月初十丙戌':19,
    '七月十一丁亥':21,
    '七月十二戊子':22,
    '七月十三己丑':24,
    '七月十四庚寅':26,
    '七月十五辛卯':28,
    '七月十六壬辰':30,
    '七月十七癸巳':32,
    '七月十八甲午':33,
    '七月十九乙未':35,
    '七月二十丙申':37,
    '七月二十一丁酉':39,
    '七月二十二戊戌':40,
    '七月二十三己亥':42,
    '七月二十五辛丑':44,
    '七月二十六壬寅':46,
    '七月二十七癸卯':48,
    '七月二十八甲辰':50,
    '七月二十九乙巳':52,
    '七月三十丙午':54,
    '八月初一丁未':56,
    '八月初六壬子':58,
    '八月初七癸丑':59,
    '八月初八甲寅':60,
    '八月初九乙卯':61,
};

// 清空图层函数
// 参数设置：无
// 效果：清空除底图外所有叠加图层，同时清空时间卡片栏
function clear_map(){
    var event_card_body = document.getElementById("event_card_body");
    event_card_body.innerHTML = "<p>该时段内本地所发生的事件列表</p>";
    event_marker_group.clearLayers();
    //person_marker_group.clearLayers();
    route_line_group.clearLayers();
}

// 行程点绘制函数
// 参数设置 起始年份 终止年份
// 效果：根据传入的起止时间，读取数据并绘制形成点
function load_markers_with_events(from_year_bc=0, to_year_bc=61){
    $(document).ready(function() {
        $.getJSON("my_data/abc.json", function (data) {
            //清空原有数据
            place_location_dict = {};
            place_event_dict = {};
            pathPointsArray = [];

            // 将data解析
            var json_arr = data.slice(from_year_bc,to_year_bc);
            //console.log(json_arr)
            // 设置当前年份所在起始地点
            var cur_xy_coordinates = json_arr[0]['xy_coordinates'];
            pathPointsArray.push(cur_xy_coordinates);

            // 对于所有的事件
            for (var i = 0; i < json_arr.length; i++) {

                // Create a point list with selected coordinates from database
                // 根据事件顺序将坐标依次装入到pathPointsArray中去
                // 但是如果在同一地点连续发生了多件事，不会出现自己找自己的情况
                if(json_arr[i]['xy_coordinates'] === null)
                    continue;
                if (json_arr[i]['xy_coordinates'] !== cur_xy_coordinates) {
                    pathPointsArray.push(json_arr[i]['xy_coordinates']);
                    cur_xy_coordinates = json_arr[i]['xy_coordinates'];
                }

                //两方面筛选
                // 如果这个事件选了、这个人物也选了
                let type_is_checked = true
                let event_has_checked_person = true
                if (type_is_checked && event_has_checked_person) {
                    // 读取基本信息
                    let place_name = json_arr[i]['certain_place_name'];
                    let place_id = json_arr[i]['certain_place_id'];
                    let place_location = json_arr[i]['xy_coordinates'];

                    // 检查字符串是否以某个前缀开头
                    if (place_id.startsWith('hvd')) {
                        place_location_dict[place_id] = [place_name, place_location];
                        // 关联地点和事件列表
                        // 最后的两个dict的形状是
                        // place_location_dict 索引是地点id，对应的是地点名称和地点xy坐标
                        // place_event_dict 索引时是地点id，对应的是一个数组，数组中包含着每一个在这个地点发生的事件数据
                        if (place_id in place_event_dict) {
                            let cur_len = place_event_dict[place_id].length;
                            place_event_dict[place_id][cur_len] = json_arr[i];
                        } else {
                            place_event_dict[place_id] = [];
                            place_event_dict[place_id][0] = json_arr[i];
                        }
                    }
                    //获得相关人物列表
                    // if(event_related_person){
                    //     related_person = related_person.concat(event_related_person.split('、'));
                    // }
                }
            }
            //console.log(place_location_dict)
            // 相关人物列表去重
            // 这里是为了显示相关人物
            // related_person = Array.from(new Set(related_person));

            //添加点和提示
            for (let place_id in place_location_dict) {
                //TODO 为什么在这里才判断地点是否被选中，为什么不在上方呢

                // 地点被选中
                // if(checked_place_set.has(place_id)){
                if (true) {
                    let place_location = place_location_dict[place_id][1];
                    let place_name = place_location_dict[place_id][0];
                    let lng_lat = place_location.substring(1, place_location.length - 2).split('E,');
                    //注意这里要转换数据类型
                    let lng = parseFloat(lng_lat[0]);
                    let lat = parseFloat(lng_lat[1]);
                    // 创建点
                    // 点的坐标
                    // 点的id
                    var greenIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    let marker = L.marker(L.latLng(lat, lng), {icon: greenIcon}, opacity = 0.5);
                    let name_disc = '<b>' + place_name + '</b>';
                    marker.id = place_id;
                    marker.setOpacity(0.5);
                    // 将maker与弹窗相绑定
                    // 添加提示信息，在这里仅仅提示了地点名称
                    // marker.bindPopup(place_name);
                    marker.bindPopup(name_disc);
                    // 添加点进点组
                    // map.addLayer(layer)、layer.addTo(map)
                    // 这本身是一种批处理maker的手段，就是利用LayerGroup，将所有的maker都放入到同一个group中去
                    event_marker_group.addLayer(marker);
                    // 添加点击事件监听（加载事件内容）,注意第二个参数要是一个函数！！
                    // https://stackoverflow.com/questions/37426809/creating-dynamic-links-with-leaflet-onclick-event
                    marker.on("click", load_event(place_id, lat, lng));
                }
            }
            if (true) {
                loadPath();
            }
        })
    })
}


// 在图层上增加路线图
function loadPath(){
    // 先清空以前所有的Layer（即路线）
    route_line_group.clearLayers();

    // Points list de-duplication
    // 去重
    // 形式：[[地点一坐标，地点二坐标]，[地点二坐标，地点三坐标]]
    var pointsConnectionArray = [];
    for (let i=0; i<pathPointsArray.length-1; i++){
        pointsConnectionArray.push([pathPointsArray[i],pathPointsArray[i+1]]);
    }
    console.log(pointsConnectionArray)
    // Making the array readable by API
    var pathArray = [];
    // Formatting data to (lat,lng)
    for (let i = 0; i < pointsConnectionArray.length; i++){
        // 第一个点的经纬度
        var lng_lat = pointsConnectionArray[i][0].substring(1,pointsConnectionArray[i][0].length-2).split('E,');
        // 第二个点的经纬度
        var lng_lat2 = pointsConnectionArray[i][1].substring(1,pointsConnectionArray[i][1].length-2).split('E,');
        var lng = parseFloat(lng_lat[0]);
        var lat = parseFloat(lng_lat[1]);
        var lng2 = parseFloat(lng_lat2[0]);
        var lat2 = parseFloat(lng_lat2[1]);
        // Here, We use two-dimensional Array to cater the format of swoopyArrow Library
        pathArray.push([[lat,lng],[lat2,lng2]]);
    }

    for (let i = 0; i < pathArray.length; i++){
        // Add Arrows to the marker group
        route_line_group.addLayer(new L.swoopyArrow(pathArray[i][0],pathArray[i][1], {
            color:'#ff0059',
            weight:2,
        }));
    }
}

// 在侧边显示图加载显示事件
function load_event(place_id, lat, lng){
    return function (ev){
        load_event_cards(place_id, lat, lng);
    }
}

// 加载右侧的事件列表
function load_event_cards(place_id, lat, lng){
    // 地点点击后进行定位和zoom
    mymap.setView([lat, lng], 7);

    //加载在该地点的全部事件
    var event_arr = place_event_dict[place_id];
    console.log(place_event_dict)
    var event_card_body = document.getElementById("event_card_body");
    event_card_body.innerHTML = "";

    var para = document.createElement("p");
    var txt = document.createTextNode("该时段内本地所发生的事件列表");
    para.appendChild(txt);

    event_card_body.appendChild(para);

    // 用于合并在同一天的事情
    var last_day = '';
    // 遍历每个事件
    for(var i=0; i<event_arr.length; i++){
        //生成年月标题（如果没有月则只生成年份）
        let cur_day=event_arr[i]['date'];
        if(cur_day !== last_day){
            last_day = cur_day;
            var b = document.createElement('b');
            var day_month_title = document.createElement("p");
            var day_month_title_text = document.createTextNode(cur_day);
            event_card_body.appendChild(b).appendChild(day_month_title).appendChild(day_month_title_text);
        }

        // 生成事件卡片
        // 首先是个div
        var card_div = document.createElement("div");
        // 设置类别为alert，方便能够用到bootstrap的alert的属性
        card_div.setAttribute("class", "alert alert-primary");

        var event_txt = document.createTextNode(event_arr[i]["weather"]);

        // 逐渐嵌套加入到元素中
        card_div.appendChild(event_txt);
        event_card_body.appendChild(card_div);

        // 这里是bootstrap的折叠元素
        var metadata_div = document.createElement("div");
        metadata_div.setAttribute("class", "collapse");

        //动态生成元数据内容
        var metadata_p = document.createElement("p");

        var key_arr = {
            'precise time':'具体时间',
            'certain_place_name':'具体地点',
            'weather':'天气',
        };

        for(var key in key_arr){
            if(event_arr[i][key]){
                // 查找到了相关人物
                //TODO 这里做了相关人物的跳转，倒也不必我觉得，可以删掉
                // if(key === "related_person"){
                //     let names = event_arr[i][key];
                //
                    //没有查找到相关人物，也就是其他元数据
                    var info_text = key_arr[key] + '：' + event_arr[i][key];
                    var metadata_txt = document.createTextNode(info_text);
                    metadata_p.appendChild(metadata_txt);
                //}
                var br = document.createElement('br');
                metadata_p.appendChild(br);
            }
        }

        // 添加padding=15px，见helper.css
        var p_div = document.createElement('div');
        // 这里是helper.css设置的
        p_div.setAttribute('class', 'p-15');

        event_card_body.appendChild(metadata_div).appendChild(p_div).appendChild(metadata_p);
    }

    // 上下伸缩，注意这种动态加载的元素事件不要用bootstrap控件，改用jquery的
    // 这里的alert类对应了事件卡片的类别
    $(".alert").click(function(){
        $(this).next("div").slideToggle();
    });
}
function change_view(lat, lng){
    return function (ev){
        mymap.setView([lat, lng], 12);
    }

}

function load_markers_with_landscape(name){
    $(document).ready(function(){
        $.getJSON("./my_data/landscope.json", function(data) {
            //清空原有数据
            landscope_location_dict = {};

            // 将data解析
            //var json_arr = JSON.parse(data);
            var json_arr = data['南京'];
            // 对于所有的地点
            for (var i = 0; i < json_arr.length; i++) {
                // 读取基本信息
                // 名字
                let place_name = json_arr[i]['certain_place_name'];
                // id
                let place_id = json_arr[i]['certain_place_id'];
                // 经纬度
                let place_location = json_arr[i]['xy_coordinates'];
                // 图片
                let place_img = json_arr[i]['img_url'];
                // 检查字符串是否以某个前缀开头
                if (place_id.startsWith('hvd')) {
                    landscope_location_dict[place_id] = [place_name, place_location,place_img];
                }
            }

            //添加点和提示
            for (let place_id in landscope_location_dict) {
                let place_location = landscope_location_dict[place_id][1];
                let place_name = landscope_location_dict[place_id][0];
                let place_img = landscope_location_dict[place_id][2];
                let lng_lat = place_location.substring(1, place_location.length - 2).split('E,');
                //注意这里要转换数据类型
                let lng = parseFloat(lng_lat[0]);
                let lat = parseFloat(lng_lat[1]);

                // 创建点
                // 点的坐标
                // 点的id
                var violetIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
                let marker = L.marker(L.latLng(lat, lng),{icon: violetIcon},opacity=0.5);
                let content = '<div class="maker_content" style="width: 200px; height: 150px;" id="marker' + place_id + '"></div>';
                let name_disc = '<b>'+place_name+'</b>';
                let img_disc = "<img src="+place_img+" width = 100% >";
                marker.id = place_id;
                marker.setOpacity(0.5);
                // 将maker与弹窗相绑定
                // 添加提示信息，在这里仅仅提示了地点名称
                // marker.bindPopup(place_name);
                marker.bindPopup(content,{});
                marker.on('popupopen', function(e) {
                    let mydiv = $('#marker' + marker.id);
                    mydiv.append(img_disc);
                    mydiv.append(name_disc);
                })
                marker.color = 'red';
                marker.id = place_id;
                marker.setOpacity(0.5);
                // 将maker与弹窗相绑定
                // 添加提示信息，在这里仅仅提示了地点名称

                // 添加点进点组
                // map.addLayer(layer)、layer.addTo(map)
                // 这本身是一种批处理maker的手段，就是利用LayerGroup，将所有的maker都放入到同一个group中去
                online_marker_group.addLayer(marker);

                // 添加点击事件监听（加载事件内容）,注意第二个参数要是一个函数！！
                // https://stackoverflow.com/questions/37426809/creating-dynamic-links-with-leaflet-onclick-event
                marker.on("click",change_view(lat, lng));
            }
        })
    })
}

//时间轴拖动的数据加载函数
function load_data(range_data) {
    //清除已有的点和提示，以及事件卡片
    var event_card_body = document.getElementById("event_card_body");
    event_card_body.innerHTML = "<p>该时段内本地所发生的事件列表</p>";
    event_marker_group.clearLayers();
    person_marker_group.clearLayers();
    route_line_group.clearLayers();

    from_year = range_data.from_value;
    to_year = range_data.to_value;
}


function get_time_rang(range_data){
    from_year = range_data.from_value;
    to_year = range_data.to_value;

    //console.log('get-from_year',from_year);
}

// 聚焦函数
function zoomin(lat, lng) {
    return function (ev) {
        mymap.setView([lat, lng], 7);
    }
}


//路线信息叠加点击事件
$("input[id='route']").on('click', function (){
    var is_checked = $(this).prop('checked');
    if(! is_checked){
        route_line_group.clearLayers();
    }
    else {
        loadPath();
    }
});

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // 按下的是回车键
            console.log("!!!!!!!!ok!")
            var searchString = searchInput.value; // 获取输入框中的值
            for(let a in nianhao_dict){
                if(a.includes(searchString)){
                    searchString = a;
                    break;
                }
            }
            if(searchString){
                clear_map();
                mymap.setView([40, 120], 6);
                console.log("11111",nianhao_dict[searchString])
                load_markers_with_events(from_year_bc=nianhao_dict[searchString], to_year_bc=nianhao_dict[searchString]+1)
            }

        }
    });




$('#search_btn').click(function(){
    clear_map();
    mymap.setView([40, 120], 6);
    load_markers_with_events(nianhao_dict[from_year],nianhao_dict[to_year]);
    //loadPath();
});

