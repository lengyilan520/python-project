#include <stdio.h>
int main(){
    printf("请输入正整数:");
    int n;
    scanf("%d",&n);
    int i=n;
    int factor=1;
    for ( ;n>1;n--)
    {factor*=n;

    }
    printf("%d\n",factor);
    return 0;

    
    
}