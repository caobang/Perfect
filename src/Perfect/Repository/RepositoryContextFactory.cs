using Perfect.Ioc;
using System.Runtime.Remoting.Messaging;

namespace Perfect.Repository
{
    public class RepositoryContextFactory
    {
        public static IRepositoryContext GetCurrentRepositoryContext()
        {
            //当第二次执行的时候直接取出线程嘈里面的对象
            //CallContext:是线程内部唯一的独用的数据槽(一块内存空间)
            //数据存储在线程栈中
            //线程内共享一个单例
            IRepositoryContext repositoryContext = CallContext.GetData("RepositoryContext") as IRepositoryContext;
            //判断线程里面是否有数据
            if (repositoryContext == null)  //线程的数据槽里面没有仓储上下文
            {
                repositoryContext = ObjectContainer.Resolve<IRepositoryContext>();
                CallContext.SetData("RepositoryContext", repositoryContext);
            }
            return repositoryContext;
        }
    }
}