import random
num=random.randint(1,10)
num1=int(input('请输入1-10的数字:'))
if num==num1:
    print('对了!')
elif num1>num:
    print('大了!')
    num1=int(input('请输入1-10的数字:'))
    if num1==num:
        print('对了!')
