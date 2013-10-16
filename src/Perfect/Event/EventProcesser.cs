using Perfect.DesignByContract;
using Perfect.Domain;
using Perfect.Repository;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace Perfect.Event
{
    public class EventProcesser
    {
        public static IRepositoryContext Context
        {
            get
            {
                return RepositoryContextFactory.GetCurrentRepositoryContext();
            }
        }
        /// <summary>
        /// 该方法接受一个实体对象和一个领域事件,若实体订阅该事件,该实体对象将自动执行该事件
        /// </summary>
        public static void ProcessEvent<T>(T entity,IDomainEvent evnt)where T:AggregateRoot
        {
            Check.RequireNotNull(Context, "RepositoryContext");
            Check.RequireNotNull(entity, "entity");
            Check.RequireNotNull(evnt, "evnt");

            evnt.RepositoryContext = Context;
            Type type = typeof(T);
            ///事件处理前进行预处理
            MethodInfo premethod = type.GetMethod("PreHandle", new Type[] { evnt.GetType()});
            if (premethod != null)
            {
                if (premethod.IsGenericMethodDefinition)
                    premethod = premethod.MakeGenericMethod(type);
                premethod.Invoke(entity, new object[] { evnt });
            }
            ///事件处理
            MethodInfo method = type.GetMethod("Handle", new Type[] { evnt.GetType() });
            if (method != null)
            {
                if (method.IsGenericMethodDefinition)
                    method = method.MakeGenericMethod(type);
                method.Invoke(entity, new object[] { evnt });
            }
            ///事件处理完成进行后期处理
            MethodInfo aftermethod = type.GetMethod("AfterHandle", new Type[] { evnt.GetType() });
            if (aftermethod != null)
            {
                if (aftermethod.IsGenericMethodDefinition)
                    aftermethod = aftermethod.MakeGenericMethod(type);
                aftermethod.Invoke(entity, new object[] { evnt });
            }
        }
        /// <summary>
        /// 该方法接受一个领域事件,若实体静态Handler中订阅该事件,将自动执行该静态方法
        /// </summary>
        public static void ProcessEvent<T>(IDomainEvent evnt) where T : AggregateRoot
        {
            Check.RequireNotNull(Context, "RepositoryContext");
            Check.RequireNotNull(evnt, "evnt");
            evnt.RepositoryContext = Context;
            Type type = typeof(T);
            MethodInfo method = type.GetMethod("Handle", new Type[] { evnt.GetType() });
            if (method == null)
                method = type.BaseType.GetMethod("Handle", new Type[] { evnt.GetType() });
            if (method == null)
                return;
            if (method.IsGenericMethodDefinition)
                method = method.MakeGenericMethod(type);
            method.Invoke(null, new object[] { evnt });
        }
        /// <summary>
        /// 该方法接受一个实体对象集合和一个领域事件,对集合内所有实体对象派发领域事件
        /// </summary>
        public static void ProcessEvent<T>(IEnumerable<T> entities, IDomainEvent evnt) where T : AggregateRoot
        {
            foreach (T entity in entities)
            {
                ProcessEvent<T>(entity, evnt);
            }
        }
        /// <summary>
        /// 提交所有事件
        /// </summary>
        public static void Submit()
        {
            Check.RequireNotNull(Context, "RepositoryContext");
            Context.SaveChanges();
        }

    }
}