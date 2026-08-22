#include <stdio.h>
void get(int time,int*hour,int*minute){
        *hour=time/100;
        *minute=time%100;
    }


int main(){
    printf("input time(eg1006 hour:10 minute:06)and past time:");

    int time1,time2;
    int hour1,hour2,minute1,minute2;


    scanf("%d %d",&time1,&time2);
    
    get(time1,&hour1,&minute1);
    get(time2,&hour2,&minute2);

    time1=hour1*60+minute1;
    time2=hour2*60+minute2;

    int time,hour,minute;
    time=time1+time2;
    hour=time/60;
    minute=time%60;
    if (hour>=24)
    {
       hour=hour%24;
    }
    
    printf("now is %02d%02d\n",hour,minute);






}