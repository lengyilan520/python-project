#include <stdio.h>
int main(){
    printf("请输入正整数:");
    int x;
    scanf("%d",&x);
    int a=0;
    int b;
    


     
    
    while (x>0)
    {
       b=x%10;
       x/=10;
       a=a*10+b;
   



    }
    printf("整数逆序为%d\n",a);
    return 0;


    
}