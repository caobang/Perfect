using Perfect.Domain;
using Perfect.Event;
using Perfect.Extension;
using Perfect.Repository;
using Perfect.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace TelBook.Application
{
    public class ApplicationService : IDisposable
    {
        private readonly IRepositoryContext context;
        public ApplicationService()
        {
            context = RepositoryContextFactory.GetCurrentRepositoryContext();
        }
        /// <summary>
        /// 根据Id获取实体对象
        /// </summary>
        public T GetById<T>(int Id)
            where T : AggregateRoot
        {
            IRepository<T> repository = context.GetRepository<T>();
            var lambda = Helper.CreateExpression<T>("ID", ExpressionType.Equal, Id);
            T t = repository.QuerySingle(lambda);
            return t;
        }
        /// <summary>
        /// 根据Ids获取实体对象集合
        /// </summary>
        public List<T> GetByIds<T>(string Ids)
            where T : AggregateRoot
        {
            IRepository<T> repository = context.GetRepository<T>();
            var IDS = Ids.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            List<T> ts = new List<T>();
            foreach (var Id in IDS)
            {
                T t = this.GetById<T>(Convert.ToInt32(Id));
                ts.Add(t);
            }
            return ts;
        }
        /// <summary>
        /// 根据查询条件获取实体集合的第一条记录
        /// </summary>
        public T GetSingle<T>(Expression<Func<T, bool>> where, string orderBy = null)
            where T : AggregateRoot
        {
            string NewOrderBy = MapHelper.GetMappedSortBy<T>(orderBy);
            IRepository<T> repository = context.GetRepository<T>();
            T t = repository.QuerySingle(where, NewOrderBy);
            return t;
        }
        /// <summary>
        /// 获取所有实体
        /// </summary>
        public List<T> GetAll<T>(string orderBy = null)
            where T : AggregateRoot
        {
            string NewOrderBy = MapHelper.GetMappedSortBy<T>(orderBy);
            IRepository<T> repository = context.GetRepository<T>();
            List<T> ts = repository.QueryAll(NewOrderBy).ToList();
            return ts;
        }
        /// <summary>
        /// 根据查询条件获取实体集合
        /// </summary>
        public List<T> GetMany<T>(Expression<Func<T, bool>> where, string orderBy = null)
            where T : AggregateRoot
        {
            string NewOrderBy = MapHelper.GetMappedSortBy<T>(orderBy);
            IRepository<T> repository = context.GetRepository<T>();
            List<T> ts = repository.Query(where, NewOrderBy).ToList();
            return ts;
        }
        /// <summary>
        /// 获取分页对象
        /// </summary>
        public PagingResult<T> GetPaging<T>(string orderBy, int pageIndex, int pageSize)
            where T : AggregateRoot
        {
            return GetPaging<T>(new AnySpecification<T>().GetExpression(), orderBy, pageIndex, pageSize);
        }
        /// <summary>
        /// 根据查询条件获取分页对象
        /// </summary>
        public PagingResult<T> GetPaging<T>(Expression<Func<T, bool>> where, string orderBy, int pageIndex, int pageSize)
            where T : AggregateRoot
        {
            string NewOrderBy = MapHelper.GetMappedSortBy<T>(orderBy);
            IRepository<T> repository = context.GetRepository<T>();
            var pResult = repository.GetPagingResult(where, NewOrderBy, pageIndex, pageSize);
            return pResult;
        }

        ///以上为查询方法 直接由仓储进行处理
        ///以下为事件方法 统一由中央事件处理器EventProcesser负责处理

        /// <summary>
        /// 添加实体
        /// </summary>
        public void AddObject<T>(T entity) where T : AggregateRoot
        {
            this.Publish(entity, new AddDomainObjectEvent());
        }
        /// <summary>
        /// 编辑实体
        /// </summary>
        public void UpdateObject<T>(T entity) where T : AggregateRoot
        {
            this.Publish(entity, new UpdateDomainObjectEvent());
        }
        /// <summary>
        /// 删除实体
        /// </summary>
        public void DeleteObject<T>(T entity) where T : AggregateRoot
        {
            this.Publish(entity, new DeleteDomainObjectEvent());
        }
        /// <summary>
        /// 根据Id删除实体
        /// </summary>
        public void DeleteObject<T>(int Id) where T : AggregateRoot
        {
            this.Publish<T>(Id, new DeleteDomainObjectEvent());
        }
        /// <summary>
        /// 根据Ids删除实体
        /// </summary>
        public void DeleteObjects<T>(string Ids) where T : AggregateRoot
        {
            this.Publish<T>(Ids, new DeleteDomainObjectEvent());
        }
        /// <summary>
        /// 根据聚合根Id查询实体对象 并对该对象派发领域事件,由中央事件处理器负责处理
        /// </summary>
        public void Publish<T>(int Id, IDomainEvent evnt)
            where T : AggregateRoot
        {
            T t = GetById<T>(Id);
            EventProcesser.ProcessEvent(t, evnt);
            EventProcesser.Submit();
        }
        /// <summary>
        /// 根据Ids查询实体对象集合 并对该对象集合派发领域事件,由中央事件处理器负责处理
        /// </summary>
        public void Publish<T>(string Ids, IDomainEvent evnt)
            where T : AggregateRoot
        {
            List<T> ts = GetByIds<T>(Ids);
            EventProcesser.ProcessEvent(ts.AsEnumerable(), evnt);
            EventProcesser.Submit();
        }
        /// <summary>
        /// 根据查询条件获取实体对象集合 并对该对象集合派发领域事件,由中央事件处理器负责处理
        /// </summary>
        public void Publish<T>(Expression<Func<T, bool>> where, IDomainEvent evnt)
           where T : AggregateRoot
        {
            List<T> ts = GetMany<T>(where);
            EventProcesser.ProcessEvent(ts.AsEnumerable(), evnt);
            EventProcesser.Submit();
        }
        /// <summary>
        /// 对实体派发领域事件,由中央事件处理器负责处理
        /// </summary>
        public void Publish<T>(T entity, IDomainEvent evnt) where T : AggregateRoot
        {
            EventProcesser.ProcessEvent(entity, evnt);
            EventProcesser.Submit();
        }

        /// <summary>
        /// 向某个领域内派发领域事件,由中央事件处理器负责处理
        /// 该方法不指定实体对象，一般由领域内静态处理函数实现
        /// </summary>
        public void Publish<T>(IDomainEvent evnt) where T : AggregateRoot
        {
            EventProcesser.ProcessEvent<T>(evnt);
            EventProcesser.Submit();
        }

        public void Dispose()
        {
            context.Dispose();
        }
    }
}