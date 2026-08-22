#include <stdio.h>

int main(){
    int a,b;
    printf("请输入身高(英尺 英寸):");
    scanf("%d %d",&a,&b);
    float height=(a+b/12.0)*0.3048;
    printf("身高是%f米\n",height);
    return 0;

}
