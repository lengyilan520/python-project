#include <stdio.h>

int main(){
    printf("请输入身高(厘米):");
    int a;
    scanf("%d",&a);
    int b,c;
    b=a/30.48;
    c=(a-b*30.48)/2.54;

    printf("身高为%d英尺%d英寸\n",b,c);
    return 0;
}