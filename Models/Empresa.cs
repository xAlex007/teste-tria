using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace teste_tria.Models
{
    public class Empresa
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [StringLength(14, MinimumLength = 14)]
        public string CNPJ { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 4)]
        public string RazaoSocial { get; set; }
    }
}
