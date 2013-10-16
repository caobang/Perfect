using Perfect.Domain;
using Perfect.Event;
using Perfect.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelBook.Domain
{
    public class ModelBase : AggregateRoot
    {
        public virtual void Handle<T>(AddDomainObjectEvent evnt) where T : AggregateRoot
        {
            IRepository<T> repository = evnt.RepositoryContext.GetRepository<T>();
            T entity = this as T;
            repository.Add(entity);
        }

        public virtual void Handle<T>(UpdateDomainObjectEvent evnt) where T : AggregateRoot
        {
            IRepository<T> repository = evnt.RepositoryContext.GetRepository<T>();
            T entity = this as T;
            repository.Update(entity);
        }

        public virtual void Handle<T>(DeleteDomainObjectEvent evnt) where T : AggregateRoot
        {
            IRepository<T> repository = evnt.RepositoryContext.GetRepository<T>();
            T entity = this as T;
            repository.Delete(entity);
        }
    }
}
