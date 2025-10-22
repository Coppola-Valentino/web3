using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entidades
{
	public class Licencia
	{
		[Key]
		public int IDLic { get; set; }
		public int JuegoID { get; set; }
        public int UsuarioID { get; set; }
        public string? Estado { get; set; }

	}
}