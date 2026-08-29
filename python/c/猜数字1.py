import random
num=random.randint(1,10)
for i in range(1,6):
    num1=int(input('请输入1-10的数字:'))
    if num1==num:
        print('对了!')
        break
    elif num1>num:
        print('大了!')
        
    elif num1<num:
        print('小了!')  
        