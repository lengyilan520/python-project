#include <stdio.h>

int main(){
    printf("input three number(eg340,required:all of them are beyond 0):");

    int number;

    scanf("%d",&number);
    int a,b,c;
    a=number/100;
    b=(number-a*100)/10;
    c=(number-a*100)%10;

   if (b==0 && c==0)
   {
   printf("%d\n",a);

   }

   else if  (c==0)
   {
   printf("%d%d\n",b,a);

   }
   

   
   
   else {
    printf("%d%d%d\n",c,b,a);
   }
   return 0;




}