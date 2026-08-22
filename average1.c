#include <stdio.h>
int main(){
    printf("请输入一系列正整数,直到输入-1停止:");
    
    int number;

    int sum=0;
   double average;
    scanf("%d",&number);

    int n=0;
    while (number!=-1)
    {
      n++;
      sum+=number;
      scanf("%d",&number);
      

    }
    
    average=1.0*sum/n;
    printf("平均数为%f\n",average);
    return 0;
    
    


}