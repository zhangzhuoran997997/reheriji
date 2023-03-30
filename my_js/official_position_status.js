// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('official_position_status'));

// 指定图表的配置项和数据
var data1 = [
    {value:['1151/3/01', 0.75,'1151/3/01','1158/11/1','泉州同安县主簿','从九品']},
    {value:['1153/7/01', 0.5,'1153/7/01','1158/11/1','泉州同安县主县学','兼官无品阶']},
];
var data2 = [
    {value:['1151/3/01', 0.5,'1151/3/01','1173/5/28','左迪功郎','从九品']},
    {value:['1173/5/28',1.5,'1173/5/28','1186/6/11','宣教郎','从八品']},
    {value:['1186/6/11', 3,'1186/6/11','1189/9/4','朝奉郎','正七品']},
    {value:['1189/9/4', 3,'1189/9/4','1194/10/17','朝散郎','正七品']},
    {value:['1194/10/17', 3,'1194/10/17','1195/3/03','朝请郎','正七品']},
    {value:['1195/3/03', 3.5,'1195/3/03','1200/3/09','朝奉大夫','从六品']},
    {value:['1200/3/09', 3.5,'1195/3/03','1200/3/09','朝奉大夫','从六品']},
];
var data3 = [
    {value:['1181/7/17', 2,'1181/7/17','1182/9/4','直秘阁','正八品']},
    {value:['1182/9/4', 2.5,'1182/9/4','1188/7/26','直徽猷阁','从七品']},//需要折线吗？时间间断点！
    {value:['1188/7/26', 3,'1188/7/26','1189/1/23','直宝文阁','正七品']},
    {value:['1189/1/23', 3.5,'1189/1/23','1189/5/1','秘阁修撰','从六品']},
    {value:['1189/5/1', 3,'1189/5/1','1191/3/28','直宝文阁','正七品']},
    {value:['1191/3/28', 3.5,'1191/3/28','1194/8/5','秘阁修撰','从六品']},
    {value:['1194/8/5', 5.5,'1194/8/5','1194/10/25','焕章阁待制','从四品']},
    {value:['1194/10/25', 5.5,'1194/10/25','1194/12/1','宝文阁待制','从四品']},
    {value:['1194/12/1', 5.5,'1194/12/1','1195/12/26','焕章阁待制','从四品']},
    {value:['1195/12/26', 3.5,'1195/12/26','1196/12/26','秘阁修撰','从六品']},
    {value:['1196/12/26', 3.5,'1195/12/26','1196/12/26','秘阁修撰','从六品']},
];
var data4 = [
    {value:['1153/7/01', 6.8,'1158/11/1','泉州同安县主县学','兼官无品阶']},
];

option = {
    tooltip : {
        trigger: 'axis',  //以坐标轴触发
        formatter(params) {  //坐标点自定义文字标签
            const item = params[0];
            return `
                    开始时间：${item.data.value[2]} </br>
                    结束时间：${item.data.value[3]} </br>
                    官职：${item.data.value[4]} </br>
                    官阶：${item.data.value[5]} </br>
                `;
        },

    axisPointer: {
        type: 'cross',
    }
},

// title: {  //图表标题
//     left: 'center',
//     text: '朱熹任官状态图'
// },

legend: {  //选择显示项
    data: ['职事官','寄禄官','职名','无品阶职事官','爵'],
    top: '7%',
    left: 'center'
},

// toolbox: { //官职图保存为图片
//     feature: {
//         saveAsImage: {}
//     }
// },

grid: { //坐标系
    left: '2%',
    right: '2%',
    bottom: '2%',
    top: '15%',
    containLabel: true  //防止标签溢出
},

xAxis: [
    {
        type: 'time',
        boundaryGap : false,
        show:true
    }
],

yAxis : [
    {
        type : 'value',
        show : true,
        axisPointer:{ //不显示y轴坐标
            label:{
                show:false,
            },
        }
    }
],

series:[
    {
        name:'职事官',
        type:'line',
        step:'end',
        itemStyle: {
            normal: {
                color:'#EEB786',
                lineStyle: {
                width: 3,
                type: 'solid',
                color: "#A9E2F3" //折线的颜色
                }
            },
        emphasis: {
            color: '#31B404',
            lineStyle: {        // 系列级个性化折线样式
                width: 2,
                type: 'dotted',
                color: "#A9E2F3"
                }
            }
        },//线条样式
        symbolSize:8, //折线点的大小
        areaStyle: {normal: {}},
        data:data1
    },
    {
        name: '寄禄官',
        type:'line',
        step:'end',
        itemStyle: {
            normal: {
                color: '#B9F9A4',
                lineStyle: {        // 系列级个性化折线样式
                    width: 3,
                    type: 'solid',
                    color: "#4fd6d2"
                    }
                },
        emphasis: {
            color: '#F78181',
            lineStyle: {        // 系列级个性化折线样式
                width:2,
                type: 'dotted',
                color: "#4fd6d2" //折线的颜色
                }
            }
        },//线条样式
        symbolSize:8, //折线点的大小
        areaStyle: {normal: {}},
        data:data2
    },
    {
        name:'职名',
        type:'line',
        step:"end",
        itemStyle: {
            normal: {
                color: '#BACDF7',
                lineStyle: {        // 系列级个性化折线样式
                width: 3,
                type: 'solid',
                color: "#F2F5A9" //折线的颜色
                }
            },
        emphasis: {
            color: '#0080FF',
            lineStyle: {        // 系列级个性化折线样式
                width: 2,
                type: 'dotted',
                color: "#F2F5A9"
                }
            }
        },//线条样式
        symbolSize:8, //折线点的大小
        areaStyle: {normal: {}},
        data:data3
    },
    // {
    //     name:'无品阶职事官',
    //     type:'line',
    //     itemStyle: {
    //         normal: {
    //             //color:'#A9E2F3',
    //             lineStyle: {
    //             width: 3,
    //             type: 'solid',
    //             color: "#A9E2F3" //折线的颜色
    //             }
    //         },
    //     emphasis: {
    //         color: '#31B404',
    //         lineStyle: {        // 系列级个性化折线样式
    //             width: 2,
    //             type: 'dotted',
    //             color: "#A9E2F3"
    //             }
    //         }
    //     },//线条样式
    //     symbolSize:8, //折线点的大小
    //     areaStyle: {normal: {}},
    //     data:data4
    // },
]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);