using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace teste_tria.Models
{
    public class Cliente
    {
        [Key]
        public long Id { get; set; }

        [Required(ErrorMessage = "O CPF não pode estar em branco")]
        [DisplayName("CPF")]
        [StringLength(11, MinimumLength = 11)]
        public string CPF { get; set; }

        [Required(ErrorMessage = "O nome não pode estar em branco")]
        [DisplayName("Nome")]
        [StringLength(200, MinimumLength = 4)]
        public string Nome { get; set; }

        [DisplayName("E-mail")]
        [StringLength(150, MinimumLength = 4)]
        public string Email { get; set; }

        [Required(ErrorMessage = "A data de criação não pode estar em branco")]
        [DisplayName("Data de Criação")]
        public DateTime DtCriacao { get; set; }

        public ICollection<ClienteEmpresa> ClienteEmpresas { get; set; }
    }
}
