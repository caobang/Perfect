using System;

namespace Perfect.Extension
{
    [AttributeUsage(AttributeTargets.Property, Inherited = true)]
    public class OrderColumnAttribute : Attribute
    {
        private string columnName;
        /// <summary>
        /// 中文列名
        /// </summary>
        public string ColumnName
        {
            get { return columnName; }
            set { columnName = value; }
        }
    }
}
