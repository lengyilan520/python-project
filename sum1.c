#include <stdio.h>
int main(){
    printf("请输入正整数:");
    int n;
    scanf("%d",&n);
    double b=0;
    int i=1;
    int sign=1;

    for (;i<=n;i++)
    {
       
       b+=sign*1.0/i;
       sign*=-1;
       

    }
    printf("和为%f",b);
    return 0;
    

}