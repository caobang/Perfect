using Perfect.Repository;

namespace Perfect.Event
{
    public class DomainEvent : IDomainEvent
    {
        public IRepositoryContext RepositoryContext { get; set; }
    }
}