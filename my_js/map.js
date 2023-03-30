//中华文明时空基础架构，永远的CORB错误，放弃了，这些注释是对浪费时间的纪念
// url = "http://gis.sinica.edu.tw/ccts/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ad1208&STYLE=_null&TILEMATRIXSET=GoogleMapsCompatible&FORMAT=image/png";
// var ign = new L.TileLayer.WMTS( url ,
//        {}
//       );
//
// mymap.addLayer(ign);


// 初始化地图
var mymap = L.map('map',{
    // 初始化坐标投影方式
   crs: L.CRS.EPSG4326
}).setView([30, 112], 4);

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

// 本质上加了一个图层叠加，在右上角可以选择
// 添加南宋疆域图 不同颜色显示不同国家
$.getJSON("my_data/1142_AD_Song-Jin-Xi_Xia-Dali.json", function(data){
    var geoJSONLayer = {
        // 显示地图标记
        '现代矢量地图注记': basemap_ano_from_tianditu().addTo(mymap),
        // 通过边界确定疆域
        '南宋疆域图': L.geoJSON(data.features, {
            // 点击疆域显示各国名字
            onEachFeature: onEachFeature,
            style: color_style
        }).addTo(mymap)
    };

    // Create layer control
    L.control.layers(basemaps, geoJSONLayer).addTo(mymap);
})

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
var from_year = '建炎四年';
var to_year = '庆元六年';
// 增加对应的图层
var event_marker_group = L.layerGroup().addTo(mymap);//事件点组图层
var person_marker_group = L.layerGroup().addTo(mymap); //人物点组图层
var route_line_group = L.layerGroup().addTo(mymap); //路线图层
// 路径途径点数组
var pathPointsArray = [];
var place_location_dict = {};
var place_event_dict = {};
// 相关人物
var related_person = [];
// 已勾选事件类型/人物类型/地点类型
var checked_type_set = new Set();
var checked_person_set = new Set();
var checked_place_set = new Set();

load_markers_with_events();

//年号映射字典
var nianhao_dict = {'建炎四年': 1130,
    '绍兴元年': 1131, '绍兴二年': 1132, '绍兴三年': 1133, '绍兴四年': 1134,
    '绍兴五年': 1135, '绍兴六年': 1136, '绍兴七年': 1137, '绍兴八年': 1138,
    '绍兴九年': 1139, '绍兴十年': 1140, '绍兴十一年': 1141, '绍兴十二年': 1142,
    '绍兴十三年': 1143, '绍兴十四年': 1144, '绍兴十五年': 1145, '绍兴十六年': 1146,
    '绍兴十七年': 1147, '绍兴十八年': 1148, '绍兴十九年': 1149, '绍兴二十年': 1150,
    '绍兴二十一年': 1151, '绍兴二十二年': 1152, '绍兴二十三年': 1153, '绍兴二十四年': 1154,
    '绍兴二十五年': 1155, '绍兴二十六年': 1156, '绍兴二十七年': 1157, '绍兴二十八年': 1158,
    '绍兴二十九年': 1159, '绍兴三十年': 1160, '绍兴三十一年': 1161, '绍兴三十二年': 1162,
    '隆兴元年': 1163, '隆兴二年': 1164,
    '乾道元年': 1165, '乾道二年': 1166, '乾道三年': 1167, '乾道四年': 1168,
    '乾道五年': 1169, '乾道六年': 1170, '乾道七年': 1171, '乾道八年': 1172,
    '乾道九年': 1173,
    '淳熙元年': 1174, '淳熙二年': 1175, '淳熙三年': 1176, '淳熙四年': 1177,
    '淳熙五年': 1178, '淳熙六年': 1179, '淳熙七年': 1180, '淳熙八年': 1181,
    '淳熙九年': 1182, '淳熙十年': 1183, '淳熙十一年': 1184, '淳熙十二年': 1185,
    '淳熙十三年': 1186, '淳熙十四年': 1187, '淳熙十五年': 1188, '淳熙十六年': 1189,
    '绍熙元年': 1190, '绍熙二年': 1191, '绍熙三年': 1192, '绍熙四年': 1193,
    '绍熙五年': 1194,
    '庆元元年': 1195, '庆元二年': 1196, '庆元三年': 1197, '庆元四年': 1198,
    '庆元五年': 1199, '庆元六年': 1200
};


// 清空图层函数
// 参数设置：无
// 效果：清空除底图外所有叠加图层，同时清空时间卡片栏
function clear_map(){
    var event_card_body = document.getElementById("event_card_body");
    event_card_body.innerHTML = "<p>该时段内本地所发生的事件列表</p>";
    event_marker_group.clearLayers();
    person_marker_group.clearLayers();
    route_line_group.clearLayers();
}

// 行程点绘制函数
// 参数设置 起始年份 终止年份
// 效果：根据传入的起止时间，读取数据并绘制形成点
function load_markers_with_events(from_year_bc=0, to_year_bc=2000){
    $.ajax({
        // 读取数据
        url:'https://api-nianpu.pkudh.org/event',
        type: 'get',
        data: {
            from_year:from_year_bc,
            to_year:to_year_bc
        },
        success:function (data){
            //清空原有数据
            place_location_dict = {};
            place_event_dict = {};
            pathPointsArray = [];

            // 获得当前选中的事件类别列表（注意其他类别的特殊class）
            // 这个id就对应了不同的事件类型
            // 例子 讲学是type12
            $("input[name='event_type_checkbox']:checked, input#type5:checked").each(
                function (){
                    checked_type_set.add(type_dict[$(this).attr('id')]);
                }
            );
            // 获得当前选中的人物列表
            // 这个id就对应了不同的人物
            // 例子 朱塾是3263
            $("input[name='person_checkbox']:checked").each(
                function (){
                    checked_person_set.add($(this).attr('id'));
                }
            );
            // 获得选中的地点列表
            // 这个id就对应了不同的地点
            // 例子 阳曲县是hvd_95638
            //TODO 这里为什么一定要是place_filter呢？
            $("#place_filter input:checked").each(
                function (){
                    let raw_id = $(this).attr('id');
                    let id = raw_id.substring(raw_id.indexOf('hvd'));
                    checked_place_set.add(id);
                }
            );

            // 将data解析
            var json_arr = JSON.parse(data);

            // 设置当前年份所在起始地点
            var cur_xy_coordinates = json_arr[0]['xy_coordinates'];
            pathPointsArray.push(cur_xy_coordinates);

            // 对于所有的事件
            for(var i=0; i<json_arr.length; i++){
                // 这是一个差错的可以不看
                if(json_arr[i]['event_id']===846){
                    //TODO 查看缺少的地点icon
                    console.log('松阳县');
                }

                // Create a point list with selected coordinates from database
                // 根据事件顺序将坐标依次装入到pathPointsArray中去
                // 但是如果在同一地点连续发生了多件事，不会出现自己找自己的情况
                if (json_arr[i]['xy_coordinates']!==cur_xy_coordinates){
                    pathPointsArray.push(json_arr[i]['xy_coordinates']);
                    cur_xy_coordinates = json_arr[i]['xy_coordinates'];
                }

                // 判断当前遍历到的事件对应的事件类型是否被选中
                var type_is_checked = false;
                var event_type = json_arr[i]['event_type'];
                if(! event_type){
                    console.log('此事件无分类'+json_arr[i]['description']);
                }

                //TODO 要用这么麻烦的判别标准么？可不可以在数组里直接判断含不含某个值
                for(let type of checked_type_set){
                    if(event_type.indexOf(type)>-1){
                        type_is_checked = true;
                        break;
                    }
                }

                //判断此事件是否包含选中人物，注意无人物事件的筛选
                var event_has_checked_person = false;
                var event_related_person = json_arr[i]['related_person'];
                if(event_related_person){
                    for(let person_id of checked_person_set){
                        let person_name = person_name_dict[person_id];
                        if(event_related_person.indexOf(person_name)>-1){
                            event_has_checked_person = true;
                            break;
                        }
                    }
                }
                else{
                    var no_rel_person_events_is_checked = $("#check_no_rel_peron_events").prop('checked');
                    if(no_rel_person_events_is_checked){
                        event_has_checked_person = true;
                    }
                }

                //两方面筛选
                // 如果这个事件选了、这个人物也选了
                if(type_is_checked && event_has_checked_person){
                    let place_name = json_arr[i]['certain_place_name'];
                    let place_id = json_arr[i]['certain_place_id'];
                    let place_location = json_arr[i]['xy_coordinates'];
                    // 无地名的暂时忽略了
                    // 检查字符串是否以某个前缀开头
                    if(place_id.startsWith('hvd')) {
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
                    if(event_related_person){
                        related_person = related_person.concat(event_related_person.split('、'));
                    }
                }
            }

            // 相关人物列表去重
            // 这里是为了显示相关人物
            related_person = Array.from(new Set(related_person));

            //添加点和提示
            for(let place_id in place_location_dict){
                //TODO 为什么在这里才判断地点是否被选中，为什么不在上方呢

                // 地点被选中
                if(checked_place_set.has(place_id)){
                    let place_location = place_location_dict[place_id][1];
                    let place_name = place_location_dict[place_id][0];
                    let lng_lat = place_location.substring(1,place_location.length-2).split('E,');
                    //注意这里要转换数据类型
                    let lng = parseFloat(lng_lat[0]);
                    let lat = parseFloat(lng_lat[1]);

                    // 创建点
                    // 点的坐标
                    // 点的id
                    let marker = L.marker(L.latLng(lat, lng),opacity=0.5);
                    marker.id = place_id;
                    marker.setOpacity(0.5);
                    // 将maker与弹窗相绑定
                    // 添加提示信息，在这里仅仅提示了地点名称
                    marker.bindPopup(place_name);

                    // 添加点进点组
                    // map.addLayer(layer)、layer.addTo(map)
                    // 这本身是一种批处理maker的手段，就是利用LayerGroup，将所有的maker都放入到同一个group中去
                    event_marker_group.addLayer(marker);

                    // 添加点击事件监听（加载事件内容）,注意第二个参数要是一个函数！！
                    // https://stackoverflow.com/questions/37426809/creating-dynamic-links-with-leaflet-onclick-event
                    marker.on("click",load_event(place_id, lat, lng));
                }
            }


            // 添加相关人物籍贯点
            var is_person_checked = $('input[id="person"]').prop('checked');
            // 这里是显示图层是否选择了相关人物
            if(is_person_checked){
                load_related_person(from_year_bc, to_year_bc);
            }

            // 添加行迹路线
            var is_route_checked = $('input[id="route"]').prop('checked');
            // 这里是显示图层是否选择了路线
            if(is_route_checked){
                loadPath();
            }
        }
    });
}
function load_markers_with_events(from_year_bc=0, to_year_bc=2000){
    $.ajax({
        url:'https://api-nianpu.pkudh.org/event',
        type: 'get',
        data: {
            from_year:from_year_bc,
            to_year:to_year_bc
        },
        success:function (data){
            //清空原有数据
            place_location_dict = {};
            place_event_dict = {};
            related_person = [];
            pathPointsArray = [];
            checked_type_set = new Set();
            checked_place_set = new Set();
            checked_person_set = new Set();

            // 获得当前选中的事件类别列表（注意其他类别的特殊class）
            // 这个id就对应了不同的事件类型
            // 例子 讲学是type12
            $("input[name='event_type_checkbox']:checked, input#type5:checked").each(
                function (){
                    checked_type_set.add(type_dict[$(this).attr('id')]);
                }
            );
            // 获得当前选中的人物列表
            // 这个id就对应了不同的人物
            // 例子 朱塾是3263
            $("input[name='person_checkbox']:checked").each(
                function (){
                    checked_person_set.add($(this).attr('id'));
                }
            );
            // 获得选中的地点列表
            // 这个id就对应了不同的地点
            // 例子 阳曲县是hvd_95638
            //TODO 这里为什么一定要是place_filter呢？
            $("#place_filter input:checked").each(
                function (){
                    let raw_id = $(this).attr('id');
                    let id = raw_id.substring(raw_id.indexOf('hvd'));
                    checked_place_set.add(id);
                }
            );

            // 将data解析
            var json_arr = JSON.parse(data);

            // 设置当前年份所在起始地点
            var cur_xy_coordinates = json_arr[0]['xy_coordinates'];
            pathPointsArray.push(cur_xy_coordinates);

            // 对于所有的事件
            for(var i=0; i<json_arr.length; i++){
                // 这是一个差错的可以不看
                if(json_arr[i]['event_id']===846){
                    //TODO 查看缺少的地点icon
                    console.log('松阳县');
                }

                // Create a point list with selected coordinates from database
                // 根据事件顺序将坐标依次装入到pathPointsArray中去
                // 但是如果在同一地点连续发生了多件事，不会出现自己找自己的情况
                if (json_arr[i]['xy_coordinates']!==cur_xy_coordinates){
                    pathPointsArray.push(json_arr[i]['xy_coordinates']);
                    cur_xy_coordinates = json_arr[i]['xy_coordinates'];
                }

                // 判断当前遍历到的事件对应的事件类型是否被选中
                var type_is_checked = false;
                var event_type = json_arr[i]['event_type'];
                if(! event_type){
                    console.log('此事件无分类'+json_arr[i]['description']);
                }

                //TODO 要用这么麻烦的判别标准么？可不可以在数组里直接判断含不含某个值
                for(let type of checked_type_set){
                    if(event_type.indexOf(type)>-1){
                        type_is_checked = true;
                        break;
                    }
                }

                //判断此事件是否包含选中人物，注意无人物事件的筛选
                var event_has_checked_person = false;
                var event_related_person = json_arr[i]['related_person'];
                if(event_related_person){
                    for(let person_id of checked_person_set){
                        let person_name = person_name_dict[person_id];
                        if(event_related_person.indexOf(person_name)>-1){
                            event_has_checked_person = true;
                            break;
                        }
                    }
                }
                else{
                    var no_rel_person_events_is_checked = $("#check_no_rel_peron_events").prop('checked');
                    if(no_rel_person_events_is_checked){
                        event_has_checked_person = true;
                    }
                }

                //两方面筛选
                // 如果这个事件选了、这个人物也选了
                if(type_is_checked && event_has_checked_person){
                    let place_name = json_arr[i]['certain_place_name'];
                    let place_id = json_arr[i]['certain_place_id'];
                    let place_location = json_arr[i]['xy_coordinates'];
                    // 无地名的暂时忽略了
                    // 检查字符串是否以某个前缀开头
                    if(place_id.startsWith('hvd')) {
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
                    if(event_related_person){
                        related_person = related_person.concat(event_related_person.split('、'));
                    }
                }
            }

            // 相关人物列表去重
            // 这里是为了显示相关人物
            related_person = Array.from(new Set(related_person));

            //添加点和提示
            for(let place_id in place_location_dict){
                //TODO 为什么在这里才判断地点是否被选中，为什么不在上方呢

                // 地点被选中
                if(checked_place_set.has(place_id)){
                    let place_location = place_location_dict[place_id][1];
                    let place_name = place_location_dict[place_id][0];
                    let lng_lat = place_location.substring(1,place_location.length-2).split('E,');
                    //注意这里要转换数据类型
                    let lng = parseFloat(lng_lat[0]);
                    let lat = parseFloat(lng_lat[1]);

                    // 创建点
                    // 点的坐标
                    // 点的id
                    let marker = L.marker(L.latLng(lat, lng),opacity=0.5);
                    marker.id = place_id;
                    marker.setOpacity(0.5);
                    // 将maker与弹窗相绑定
                    // 添加提示信息，在这里仅仅提示了地点名称
                    marker.bindPopup(place_name);

                    // 添加点进点组
                    // map.addLayer(layer)、layer.addTo(map)
                    // 这本身是一种批处理maker的手段，就是利用LayerGroup，将所有的maker都放入到同一个group中去
                    event_marker_group.addLayer(marker);

                    // 添加点击事件监听（加载事件内容）,注意第二个参数要是一个函数！！
                    // https://stackoverflow.com/questions/37426809/creating-dynamic-links-with-leaflet-onclick-event
                    marker.on("click",load_event(place_id, lat, lng));
                }
            }


            // 添加相关人物籍贯点
            var is_person_checked = $('input[id="person"]').prop('checked');
            // 这里是显示图层是否选择了相关人物
            if(is_person_checked){
                load_related_person(from_year_bc, to_year_bc);
            }

            // 添加行迹路线
            var is_route_checked = $('input[id="route"]').prop('checked');
            // 这里是显示图层是否选择了路线
            if(is_route_checked){
                loadPath();
            }
        }
    });
}

// 在图层上增加路线图
function loadPath(){
    // 先清空以前所有的Layer（即路线）
    route_line_group.clearLayers();

    // Points list de-duplication
    // 去重
    // 形式：[[地点一坐标，地点二坐标]，[地点二坐标，地点三坐标]]
    var pointsConnectionArray = [];
    for (var i=0; i<pathPointsArray.length-1; i++){
        pointsConnectionArray.push([pathPointsArray[i],pathPointsArray[i+1]]);
    }

    // Making the array readable by API
    var pathArray = [];
    // Formatting data to (lat,lng)
    for (var i = 0; i < pointsConnectionArray.length; i++){
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

    for (var i = 0; i < pathArray.length; i++){
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

    //加载事件卡片
    var event_arr = place_event_dict[place_id];

    var event_card_body = document.getElementById("event_card_body");
    event_card_body.innerHTML = "";

    var para = document.createElement("p");
    var txt = document.createTextNode("该时段内本地所发生的事件列表");
    para.appendChild(txt);

    event_card_body.appendChild(para);

    var last_year_month = '';
    // 遍历每个事件
    for(var i=0; i<event_arr.length; i++){
        //生成年月标题（如果没有月则只生成年份）
        let cur_year_month;
        if(event_arr[i]['date'].indexOf('月')>-1){
            cur_year_month= event_arr[i]['date'].substring(0, event_arr[i]['date'].indexOf('月')+1);
        }
        else{
            cur_year_month= event_arr[i]['date'].substring(0, event_arr[i]['date'].indexOf('年')+1);
        }
        if(cur_year_month !== last_year_month){
            last_year_month = cur_year_month;
            var b = document.createElement('b');
            var year_month_title = document.createElement("p");
            var year_month_title_text = document.createTextNode(cur_year_month);
            event_card_body.appendChild(b).appendChild(year_month_title).appendChild(year_month_title_text);
        }

        // 生成事件卡片
        // 首先是个div
        var card_div = document.createElement("div");
        // 设置类别为alert，方便能够用到bootstrap的alert的属性
        card_div.setAttribute("class", "alert alert-primary");

        var event_txt = document.createTextNode(event_arr[i]["description"]);

        // 逐渐嵌套加入到元素中
        card_div.appendChild(event_txt);
        event_card_body.appendChild(card_div);

        // 这里是bootstrap的折叠元素
        var metadata_div = document.createElement("div");
        metadata_div.setAttribute("class", "collapse");

        //动态生成元数据内容
        var metadata_p = document.createElement("p");

        var key_arr = {'event_id':'事件id', 'page':'页码',
            'year_bc':'公元年', 'date':'发生时间', 'certain_place_name':'发生地点',
            'related_person':'相关人物', 'reference':'出处', 'event_type':'事件类型',
            'event_collection':'从属的事件集合', 'big_event_collection':'从属的大事件集合',
            'relevant_book':'相关学术书籍', 'study_topics':'相关学术主题',
            'work_name':'著作名', 'work_object':'诗文对象名',
            'official_position':'官职名',
            'communication_object': '通信对象名', "meeting_object":'会面对象名',
            'places_in_the_road':'途经地', 'place_making_home':'寓居地',
            'politics_topic':'议政主题'};

        for(var key in key_arr){
            if(event_arr[i][key]){
                // 查找到了相关人物
                //TODO 这里做了相关人物的跳转，倒也不必我觉得，可以删掉
                if(key === "related_person"){
                    let names = event_arr[i][key];

                    let info_text = '相关人物：';
                    let metadata_txt = document.createTextNode(info_text);
                    metadata_p.appendChild(metadata_txt);

                    //多相关人物
                    if (names.indexOf("、") !== -1) {
                        var nameList = [];
                        nameList = names.split("、");

                        for (let personName of nameList) {
                            let person_id = getKeyByValue(person_name_dict, personName);

                            //为每个人物超链接添加人物id
                            //Add person id for each HTML anchor tag
                            let name = document.createTextNode(personName + " ");
                            if(person_id && ! person_id.startsWith('pid')){
                                let createLink = document.createElement('a');
                                createLink.title = personName;
                                createLink.id = person_id;
                                createLink.href = "#";

                                //为超链接创建函数，功能：调取人物id并且对焦人物显示在地图上
                                // Create function to centralise selected person based on person id
                                createLink.onclick = function (){
                                    let person_id = this.id;
                                    person_marker_group.eachLayer(function (layer) {
                                        if (layer.id === person_id){
                                            layer.fire('click');
                                        }
                                    });
                                };
                                createLink.appendChild(name);
                                metadata_p.appendChild(createLink);
                            }
                            else{
                                metadata_p.appendChild(name);
                            }
                        }
                    }
                    //单相关人物
                    else{
                        let person_id = getKeyByValue(person_name_dict, names);
                        let name = document.createTextNode(names + " ");
                        if(person_id && ! person_id.startsWith('pid')) {
                            let createLink = document.createElement('a');
                            //为每个人物超链接添加人物id
                            createLink.title = names;
                            createLink.id = person_id;
                            createLink.href = "#";
                            //为超链接创建函数，功能：调取人物id并且对焦人物显示在地图上
                            createLink.onclick = function () {
                                let person_id = this.id;
                                person_marker_group.eachLayer(function (layer) {
                                    if (layer.id === person_id) {
                                        layer.fire('click');
                                    }
                                });
                            };
                            createLink.appendChild(name);
                            metadata_p.appendChild(createLink);
                        }
                        else{
                            metadata_p.appendChild(name);
                        }
                    }
                }
                else{
                    //没有查找到相关人物，也就是其他元数据
                    var info_text = key_arr[key] + '：' + event_arr[i][key];
                    var metadata_txt = document.createTextNode(info_text);
                    metadata_p.appendChild(metadata_txt);
                }
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

    // load_markers_with_events(nianhao_dict[from_year],nianhao_dict[to_year]);
}


function get_time_rang(range_data){
    from_year = range_data.from_value;
    to_year = range_data.to_value;

    console.log('get-from_year',from_year);
}


// 不是很重要
function load_related_person(from_year_bc=0, to_year_bc=2000){
    $.ajax({
        url: 'https://api-nianpu.pkudh.org/person',
        type: 'get',
        data: {
            from_year: from_year_bc,
            to_year: to_year_bc
        },
        success: function (person_data) {
            //清空原有数据
            person_marker_group.clearLayers();
            checked_person_set = new Set();

            //获得当前选中的人物列表
            $("input[name='person_checkbox']:checked").each(
                function (){
                    checked_person_set.add($(this).attr('id'));
                }
            );

            var person_arr = JSON.parse(person_data);
            for(var i=0; i<person_arr.length; i++){
                var person_name = person_arr[i]['person_name'];
                var person_id = person_arr[i]['person_id'];

                var home_location_log_lat = person_arr[i]['xy_coordinates'];

                //人物相关且被选中
                if($.inArray(person_name, related_person)>-1 && checked_person_set.has(person_id)){
                    //没有籍贯的暂时不管
                    if(home_location_log_lat){
                        var lng_lat = home_location_log_lat.substring(1,home_location_log_lat.length-2).split('E,');
                        //注意这里要转换数据类型
                        var lng = parseFloat(lng_lat[0]);
                        var lat = parseFloat(lng_lat[1]);
                        //创建点
                        var myIcon = L.icon({
                            iconUrl: 'my_data/person.png',
                            iconSize: [50, 50]
                        });
                        var marker = L.marker(L.latLng(lat, lng), {icon: myIcon});
                        marker.id = person_id;

                        //添加提示和二次筛选按钮
                        //https://jingyan.baidu.com/article/d5c4b52ba281bdda560dc587.html
                        var person_key_arr = {
                            'person_id':'CBDB人物id',
                            'person_altname_from_nianpu':'字号（来自年谱）',
                            'person_home_place': '籍贯',
                            'person_altname_from_CBDB': '别名（来自CBDB）',
                            'person_birth_death_year': '生卒年',
                            'note':'备注'
                        };
                        var info_text = '<h5 style="display:inline">'+ person_name + '</h5>'+
                            '<button id="perBtn"'
                            + ' data-id="' + person_id + '"'
                            + ' class="btn btn-primary" style="float: right;">筛选</button>'
                            + '</br></br></br>';
                        for(var key in person_key_arr){
                            if(person_arr[i][key]){
                                info_text += '<b>'+ person_key_arr[key] + '</b>'+ '：' + person_arr[i][key] + '</br>';
                            }
                        }
                        marker.bindPopup(info_text);
                        //二次筛选功能实现
                        //TODO 发现问题：如果前一个popup没有关闭，按钮就不响应点击
                        mymap.on("popupopen", function () {
                            //如果点开的是人物popup
                            if($("button#perBtn").length>0) {
                                document.getElementById("perBtn").onclick = function () {
                                    let clicked_person_id = this.dataset.id;
                                    $("#person_filter").find("input").prop({'checked': false});
                                    $("input[name='person_checkbox']#" + clicked_person_id).click();
                                    // load_data(
                                    //     {
                                    //         from_value: nianhao_dict[from_year],
                                    //         to_value: nianhao_dict[to_year]
                                    //     }
                                    // );

                                    clear_map()
                                    load_markers_with_events(nianhao_dict[from_year],nianhao_dict[to_year]);
                                };
                            }
                        });

                        //人物点击事件
                        marker.on('click', zoomin(lat, lng));

                        //添加点进点组
                        person_marker_group.addLayer(marker);

                        //添加点击事件监听（加载事件内容）,注意第二个参数要是一个函数！！
                        // https://stackoverflow.com/questions/37426809/creating-dynamic-links-with-leaflet-onclick-event
                        // marker.on("click",load_event(place));
                    }
                }
            }
        }
    });
}

// 聚焦函数
function zoomin(lat, lng) {
    return function (ev) {
        mymap.setView([lat, lng], 7);
    }
}

// 设置一些元素的点击函数

//人际交往信息叠加点击事件
$("input[id='person']").on('click', function (){
    var is_checked = $(this).prop('checked');
    if(! is_checked){
        person_marker_group.clearLayers();
    }
    else {
        load_related_person(nianhao_dict[from_year], nianhao_dict[to_year]);
    }
});

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


$('#search_btn').click(function(){
    clear_map();
    load_markers_with_events(nianhao_dict[from_year],nianhao_dict[to_year]);
 });