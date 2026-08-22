#include <stdio.h>

int main(){
    printf("input number:");
   double number;

    scanf("%lf",&number);
    if (number==0)
    {
        printf("0\n");

    }
    else if (number>0)
    {
        printf("%f\n",number*2);

    }
    else  
    {
        printf("-1\n");

    }
    return 0;

    

}