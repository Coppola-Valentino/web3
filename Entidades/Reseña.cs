using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entidades
{
	public class Reseña
	{
		[Key]
		public int IDReseña { get; set; }
		public int LicID { get; set; }
        public int JuegoID { get; set; }
        public string? Texto { get; set; }
        public int Numero { get; set; }

	}
}