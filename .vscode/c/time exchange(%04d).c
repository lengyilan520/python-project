#include <stdio.h>

int main(){
    printf("input time(eg.1006,hour:10,minute:06)and past time:");
    int time1,time2,time3;
    

    scanf("%d %d",&time1,&time2);
    time3=time1+time2;
    
    if (time3>2459)
    {time3=time3-2400;


       
    }
    printf("now is %04d\n",time3);
    return 0;

}