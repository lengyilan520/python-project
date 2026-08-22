#include <stdio.h>

int main(){
    int n;

    
    
    for (n=2;n <=100; n++)
{
          
            
        

            int i;
            i=n-1;

        int count;
        int a=1;
        
        

            for (;i>1; i--)
            {
                count=n%i;
                if (count==0)
                {
                a=0;
                break;
                }
                
            
            

            }
            if (a!=0)
            {
                printf("%d ",n);
            }
           

         

    
}

return 0;


        

            
}