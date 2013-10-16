using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Data;
using Perfect.Domain;
using System.Reflection;
using Perfect.Specification;
using Perfect.DesignByContract;

namespace Perfect.Repository.Impl.EntityFrameWork
{
    public class EFRepository<T> :IRepository<T> where T :AggregateRoot
    {
        private readonly DbContext db;
        public EFRepository(DbContext db)
        {
            this.db = db;
        }
        public void Add(T entity)
        {
            Check.RequireNotNull(entity, "entity");
            db.Entry<T>(entity).State = EntityState.Added;
        }
        public void Update(T entity)
        {
            Check.RequireNotNull(entity, "entity");
            db.Set<T>().Attach(entity);
            db.Entry<T>(entity).State = EntityState.Modified;
        }
        public void Delete(T entity)
        {
            Check.RequireNotNull(entity, "entity");
            db.Set<T>().Attach(entity);
            db.Entry<T>(entity).State = EntityState.Deleted;
        }
        //查询所有
        public IEnumerable<T> QueryAll()
        {
            return QueryAll(null);
        }
        public IEnumerable<T> QueryAll(string orderBy)
        {
            return Query(new AnySpecification<T>(), orderBy);
        }
        //查询所有

        //根据linq查询
        public IEnumerable<T> Query(Expression<Func<T, bool>> where) 
        {
            return Query(where, null);
        }
        public IEnumerable<T> Query(Expression<Func<T, bool>> where, string orderBy)
        {
            return DoQuery(where, orderBy);
        }
        //根据linq查询

        //根据规约查询
        public IEnumerable<T> Query(ISpecification<T> specification) 
        {
            return Query(specification, null);
        }
        public IEnumerable<T> Query(ISpecification<T> specification, string orderBy) 
        {
            return Query(specification.GetExpression(), orderBy);
        }
        //根据规约查询

        //根据linq查询单条记录
        public T QuerySingle(Expression<Func<T, bool>> where)
        {
            return QuerySingle(where, null);
        }
        public T QuerySingle(Expression<Func<T, bool>> where, string orderBy)
        {
            return Query(where, orderBy).AsQueryable().FirstOrDefault();
        }
        //根据linq查询单条记录

        //根据规约查询单条记录
        public T QuerySingle(ISpecification<T> specification) 
        {
            return QuerySingle(specification, null);
        }
        public T QuerySingle(ISpecification<T> specification, string orderBy) 
        {
            return QuerySingle(specification.GetExpression(), orderBy);
        }
        //根据规约查询单条记录

        //查询分页数据
        public IEnumerable<T> QueryPaging(string orderBy, int pageIndex, int pageSize) 
        {
            return QueryPaging(new AnySpecification<T>(), orderBy, pageIndex, pageSize);
        }
        public IEnumerable<T> QueryPaging(Expression<Func<T, bool>> where, string orderBy, int pageIndex, int pageSize) 
        {
            return DoQueryPaging(where, orderBy, pageIndex, pageSize);
        }
        public IEnumerable<T> QueryPaging(ISpecification<T> specification, string orderBy, int pageIndex, int pageSize) 
        {
            return QueryPaging(specification.GetExpression(), orderBy, pageIndex, pageSize);
        }

        protected IEnumerable<T> DoQuery(Expression<Func<T, bool>> where, string orderBy)
        {
            var query = db.Set<T>().Where(where);
            if (orderBy == null)
                return query;
            string[] order = orderBy.Trim().Split(' ');
            string sortName = "";
            string sortOrder = "";
            if (order.Length == 0 || order.Length > 2)
                throw new ArgumentException("查询字段", "查询字段格式错误");
            else
            {
                sortName = order[0];
                if (order.Length == 2)
                    sortOrder = order[1].ToLower();
            }
            if (sortOrder != "" && sortOrder != "asc" && sortOrder != "desc")
                throw new ArgumentException("查询字段", "排序方式只能为asc、desc或空字符串");
            Type type = typeof(T);
            PropertyInfo property = type.GetProperty(sortName);
            Check.Require(property != null, "属性名称不存在");
            ParameterExpression param = Expression.Parameter(type, "p");
            Expression propertyAccessExpression = Expression.MakeMemberAccess(param, property);
            LambdaExpression orderByExpression = Expression.Lambda(propertyAccessExpression, param);
            string methodName = sortOrder.ToLower() == "asc" ? "OrderBy" : "OrderByDescending";
            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), methodName, new Type[] { type, property.PropertyType }, query.Expression, Expression.Quote(orderByExpression));
            return query.Provider.CreateQuery<T>(resultExp);
        }

        protected IEnumerable<T> DoQueryPaging(Expression<Func<T, bool>> where, string orderBy, int pageIndex, int pageSize)
        {
            if (pageIndex < 0)
                throw new ArgumentOutOfRangeException("pageIndex", pageIndex, "页码必须大于或等于0。");
            if (pageSize < 0)
                throw new ArgumentOutOfRangeException("pageSize", pageSize, "每页大小必须大于或等于0。");
            var query = Query(where, orderBy).AsQueryable();
            return query.Skip(pageSize * pageIndex).Take(pageSize);
        }
    }
}