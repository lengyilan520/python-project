#include <stdio.h>
int main(){
    printf("请输入非负整数:");

    int number;

    scanf("%d",&number);
    int n=1;
    number/=10;


    if (number>0)
    {
       while (number>0)
    {n++;
        number/=10;

        
    }
    printf("%d\n",n);
    }
    else {
        printf("1\n");

    }
    return 0;

    
}