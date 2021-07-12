using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace teste_tria.Models
{
    public class ClienteEmpresa
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [DisplayName("ID Cliente")]
        public long ClienteID { get; set; }

        public Cliente Cliente { get; set; }

        [Required]
        [DisplayName("ID Empresa")]
        public long EmpresaID { get; set; }

        public Empresa Empresa { get; set; }
        
    }
}
