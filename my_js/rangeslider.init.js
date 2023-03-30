// 设置时间轴的各项参数

$(function () {
    "use strict";
    var NianHao = Object.keys(nianhao_dict)
    var my_from = NianHao.indexOf("六月二十四日辛末");
    var my_to = NianHao.indexOf("八月初九乙卯");

//Or hide any part you wish
    $("#time_axis").ionRangeSlider({
        type: "double",
        from: my_from,
        to: my_to,

        values: NianHao,

        grid: true,
        grid_num: 8,
        grid_snap: false,

        // drag_interval:true,

        hide_min_max: false,
        hide_from_to: false,
        force_edges: true,

        // onChange: load_data
        onChange: get_time_rang
    });
});

//load_data数据加载函数在map.js中定义，因为在其中要用，而map.js先于时间轴加载