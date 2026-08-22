#include <stdio.h>
  
int main(){
    printf("请输入身高(厘米):");
    int height;
    scanf("%d",&height);
    int foot,inch;
    foot=height/30.48;
    inch=height/2.54-foot*12;
    printf("身高为%d英尺%d英寸\n",foot,inch);
    return 0;

}