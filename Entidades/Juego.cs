using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entidades
{
	public class Juego
	{
		[Key]
		public int IDJuego { get; set; }
        [RegularExpression(@".{3,}$", ErrorMessage = "El Nombre debe tener 3 letras minimo y no puede contener numeros o simbolos")]
  		[Required(ErrorMessage = "El Nombre es requerido")]
		public string? Nombre { get; set; }
        public int Precio { get; set; }
        public string? Imagen { get; set; }
        [NotMapped]
        public IFormFile? ImagenFile { get; set; }
        public int DevID { get; set; }
	}
}