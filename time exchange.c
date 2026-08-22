#include <stdio.h>

int main(){
    printf("请输入时间(小时 分钟),从大到小:");
    int hour1,minute1;
    int hour2,minute2;
    scanf("%d %d",&hour1,&minute1);
    scanf("%d %d",&hour2,&minute2);
    int c;
    c=hour1*60+minute1-hour2*60-minute2;
    int a,b;
    a=c/60;
    b=c%60;
    printf("时间差是%d小时%d分钟",a,b);
    return 0;

}