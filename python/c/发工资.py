a=10000
for i in range(1,21):
    import random
    num=random.randint(1,10)
    if num<5:
        print(f'员工{i},绩效分{num},不发工资')
        print()
        continue
    else:
        print(f'员工{i}发1000元,余额{a-1000}')
        a=a-1000
        if a<=0:
            print(f'本月工资发放完毕')
            break
        else:
            print(f'剩余{a}元')
            print()

    