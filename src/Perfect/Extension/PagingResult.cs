using Perfect.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Perfect.Extension
{
    public class PagingResult<T> where T : AggregateRoot
    {
        private int totalCount = 0;
        private int pageIndex = 0;
        private int pageSize = 10;
        private IEnumerable<T> queryTotal;
        private IEnumerable<T> queryPage;

        public PagingResult(IEnumerable<T> queryTotal,int pageIndex,int pageSize,IEnumerable<T> queryPage)
        {
            this.queryTotal = queryTotal;
            this.pageIndex = pageIndex;
            this.pageSize = pageSize;
            this.queryPage = queryPage;

        }
        /// <summary>
        /// 总记录数量
        /// </summary>
        public int TotalCount 
        {
            get { return this.queryTotal.AsQueryable().Count(); }
        }
        /// <summary>
        /// 当前页数
        /// </summary>
        public int PageIndex
        {
            get { return this.pageIndex; }
        }
        /// <summary>
        /// 页码
        /// </summary>
        public int PageSize
        {
            get { return this.pageSize; }
        }
        /// <summary>
        /// 总页数
        /// </summary>
        public int TotalPages
        {
            get
            {
                return Convert.ToInt32(Math.Ceiling(Convert.ToDouble(this.totalCount) / this.PageSize));
            }
        }
        /// <summary>
        /// 当前页记录数
        /// </summary>
        public int PageCount
        {
            get { return this.queryPage.AsQueryable().Count(); }
        }
        /// <summary>
        /// 当前页数据集合
        /// </summary>
        public List<T> Data
        {
            get { return this.queryPage.ToList(); }
        }
    }
}
