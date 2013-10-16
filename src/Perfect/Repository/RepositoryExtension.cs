using Perfect.Domain;
using Perfect.Extension;
using Perfect.Specification;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Perfect.Repository
{
    public static class RepositoryExtension
    {
        public static void Add<T>(this IRepository<T> repository, List<T> entities) where T :AggregateRoot
        {
            foreach (var entity in entities)
            {
                repository.Add(entity);
            }
        }
        public static void Update<T>(this IRepository<T> repository, List<T> entities) where T : AggregateRoot
        {
            foreach (var entity in entities)
            {
                repository.Update(entity);
            }
        }
        public static void Delete<T>(this IRepository<T> repository, List<T> entities) where T : AggregateRoot
        {
            foreach (var entity in entities)
            {
                repository.Delete(entity);
            }
        }
        public static PagingResult<T> GetPagingResult<T>(this IRepository<T> repository, string orderBy, int pageIndex, int pageSize) where T : AggregateRoot
        {
            return repository.GetPagingResult(new AnySpecification<T>(), orderBy, pageIndex, pageSize);
        }
        public static PagingResult<T> GetPagingResult<T>(this IRepository<T> repository, Expression<Func<T, bool>> where, string orderBy, int pageIndex, int pageSize) where T : AggregateRoot
        {
            var queryTotal = repository.Query(where);
            var queryPage = repository.QueryPaging(where, orderBy, pageIndex, pageSize);
            return new PagingResult<T>(queryTotal, pageIndex, pageSize, queryPage);
        }
        public static PagingResult<T> GetPagingResult<T>(this IRepository<T> repository, ISpecification<T> specification, string orderBy, int pageIndex, int pageSize) where T : AggregateRoot
        {
            return repository.GetPagingResult(specification.GetExpression(), orderBy, pageIndex, pageSize);
        }
    }
}