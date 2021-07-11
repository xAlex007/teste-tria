using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace teste_tria.Models
{
    public class Empresa
    {
        [Key]
        public long Id { get; set; }

        [Required(ErrorMessage = "O CNPJ não pode estar em branco")]
        [DisplayName("CNPJ")]
        [StringLength(14, MinimumLength = 14)]
        public string CNPJ { get; set; }

        [Required(ErrorMessage = "A razão social não pode estar em branco")]
        [DisplayName("Razão Social")]
        [StringLength(150, MinimumLength = 4)]
        public string RazaoSocial { get; set; }
    }
}
