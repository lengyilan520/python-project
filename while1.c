#include <stdio.h>

int main(){
    printf("请输入非负整数:");

    int number;

    scanf("%d",&number);
    int n=0;


    
    
        do
        {
            n++;
            number/=10;

        } while (number>0);
        printf("%d",n);
        
        return 0;
        
    
    
}