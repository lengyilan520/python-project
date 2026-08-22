#include <stdio.h>


int main(){
    printf("请输入正整数:");
     int n;
     int result=1;

     scanf("%d",&n);
     while (n!=1)
     {
        result=result*n;
        n--;
        

     }
     


     printf("阶乘为%d",result);
     return 0;
     

     
}