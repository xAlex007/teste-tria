using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace teste_tria.Models
{
    public class DBInit
    {

        public static void Initialize(Context context)
        {
            context.Database.EnsureCreated();

            if (context.Empresas.Any())
            {
                return;
            }           
        }
    }
}
