
import openpyxl
import json
workbook = openpyxl.load_workbook('路线整理.xlsx')
sh = workbook["Sheet1"]
# rows:按行获取表单中所有的格子,每一行的格子放到一个元组中
res = list(sh.rows)
# print("res",res)
#  获取excel中第一行的数据
title = [i.value for i in res[0]]
print(title)
cases = []
# 遍历第一行以外所有的�?
for item in res[1:]:
    # 获取改行的数�?
    data = [i.value for i in item]
    # 第一行的数据和当前这行数据打包为字典
    dic = dict(zip(title, data))
    # 把字典添加到cases这个列表�?
    cases.append(dic)
 
# print(cases)

# 需要的数据结构
# 设置event_id
# id 的
place_dict = {'name': [1,0], 'age': [1,0]}
for i in range(len(cases)):
    place_dict = {'name': [1,0], 'age': [1,0]}
    for i in range(len(cases)):
        if   cases[i]["date"] not in place_dict.keys():
            place_dict[cases[i]["date"]] = 0
            if(cases[i]["date"]):
                print("\'"+ cases[i]["date"] + "\'" + ":" + str(i) +",")
#     cases[i]['event_id'] = i
#     cases[i]['year_bc'] = i
#     if  cases[i]["place"] not in place_dict.keys():
#         cases[i]["certain_place_name"] = cases[i]["place"]
#         cases[i]['place_id'] = "hvd_" + str(i)
#         cases[i]["certain_place_id"] = "hvd_" + str(i)
#         place_dict[cases[i]["place"]] = ["hvd_" + str(i)]
#         if cases[i]["lng"] == None:
#             cases[i]["xy_coordinates"] = None
#         else:
#             num = cases[i]["lng"].split(',')
#             cases[i]["xy_coordinates"] =  "("+str(num[0])+"E"+","+str(num[1])+"N)"
#         place_dict[cases[i]["place"]].append(cases[i]["xy_coordinates"])
#         print(place_dict)
#     else:
#         print("no")
#         cases[i]["certain_place_name"] = cases[i]["place"]
#         cases[i]['place_id'] = place_dict[cases[i]["place"]][0]
#         cases[i]["certain_place_id"] = place_dict[cases[i]["place"]][0]
#         cases[i]["xy_coordinates"] =  place_dict[cases[i]["place"]][1]
        


# with open('./abc.json', 'w', encoding = 'utf-8') as json_file:
#     json_file.write(json.dumps(cases,indent=4,ensure_ascii=False))