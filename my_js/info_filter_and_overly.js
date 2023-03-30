//统一本文件和map.js中所用人物ID（CBDB中没有的，在此处赋值一个ID）
var person_name_dict = {};
$.ajaxSetup({async:false});
$.ajax({
    url: 'https://api-nianpu.pkudh.org/person',
    type: 'get',
    data: {
        from_year: 0,
        to_year: 2000
    },
    success: function (person_data) {
        let json_person_data = JSON.parse(person_data);
        for(var i=0; i<json_person_data.length; i++){
            let person_id = json_person_data[i]['person_id'];
            let person_name = json_person_data[i]['person_name'];
            if(person_id){
                person_name_dict[person_id] = person_name;
            }
            else{
                //为CBDB中没有的人物编造一个ID
                person_name_dict['pid'+i] = person_name;
            }
        }
    }
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

//默认人际交往信息叠加是选中的
$("input[id='person']").prop({'checked': true});
$("input[id='official_position']").prop({'checked': true});
$("input[id='route']").prop({'checked': false});



//人物、路线信息叠加按钮点击事件在map.js中load_markers_with_events实现（因为相关信息加载函数在其中实现）
//官职信息叠加按钮点击事件如下
$("input[id='official_position']").on('click', function (){
    let is_checked = $(this).prop('checked');
    let official_position_status_div = $('#official_position_status').parent().parent();
    let event_cards_div = $('#event_card_body');
    if(! is_checked){
        official_position_status_div.attr('hidden','hidden');
        event_cards_div.attr('style',"height:620px;overflow:auto");
    }
    else {
        official_position_status_div.removeAttr('hidden');
        event_cards_div.attr('style',"height:265px;overflow:auto");
    }
});



//地点筛选复选框预加载，筛选功能在map.js中load_markers_with_events实现
$.ajax({
    url: 'https://api-nianpu.pkudh.org/place',
    type: 'get',
    success: function (place_data){
        var place_arr = JSON.parse(place_data);

        var place_filter = document.getElementById("place_filter");

        var belong_place_name2 = '';
        for(var i = 0; i< place_arr.length; i++) {
            if (place_arr[i]['belong_place_name2'] && place_arr[i]['belong_place_name2'] != belong_place_name2) {
                belong_place_name2 = place_arr[i]['belong_place_name2'];
                var belong_place_id2 = place_arr[i]['belong_place_id2'];

                //整个路级div
                var lu_div = document.createElement("div");
                lu_div.setAttribute("name", "lu_div");
                load_lu_place(i, lu_div, place_arr);

                //添加路级复选框
                var div_checkbox, input, label, b, p_name;

                div_checkbox = document.createElement("div");
                div_checkbox.setAttribute("class", "col-lg-12");

                input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", "lu_checkbox");
                input.setAttribute("id", 'pp' + belong_place_id2);
                input.setAttribute("checked", true);

                label = document.createElement("label");
                label.setAttribute("htmlFor", 'pp' + belong_place_id2);
                b = document.createElement("b");
                p_name = document.createTextNode(belong_place_name2);

                div_checkbox.appendChild(input);
                div_checkbox.appendChild(label).appendChild(b).appendChild(p_name);

                place_filter.appendChild(div_checkbox);
                place_filter.appendChild(lu_div);
            }
        }
    }
})

function load_lu_place(i, lu_div, place_arr){
    var belong_place_name2 = place_arr[i]['belong_place_name2'];
    var belong_place_name = '';

    for(var j=i; j< place_arr.length; j++){
        if(place_arr[j]['belong_place_name2'] != belong_place_name2)break;
        if(place_arr[j]['belong_place_name'] != belong_place_name){
            belong_place_name = place_arr[j]['belong_place_name'];
            var belong_place_id = place_arr[j]['belong_place_id'];

            //整个府/军/州地点div
            var fujunzhou_div = document.createElement("div");
            fujunzhou_div.setAttribute("name", "fujunzhou_div");

            load_fujunzhou_place(j, fujunzhou_div, place_arr);

            //添加府/军/州地点复选框
            var div_checkbox, input, label, b, p_name;

            div_checkbox = document.createElement("div");
            div_checkbox.setAttribute("class", "col-lg-12");

            input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", "fujunzhou_checkbox");
            input.setAttribute("id", 'p'+belong_place_id);
            input.setAttribute("checked", true);

            label = document.createElement("label");
            label.setAttribute("htmlFor", 'p'+belong_place_id);
            b = document.createElement("b");
            p_name = document.createTextNode(belong_place_name);

            div_checkbox.appendChild(input);
            div_checkbox.appendChild(label).appendChild(b).appendChild(p_name);

            lu_div.appendChild(div_checkbox);
            lu_div.appendChild(fujunzhou_div);
        }
    }
}

function load_fujunzhou_place(j, fujunzhou_div, place_arr){
    var belong_place_name = place_arr[j]['belong_place_name'];

    var certain_fujunzhou_place_arr = {};
    for(var k = j; k< place_arr.length; k++){
        if(place_arr[k]['belong_place_name'] != belong_place_name)break;
        let place_name = place_arr[k]['place_name'];
        let place_id = place_arr[k]['place_id'];
        certain_fujunzhou_place_arr[place_id] = place_name;
    }

    var i = 0;

    for (let place_id in certain_fujunzhou_place_arr) {
        let place_name = certain_fujunzhou_place_arr[place_id];
        var row_div, div_person, div_checkbox, input, label, p_name;

        if (i % 2 == 0) {
            row_div = document.createElement("div");
            row_div.setAttribute("class", "row");
        }

        div_person = document.createElement("div");
        div_person.setAttribute("class", "col-lg-6");

        div_checkbox = document.createElement("div");
        // div_checkbox.setAttribute("class", "custom-control custom-checkbox");

        input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", "place_checkbox");
        // input.setAttribute("class", "custom-control-input");
        input.setAttribute("id", place_id);
        input.setAttribute("checked", true);

        label = document.createElement("label");
        // label.setAttribute("class", "custom-control-label");
        label.setAttribute("htmlFor", place_id);
        p_name = document.createTextNode(place_name);

        row_div.appendChild(div_person).appendChild(div_checkbox);
        div_checkbox.appendChild(input);
        div_checkbox.appendChild(label).appendChild(p_name);

        //达到一排或者达到数组尾部，添加进div
        if (i % 2 != 0 || i+1 ==Object.keys(certain_fujunzhou_place_arr).length) {
            fujunzhou_div.appendChild(row_div);
        }
        i = i+1;
    }
}

//地点部分全选功能实现（父级input标签ID是pp+父级id,子级input标签ID是p+子级id）
//路复选框点击事件
$("#place_filter").on('click', "input[id^='pp']", function (){
    var parent_type_is_checked = $(this).prop('checked');
    var all_sub_input = $(this).parent().next().find('input');
    all_sub_input.prop({'checked':parent_type_is_checked});
});
//府军州复选框点击事件
$("#place_filter").on('click', "input[id^='phvd']", function (){
    //所有人物：有则全有，无则全无
    var type_is_checked = $(this).prop('checked');
    $(this).parent().next().find('input').prop({'checked': type_is_checked});

    //父级类别变化
    var type_input_list = $(this).parent().parent().find("input[name='fujunzhou_checkbox']");
    var flag_no_children = 1;
    var flag_all_children = 1;
    for(var i = 0; i<type_input_list.length; i++){
        if(type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var parent_type_input = $(this).parent().parent().prev().children('input');
    if(flag_all_children){
        parent_type_input.prop({'checked': true});
    }
    if(flag_no_children){
        parent_type_input.prop({'checked': false});
    }
});
//地点复选框点击事件
$("#place_filter").on('click', "input[name='place_checkbox']", function (){
    //类别复选框：全无则无，全有则有
    var person_input_list = $(this).parent().parent().parent().parent().find('input');
    var flag_no_children = 1;
    var flag_all_children = 1;
    for(var i = 0; i<person_input_list.length; i++){
        if(person_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var type_input = $(this).parent().parent().parent().parent().prev().children('input');
    if(flag_all_children){
        type_input.prop({'checked': true});
    }
    if(flag_no_children){
        type_input.prop({'checked': false});
    }

    //母级类别复选框检查：全无则无，全有则有
    var type_input_list = $(this).parent().parent().parent().parent().parent().find("input[name='fujunzhou_checkbox']");
    flag_no_children = 1;
    flag_all_children = 1;
    for(var i = 0; i<type_input_list.length; i++){
        if(type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var parent_type_input = type_input.parent().parent().prev().children('input');
    if(flag_all_children){
        parent_type_input.prop({'checked': true});
    }
    if(flag_no_children){
        parent_type_input.prop({'checked': false});
    }
});



//人物筛选复选框预加载，筛选功能在map.js中load_related_person实现
$.ajax({
    url: 'https://api-nianpu.pkudh.org/person',
    type: 'get',
    data: {
        from_year: 0,
        to_year: 2000
    },
    success: function (person_data) {
        $.ajax({
            url: 'https://api-nianpu.pkudh.org/person_rel',
            type: 'get',
            data: {
                zhuanzhu_id: '3257'
            },
            success: function (person_rel_data) {
                var person_arr = JSON.parse(person_data);
                var person_rel_arr = JSON.parse(person_rel_data);
                var rel_stucture = [];

                //填充关系列表中的关系人姓名，删掉没有匹配的关系，便于后面函数使用
                for(var i = 0; i<person_rel_arr.length; i++){
                    var flag = 0;
                    for(var j = 0; j<person_arr.length && flag<1; j++){
                        if(person_rel_arr[i]['c_assoc_id']==person_arr[j]['person_id']){
                            person_rel_arr[i]['c_assoc_name'] = person_arr[j]['person_name'];
                            flag = 1;
                            break;
                        }
                    }
                    if(flag == 0){
                        person_rel_arr[i]['c_assoc_name'] = '';
                    }
                }

                //找到没有关系匹配的人物
                for(var j = 0; j<person_arr.length; j++){
                    var flag_has_rel = 0;
                    for(var i = 0; i<person_rel_arr.length && flag_has_rel<1; i++){
                        if(person_rel_arr[i]['c_assoc_id']==person_arr[j]['person_id']){
                            person_arr[j]['flag_has_rel'] = 1;
                            flag_has_rel = 1;
                            break;
                        }
                    }
                    if(flag_has_rel == 0){
                        person_arr[j]['flag_has_rel'] = 0;
                    }
                }

                //删去没有匹配到人物的关系
                var filtered_person_rel_arr = []
                for(var i = 0; i<person_rel_arr.length; i++){
                    if(person_rel_arr[i]['c_assoc_name']){
                        filtered_person_rel_arr.push(person_rel_arr[i]);
                    }
                }

                //找到未收录或关系不明的人物
                var no_rel_person_arr = [];
                var not_included_person_arr = [];
                for(var i = 0; i<person_arr.length; i++){
                    if(! person_arr[i]['person_id']) {
                        not_included_person_arr.push(person_arr[i]);
                    }
                    else if(! person_arr[i]['flag_has_rel']) {
                        no_rel_person_arr.push(person_arr[i]);
                    }
                }

                //JQuery的ajax默认异步执行，此处关闭
                $.ajaxSetup({async:false});

                //获取关系结构数据
                $.getJSON("../my_data/assoc_structure.json", function (assoc_structure_data) {
                    // console.log(assoc_structure_data);
                    rel_stucture = assoc_structure_data['assoc'];
                });

                var person_filter = document.getElementById("person_filter");

                var c_parent_assoc_type_desc_chn = '';
                for(var i = 0; i< rel_stucture.length; i++){
                    if(rel_stucture[i]['c_parent_assoc_type_desc_chn'] != c_parent_assoc_type_desc_chn){
                        c_parent_assoc_type_desc_chn = rel_stucture[i]['c_parent_assoc_type_desc_chn'];
                        var c_assoc_type_parent_id = rel_stucture[i]['c_assoc_type_parent_id'];

                        //整个父级关系div
                        var relation_parent_type_div = document.createElement("div");
                        relation_parent_type_div.setAttribute("name", "relation_parent_type_div");
                        var flag_parent_has_person = load_certain_assoc_parent_type_person(i, relation_parent_type_div, rel_stucture, filtered_person_rel_arr);

                        if(flag_parent_has_person){
                            //添加父级关系复选框
                            var div_checkbox, input, label, b, p_name;

                            div_checkbox = document.createElement("div");
                            div_checkbox.setAttribute("class", "col-lg-12");

                            input = document.createElement("input");
                            input.setAttribute("type", "checkbox");
                            input.setAttribute("name", "assoc_parent_type_checkbox");
                            input.setAttribute("id", 'apt'+c_assoc_type_parent_id);
                            input.setAttribute("checked", true);

                            label = document.createElement("label");
                            label.setAttribute("htmlFor", 'apt'+c_assoc_type_parent_id);
                            b = document.createElement("b");
                            p_name = document.createTextNode(c_parent_assoc_type_desc_chn);

                            div_checkbox.appendChild(input);
                            div_checkbox.appendChild(label).appendChild(b).appendChild(p_name);

                            person_filter.appendChild(div_checkbox);
                            person_filter.appendChild(relation_parent_type_div);
                        }
                    }
                }


                //创建其他人物复选框：关系不明/CBDB未收录
                var relation_parent_type_div = document.createElement("div");
                relation_parent_type_div.setAttribute("name", "relation_parent_type_div");

                var other_div_checkbox = document.createElement("div");
                other_div_checkbox.setAttribute("class", "col-lg-12");

                var other_input = document.createElement("input");
                other_input.setAttribute("type", "checkbox");
                other_input.setAttribute("name", "assoc_parent_type_checkbox");
                other_input.setAttribute("id", 'apt');
                other_input.setAttribute("checked", true);

                var other_label = document.createElement("label");
                other_label.setAttribute("htmlFor", 'apt');
                var other_b = document.createElement("b");
                var other_p_name = document.createTextNode('其他');

                other_div_checkbox.appendChild(other_input);
                other_div_checkbox.appendChild(other_label).appendChild(other_b).appendChild(other_p_name);

                person_filter.appendChild(other_div_checkbox);
                person_filter.appendChild(relation_parent_type_div);

                var other_dict = {
                    '未收录':not_included_person_arr,
                    '关系不明':no_rel_person_arr
                };
                for(var assoc_type in other_dict){
                    let id = 98;

                    var relation_type_div = document.createElement("div");
                    relation_type_div.setAttribute("name", "relation_type_div");

                    //添加子级关系复选框
                    var other_ch_div_checkbox = document.createElement("div");
                    other_ch_div_checkbox.setAttribute("class", "col-lg-12");

                    var other_ch_input = document.createElement("input");
                    other_ch_input.setAttribute("type", "checkbox");
                    other_ch_input.setAttribute("name", "assoc_type_checkbox");
                    other_ch_input.setAttribute("id", 'at'+ id);
                    other_ch_input.setAttribute("checked", true);

                    id+=1;

                    var other_ch_label = document.createElement("label");
                    other_ch_label.setAttribute("htmlFor", 'at'+ id);
                    var other_ch_b = document.createElement("b");
                    var other_ch_p_name = document.createTextNode(assoc_type);

                    other_ch_div_checkbox.appendChild(other_ch_input);
                    other_ch_div_checkbox.appendChild(other_ch_label).appendChild(other_ch_b).appendChild(other_ch_p_name);

                    relation_parent_type_div.appendChild(other_ch_div_checkbox);
                    relation_parent_type_div.appendChild(relation_type_div);

                    var other_person_arr = other_dict[assoc_type];
                    for(var i = 0; i< other_person_arr.length; i++){
                        let person_id = other_person_arr[i]['person_id'];
                        let person_name = other_person_arr[i]['person_name'];
                        if(! person_id){
                            person_id = getKeyByValue(person_name_dict, person_name);
                        }

                        var row_div, div_person, div_checkbox, input, label, p_name;

                        if (i % 2 === 0) {
                            row_div = document.createElement("div");
                            row_div.setAttribute("class", "row");
                        }

                        div_person = document.createElement("div");
                        div_person.setAttribute("class", "col-lg-6");

                        div_checkbox = document.createElement("div");

                        input = document.createElement("input");
                        input.setAttribute("type", "checkbox");
                        input.setAttribute("name", "person_checkbox");
                        input.setAttribute("id", person_id);
                        input.setAttribute("checked", true);

                        label = document.createElement("label");
                        label.setAttribute("htmlFor", person_id);
                        label.setAttribute('name', 'person_label');
                        p_name = document.createTextNode(person_name);

                        row_div.appendChild(div_person).appendChild(div_checkbox);
                        div_checkbox.appendChild(input);
                        div_checkbox.appendChild(label).appendChild(p_name);

                        //达到一排或者达到数组尾部，添加进div
                        if (i % 2 !== 0 || i+1 ===other_person_arr.length) {
                            relation_type_div.appendChild(row_div);
                        }
                    }
                }
            }
        });
    }
});

function load_certain_assoc_parent_type_person(i, relation_parent_type_div, rel_stucture, person_rel_arr){
    var c_parent_assoc_type_desc_chn = rel_stucture[i]['c_parent_assoc_type_desc_chn'];
    var c_assoc_type_desc_chn = '';

    var flag_parent_has_person = 0;
    for(var j=i; j< rel_stucture.length; j++){
        if(rel_stucture[j]['c_parent_assoc_type_desc_chn'] != c_parent_assoc_type_desc_chn)break;
        if(rel_stucture[j]['c_assoc_type_desc_chn'] != c_assoc_type_desc_chn){
            c_assoc_type_desc_chn = rel_stucture[j]['c_assoc_type_desc_chn'];
            var c_assoc_type_id = rel_stucture[j]['c_assoc_type_id'];

            //整个子级关系div
            var relation_type_div = document.createElement("div");
            relation_type_div.setAttribute("name", "relation_type_div");

            //确认有人物
            var flag_has_person = load_certain_assoc_type_person(j, relation_type_div, rel_stucture, person_rel_arr);

            if(flag_has_person == 1){
                flag_parent_has_person = 1
            }

            if(flag_has_person){
                //添加子级关系复选框
                var div_checkbox, input, label, b, p_name;

                div_checkbox = document.createElement("div");
                div_checkbox.setAttribute("class", "col-lg-12");

                input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", "assoc_type_checkbox");
                input.setAttribute("id", 'at'+c_assoc_type_id);
                input.setAttribute("checked", true);

                label = document.createElement("label");
                label.setAttribute("htmlFor", 'at'+c_assoc_type_id);
                b = document.createElement("b");
                p_name = document.createTextNode(c_assoc_type_desc_chn);

                div_checkbox.appendChild(input);
                div_checkbox.appendChild(label).appendChild(b).appendChild(p_name);

                relation_parent_type_div.appendChild(div_checkbox);
                relation_parent_type_div.appendChild(relation_type_div);
            }
        }
    }
    return flag_parent_has_person;
}

function load_certain_assoc_type_person(j, relation_type_div, rel_stucture, person_rel_arr){
    var c_assoc_type_desc_chn = rel_stucture[j]['c_assoc_type_desc_chn'];
    // console.log(c_assoc_type_desc_chn);

    var certain_rel_type_person_arr = {};
    for(var k = j; k< rel_stucture.length; k++){
        if(rel_stucture[k]['c_assoc_type_desc_chn'] != c_assoc_type_desc_chn)break;
        var c_assoc_code = rel_stucture[k]['c_assoc_code'];

        for(var i=0; i<person_rel_arr.length; i++){
            if(c_assoc_code == person_rel_arr[i]['c_assoc_code']){
                var c_assoc_id = person_rel_arr[i]['c_assoc_id'];
                var c_assoc_name = person_rel_arr[i]['c_assoc_name'];
                certain_rel_type_person_arr[c_assoc_id] = c_assoc_name;
            }
        }
    }

    var i = 0;
    var flag_has_person = 0;


    for (var person_id in certain_rel_type_person_arr) {
        flag_has_person = 1;

        var person_name = certain_rel_type_person_arr[person_id];
        var row_div, div_person, div_checkbox, input, label, p_name;

        if (i % 2 == 0) {
            row_div = document.createElement("div");
            row_div.setAttribute("class", "row");
        }

        div_person = document.createElement("div");
        div_person.setAttribute("class", "col-lg-6");

        div_checkbox = document.createElement("div");
        // div_checkbox.setAttribute("class", "custom-control custom-checkbox");

        input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", "person_checkbox");
        // input.setAttribute("class", "custom-control-input");
        input.setAttribute("id", person_id);
        input.setAttribute("checked", true);

        label = document.createElement("label");
        // label.setAttribute("class", "custom-control-label");
        label.setAttribute("htmlFor", person_id);
        label.setAttribute('name', 'person_label');
        p_name = document.createTextNode(person_name);

        row_div.appendChild(div_person).appendChild(div_checkbox);
        div_checkbox.appendChild(input);
        div_checkbox.appendChild(label).appendChild(p_name);

        //达到一排或者达到数组尾部，添加进div
        if (i % 2 != 0 || i+1 ==Object.keys(certain_rel_type_person_arr).length) {
            relation_type_div.appendChild(row_div);
        }

        i = i+1;
    }
    return flag_has_person;
}

//人物关系部分全选功能实现（父级input标签ID是apt+父级id,子级input标签ID是at+子级id）
//注意这里不要直接使用父级input作为选择器对象，因为是未来元素（ajax默认异步执行）
//父级关系类别复选框点击事件
//全选所有人物
$("#person_filter").on('click',"input#check_all_rel_peron_below", function (){
    var all_rel_peron_is_checked = $(this).prop('checked');
    var all_back_input = $(this).parent().nextAll().find('input');
    all_back_input.prop({'checked':all_rel_peron_is_checked});
});
//父级类别复选框点击事件
$("#person_filter").on('click', "input[id^='apt']", function (){
    var parent_type_is_checked = $(this).prop('checked');
    var all_sub_input = $(this).parent().next().find('input');
    all_sub_input.prop({'checked':parent_type_is_checked});

    //全选按钮变化
    let parent_type_input_list = $("input[name='assoc_parent_type_checkbox']");
    var flag_no_children = 1;
    var flag_all_children = 1;
    for(var i = 0; i<parent_type_input_list.length; i++){
        if(parent_type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var all_rel_peron_check = $("input#check_all_rel_peron_below");
    if(flag_all_children){
        all_rel_peron_check.prop({'checked': true});
    }
    if(flag_no_children){
        all_rel_peron_check.prop({'checked': false});
    }
});
//关系类别复选框点击事件
$("#person_filter").on('click', "input[id^='at']", function (){
    //所有人物：有则全有，无则全无
    var type_is_checked = $(this).prop('checked');
    $(this).parent().next().find('input').prop({'checked': type_is_checked});

    //父级类别变化
    var type_input_list = $(this).parent().parent().find("input[name='assoc_type_checkbox']");
    var flag_no_children = 1;
    var flag_all_children = 1;
    for(var i = 0; i<type_input_list.length; i++){
        if(type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var parent_type_input = $(this).parent().parent().prev().children('input');
    if(flag_all_children){
        parent_type_input.prop({'checked': true});
    }
    if(flag_no_children){
        parent_type_input.prop({'checked': false});
    }

    //全选按钮变化
    let parent_type_input_list = $("input[name='assoc_parent_type_checkbox']");
    flag_no_children = 1;
    flag_all_children = 1;
    for(var i = 0; i<parent_type_input_list.length; i++){
        if(parent_type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var all_rel_peron_check = $("input#check_all_rel_peron_below");
    if(flag_all_children){
        all_rel_peron_check.prop({'checked': true});
    }
    if(flag_no_children){
        all_rel_peron_check.prop({'checked': false});
    }
});
//人物复选框点击事件
$("#person_filter").on('click', "input[name='person_checkbox']", function (){
    //类别复选框：全无则无，全有则有
    var person_input_list = $(this).parent().parent().parent().parent().find('input');
    var flag_no_children = 1;
    var flag_all_children = 1;
    for(var i = 0; i<person_input_list.length; i++){
        if(person_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var type_input = $(this).parent().parent().parent().parent().prev().children('input');
    if(flag_all_children){
        type_input.prop({'checked': true});
    }
    if(flag_no_children){
        type_input.prop({'checked': false});
    }

    //母级类别复选框检查：全无则无，全有则有
    var type_input_list = $(this).parent().parent().parent().parent().parent().find("input[name='assoc_type_checkbox']");
    flag_no_children = 1;
    flag_all_children = 1;
    for(var i = 0; i<type_input_list.length; i++){
        if(type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var parent_type_input = type_input.parent().parent().prev().children('input');
    if(flag_all_children){
        parent_type_input.prop({'checked': true});
    }
    if(flag_no_children){
        parent_type_input.prop({'checked': false});
    }

    //全选按钮变化
    let parent_type_input_list = $("input[name='assoc_parent_type_checkbox']");
    flag_no_children = 1;
    flag_all_children = 1;
    for(var i = 0; i<parent_type_input_list.length; i++){
        if(parent_type_input_list[i]['checked']){
            flag_no_children = 0;
        }
        else{
            flag_all_children = 0;
        }
    }

    var all_rel_peron_check = $("input#check_all_rel_peron_below");
    if(flag_all_children){
        all_rel_peron_check.prop({'checked': true});
    }
    if(flag_no_children){
        all_rel_peron_check.prop({'checked': false});
    }
});



//地点或人物标签点击代替复选框点击
$("#person_filter,#place_filter").on('click','label', function (){
    $(this).prev().click();
});

//双击地点或人物标签进行定位
$("#person_filter").on('dblclick',"label[name='person_label']", function (){
    let person_id = $(this).attr('htmlFor');
    person_marker_group.eachLayer(function (layer) {
        if (layer.id === person_id){
            layer.fire('click');
        }
    });
});
$("#place_filter").on('dblclick',"label", function (){
    let raw_place_id = $(this).attr('htmlFor');
    let place_id = raw_place_id.substring(raw_place_id.indexOf('hvd'));
    event_marker_group.eachLayer(function (layer) {
        if (layer.id === place_id){
            layer.fire('click');
        }
    });
});



//事件类别筛选功能准备，实现在map的load_markers_with_events函数中
const type_dict = {'type11': '求学', 'type12': '讲学', 'type13': '论学',
                 'type21': '任官', 'type22': '辞官', 'type23': '行政', 'type24': '议政', 'type25': '上奏',
                 'type31': '编纂', 'type32': '注释', 'type33': '作诗文',
                 'type41': '通信', 'type42': '寓居', 'type43': '会友',
                 'type5': '其他'};

//默认事件类别筛选框全选中，筛选功能在map.js中load_markers_with_events实现
$("input[name^='event_type_checkbox']").attr({'checked': true});

//事件类别部分全选功能实现
$("input[name='event_type_checkbox1']").on('click', function (){
    var type_id = $(this).attr('id');
    var is_checked = $(this).prop('checked');
    $("input[id^='"+type_id+"'][id!='"+type_id+"']").prop({'checked': is_checked});
});
