#include <stdio.h>


int main() {
   printf("input time:");


    int time1,time2;
    scanf("%d %d",&time1,&time2);
    int hour1,minute1,hour2,minute2;

    hour1=time1/100;
    minute1=time1%100;

    hour2=time2/60;
    minute2=time2%60;

    int hour3,minute3;
    hour3=hour1+hour2;
    minute3=minute1+minute2;
    int hour4,minute4;
    hour4=minute3/60;
    minute4=minute3%60;
    

    int hour,minute;

    hour=hour3+hour4;
    minute=minute4;
    hour=hour%24;
    

    int number;
    number=hour*100+minute;
    printf("now%04d\n",number);



    return 0;


    


}