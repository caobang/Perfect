using Perfect.Repository;

namespace Perfect.Event
{
    public interface IDomainEvent
    {
        IRepositoryContext RepositoryContext { get; set; }
    }
}