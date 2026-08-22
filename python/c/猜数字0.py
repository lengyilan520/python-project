import random
num=random.randint(1,10)
num1=int(input('请输入1-10的数字:'))
if num==num1:
    print('对了!')
else:
    num2=int(input('第二次:'))
    if num2==num:
        print('对了!')  
    else:
        num3=int(input('第三次:'))
        if num3==num:
            print('对了!')
        else:
            print('机会用完!')         