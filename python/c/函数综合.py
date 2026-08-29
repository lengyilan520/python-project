money=5000000
name=input('请输入你的姓名:')
def check():
    print("----------------查询余额----------------")
    print(f"{name}您好，您的余额剩余：{money}元")

def deposit():
    global money

    print("----------------存款----------------")

    num = int(input("请输入存款金额:"))

    money += num

    print(f"{name}您好，您存款{num}元成功")
    print(f"当前余额:{money}元")

def withdraw():
    global money

    print("----------------取款----------------")

    num = int(input("请输入取款金额:"))

    if num <= money:
        money -= num

        print(f"{name}您好，取款{num}元成功")
        print(f"当前余额:{money}元")

    else:
        print("余额不足")        

def main():

    while True:

        print("----------------主菜单----------------")
        print(f"{name}您好,欢迎来到黑马银行ATM")
        print("查询余额 [输入1]")
        print("存款     [输入2]")
        print("取款     [输入3]")
        print("退出     [输入4]")


        choice = int(input("请输入您的选择:"))


        if choice == 1:
            check()

        elif choice == 2:
            deposit()

        elif choice == 3:
            withdraw()

        elif choice == 4:
            print("退出成功")
            break

        else:
            print("输入错误")


main()