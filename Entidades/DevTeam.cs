using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entidades
{
    public class DevTeam
    {
        [Key]
        public int IDTeam { get; set; }
        [RegularExpression(@".{3,}$", ErrorMessage = "El Nombre debe tener 3 letras minimo y no puede contener numeros o simbolos")]
        [Required(ErrorMessage = "El Nombre es requerido")]
        public string? Nombre { get; set; }
        public string? Banner { get; set; }
        [NotMapped]
        public IFormFile? BannerFile { get; set; } 
        public int FundadorID { get; set; }
        }
}