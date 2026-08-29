#include <stdio.h>
int main(){
    int a,b;
    int t;
    printf("请输入两个正整数:");
    scanf("%d %d",&a,&b);
while (b!=0)
{
  t=a%b;
  a=b;
  b=t;


}
printf("%d\n",a);
return 0;

}