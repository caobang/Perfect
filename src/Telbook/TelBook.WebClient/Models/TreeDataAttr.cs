using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TelBook.WebClient.Models
{
    public class TreeDataAttr
    {
        public string href { get; set; }
        public bool iniframe { get; set; }
        public bool closable { get; set; }
        public bool refreshable { get; set; }
        public bool selected { get; set; }
    }
}