import random
num=random.randint(1,100)
num1=int(input('请输入1-100以内的数字:'))
n=1
while num1!=num:
    n+=1
    if num1>num:
        print('大了!')
        num1=int(input('请输入1-100以内的数字:'))
    else:
        print('小了!')    
        num1=int(input('请输入1-100以内的数字:'))
print(f'花{n}次猜对')        