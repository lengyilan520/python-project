#include <stdio.h>

int main(){
    printf("请输入正整数:");
    int n;
    scanf("%d",&n);

    int i;
    i=n-1;

   int count;
   int a=1;
   if (n==1)
   {
   printf("不是素数");
   return 0;
   
   }
   
   

    for (;i>1; i--)
    {
        count=n%i;
        if (count==0)
        {
           a=0;
           break;
        }
        
       
       

    }
    if (a==0)
    {
        printf("不是素数");
    }
    else
    printf("是素数");

    return 0;

    
}