//------------------------------------------------------------------------------
// <auto-generated>
//    此代码是根据模板生成的。
//
//    手动更改此文件可能会导致应用程序中发生异常行为。
//    如果重新生成代码，则将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace TelBook.Domain
{
    using Perfect.Event;
    using Perfect.Repository;
    using TelBook.Domain.Event;
    using System;
    using System.Collections.Generic;

    public partial class User : ModelBase
    {
        public void Handle(LoginEvent evnt)
        {
            IRepository<User> repository = evnt.RepositoryContext.GetRepository<User>();
            this.LastLoginDate = DateTime.Now;
        }

        public void AfterHandle(AddDomainObjectEvent evnt)
        {
            this.TelGroup.Add(new TelGroup() { Name = "默认分组" });
        }

        public void PreHandle(DeleteDomainObjectEvent evnt)
        {
            IRepository<TelGroup> repository = evnt.RepositoryContext.GetRepository<TelGroup>();
            var list = repository.Query(a => a.UserID == this.ID);
            EventProcesser.ProcessEvent(list, new DeleteDomainObjectEvent());
        }
    }
}