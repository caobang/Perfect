using Perfect.Domain;
using System;

namespace Perfect.Repository
{
    public interface IRepositoryContext : IDisposable
    {
        IRepository<T> GetRepository<T>()
            where T : AggregateRoot;
        void BeginTransaction();
        void SaveChanges();
        void Rollback();
    }
}