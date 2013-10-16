using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelBook.DataObjects
{
    public class TelData
    {
        public int ID { get; set; }
        public int GroupID { get; set; }
        public string GroupName { get; set; }
        public string Name { get; set; }
        public int Sex { get; set; }
        public string TelPhone { get; set; }
        public string Address { get; set; }
    }
}
