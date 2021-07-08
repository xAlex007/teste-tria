using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace teste_tria.Models
{
    public class Context:DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
            DBInit.Initialize(this);
        }

        public DbSet<Empresa> Empresas { get; set; }
    }
}
