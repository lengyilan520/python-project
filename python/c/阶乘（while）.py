num=int(input('请输入正整数:'))
result=1
while num!=1:
    result*=num
    num-=1
print(f'{result}')