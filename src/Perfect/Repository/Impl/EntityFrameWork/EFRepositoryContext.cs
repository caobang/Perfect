using Perfect.DesignByContract;
using Perfect.Domain;
using System;
using System.Collections.Generic;
using System.Data.Entity;

namespace Perfect.Repository.Impl.EntityFrameWork
{
    public class EFRepositoryContext: IRepositoryContext
    {
        private readonly DbContext db;
        private Dictionary<Type, object> repositoryCache = new Dictionary<Type, object>();
        public EFRepositoryContext(DbContext db)
        {
            this.db = db;
        }
        public IRepository<T> GetRepository<T>() where T : AggregateRoot
        {
            if (repositoryCache.ContainsKey(typeof(T)))
            {
                return (IRepository<T>)repositoryCache[typeof(T)];
            }
            Check.RequireNotNull(this.db, "DbContext");
            IRepository<T> repository = new EFRepository<T>(this.db);
            this.repositoryCache.Add(typeof(T), repository);
            return repository;
        }
        public void BeginTransaction()
        {
        }
        public void SaveChanges()
        {
            Check.RequireNotNull(this.db, "DbContext");
            this.db.SaveChanges();
        }
        public void Rollback()
        {
        }
        public void Dispose()
        {
            this.repositoryCache.Clear();
            //this.db.Dispose();
        }
    }
}
