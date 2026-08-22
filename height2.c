#include <stdio.h>

int main(){
    printf("请输入身高(英尺 英寸):");
    double foot;
    double inch;
    scanf("%lf" "%lf",&foot,&inch);
    float height=(foot+inch/12)*0.3048;

    printf("身高是%f米\n",height);
    return 0;

}