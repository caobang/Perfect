using Perfect.Ioc;
using Perfect.Ioc.Impl.Autofac;
using Perfect.Log;
using Perfect.Log.Impl.Log4Net;
using Perfect.Repository;
using Perfect.Repository.Impl.EntityFrameWork;
using TelBook.Domain;
using System.Data.Entity;

namespace TelBook.WebClient
{
    public class IocConfig
    {
        public static void Register()
        {
            ObjectContainer.SetContainer(new AutofacObjectContainer());

            ObjectContainer.RegisterType<DbContext, TelBookEntities>();
            ObjectContainer.RegisterType<IRepositoryContext, EFRepositoryContext>();
            ObjectContainer.RegisterInstance<ILoggerFactory>(new Log4NetLoggerFactory("log4net.config"));

        }
    }
}