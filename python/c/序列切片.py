my_str='万过薪月,员序程马黑,nohtpy学'
# my_str=my_str[-9:-14:-1]
# print(my_str)


# result=my_str[::-1][8:13]
# print(result)

# result_str=my_str[::-1]
# num1=result_str.index('黑')
# num2=result_str.index('员')    #不用标点符号，容易弄混，一般默认第一个出现的
# result=result_str[num1:num2+1]  #不用{}
# print(result)


result=my_str.split(',')[1].replace('来',' ')[::-1]
print(result)




