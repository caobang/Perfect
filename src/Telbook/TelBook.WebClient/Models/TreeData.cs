using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TelBook.WebClient.Models
{
    public class TreeData
    {
        public string id { get; set; }
        public string pid { get; set; }
        public string text { get; set; }
        public string iconCls { get; set; }
        public TreeDataAttr attributes { get; set; }
        public List<TreeData> children { get; set; }
    }
}