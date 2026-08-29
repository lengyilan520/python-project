// #include <stdio.h>
// int main(){
//     printf("请输入正整数:");
//     int n;
//     scanf("%d",&n);
//     double b=0;
//     for (; n>=1; n--)
//     {
       
//        b+=1.0/n;

//     }
//     printf("和为%f",b);
//     return 0;
    

// }

#include <stdio.h>
int main(){
    printf("请输入正整数:");
    int n;
    scanf("%d",&n);
    double b=0;
    for(;n>=1;n--)
    {b+=1.0/n;

    }  
    printf("和为%f",b);
    return 0;

}