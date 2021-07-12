using Microsoft.EntityFrameworkCore;
using teste_tria.Models;

namespace teste_tria.Models
{
    public class Context:DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
            
        }

        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<ClienteEmpresa> ClienteEmpresa { get; set; }
    }
}
