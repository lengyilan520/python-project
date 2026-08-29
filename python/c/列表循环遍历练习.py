def list_func():
    even_list=[]
    num_list=[1,2,3,4,5,6,7,8,9,10]
    for i in num_list:
        if i%2==0:
         even_list.append(i)
    print(even_list)
list_func()       