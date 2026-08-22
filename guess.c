#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(){
    srand(time(0));
    int a=rand();
    a%=100;
    int number;
    int n=0;


    do
    {n++;
        printf("请在1到100猜一个数:");
        scanf("%d",&number);
        if (number>a)
        {
           printf("大了！");

        
        }
        else if (number<a)

        {printf("小了！");



        }
        else{
            printf("恭喜你,花%d次猜对!\n",n);

        }
        
        
    } while (number!=a);
    return 0;

    
}