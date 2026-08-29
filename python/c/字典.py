my_dict={'Mary':{'部门':'科技部','工资':3000,'级别':1},'Bob':{'部门':'市场部','工资':5000,'级别':2},'Lisa':{'部门':'科技部','工资':4000,'级别':1}}

my_dict.keys()

for i in my_dict.keys():
    num=my_dict[i]['级别']
    salary=my_dict[i]['工资']
    if num==1:
        num+=1
        salary+=1000
    my_dict[i]['级别']=num   
    my_dict[i]['工资']=salary
print(my_dict)    