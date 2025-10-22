using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entidades
{
	public class Usuario
	{
		[Key]
		public int IDUser { get; set; }

  		[RegularExpression(@"^[A-Za-zÁÉÍÓÚáéíóúÑñ]{3,}$", ErrorMessage = "El Nombre debe tener 3 letras minimo y no puede contener numeros o simbolos")]
		[Required(ErrorMessage = "El Nombre es requerido")]
		public string? Nombre { get; set; }

		[RegularExpression(@".{8,20}", ErrorMessage = "La contraseña debe tener entre 8 y 20 caracteres.")]
		[Required(ErrorMessage = "la contraseña es requerida"), DataType(DataType.Password)]
		public string? Pass { get; set; }
		public string? Avatar { get; set; }
		[NotMapped]
		public IFormFile? AvatarFile { get; set; }
		public bool Admin { get; set; }
        public int IDTeam { get; set; }
	}
}