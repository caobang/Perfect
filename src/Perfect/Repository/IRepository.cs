using Perfect.Domain;
using Perfect.Specification;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Perfect.Repository
{
    public interface IRepository<T> where T : AggregateRoot
    {
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);

        IEnumerable<T> QueryAll();
        IEnumerable<T> QueryAll(string orderBy);

        IEnumerable<T> Query(Expression<Func<T, bool>> where);
        IEnumerable<T> Query(Expression<Func<T, bool>> where, string orderBy);
        IEnumerable<T> Query(ISpecification<T> specification);
        IEnumerable<T> Query(ISpecification<T> specification, string orderBy);

        T QuerySingle(Expression<Func<T, bool>> where);
        T QuerySingle(Expression<Func<T, bool>> where, string orderBy);
        T QuerySingle(ISpecification<T> specification);
        T QuerySingle(ISpecification<T> specification, string orderBy);

        IEnumerable<T> QueryPaging(string orderBy, int pageIndex, int pageSize);
        IEnumerable<T> QueryPaging(Expression<Func<T, bool>> where, string orderBy, int pageIndex, int pageSize);
        IEnumerable<T> QueryPaging(ISpecification<T> specification, string orderBy, int pageIndex, int pageSize);
    }
}