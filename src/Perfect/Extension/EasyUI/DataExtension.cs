using Perfect.DesignByContract;
using Perfect.Domain;
using System;
using System.Collections.Generic;

namespace Perfect.Extension.EasyUI
{
    /// <summary>
    /// 实体类型与dto类型相互转换的静态类,包含类型转换的一些扩展方法
    /// </summary>
    public static class DataExtension
    {
        /// <summary>
        /// 扩展方法 将entity类型转换成dto类型 该方法指定entity类型和dto类型
        /// </summary>
        public static DTO ToViewData<T, DTO>(this T entity)
            where T : AggregateRoot
            where DTO : class
        {
            Check.RequireNotNull(entity, "entity");
            var data = AutoMapper.Mapper.Map<T, DTO>(entity);
            return data;
        }
        /// <summary>
        /// 扩展方法 将entity类型转换成dto类型 该方法不强制指定dto类型，根据entity类型自动查找AutoMapper注册时对应的dto类型
        /// </summary>
        public static object ToViewData<T>(this T entity)
            where T : AggregateRoot
        {
            Check.RequireNotNull(entity, "entity");
            Type dtoType = MapHelper.GetMappedType<T>();
            Check.Require(dtoType != null, "未找到对象对应dto类型");
            var data = AutoMapper.Mapper.Map(entity, typeof(T), dtoType);
            return data;
        }
        /// <summary>
        /// 扩展方法 将List集合内entity类型转换成dto类型 该方法指定entity类型和dto类型
        /// </summary>
        public static List<DTO> ToViewData<T, DTO>(this List<T> entities)
            where T : AggregateRoot
            where DTO : class
        {
            Check.RequireNotNull(entities, "entities");
            var datas = AutoMapper.Mapper.Map<List<T>, List<DTO>>(entities);
            return datas;
        }
        /// <summary>
        /// 扩展方法 将List集合内entity类型转换成dto类型 该方法不强制指定dto类型，根据entity类型自动查找AutoMapper注册时对应的dto类型
        /// </summary>
        public static dynamic ToViewData<T>(this List<T> entities)
            where T : AggregateRoot
        {
            Check.RequireNotNull(entities, "entities");
            Type dtoType = MapHelper.GetMappedType<T>();
            Check.Require(dtoType != null, "未找到对象对应dto类型");
            Type tList = typeof(List<>);
            Type dtoList = tList.MakeGenericType(dtoType);
            var datas = AutoMapper.Mapper.Map(entities, typeof(List<T>), dtoList);
            return datas;
        }
        /// <summary>
        /// 扩展方法 将PagingResult对象内entity类型转换成dto类型 该方法指定entity类型和dto类型
        /// PagingResult为分页对象
        /// </summary>
        public static GridData ToViewData<T, DTO>(this PagingResult<T> pResult)
            where T : AggregateRoot
            where DTO : class
        {
            Check.RequireNotNull(pResult, "pResult");
            var datas = AutoMapper.Mapper.Map<List<T>, List<DTO>>(pResult.Data);
            var pdata = new GridData { total = pResult.TotalCount, rows = datas };
            return pdata;
        }
        /// <summary>
        /// 扩展方法 将PagingResult对象内entity类型转换成dto类型 该方法不强制指定dto类型，根据entity类型自动查找AutoMapper注册时对应的dto类型
        /// PagingResult为分页对象
        /// </summary>
        public static GridData ToViewData<T>(this PagingResult<T> pResult)
            where T : AggregateRoot
        {
            Check.RequireNotNull(pResult, "pResult");
            Type dtoType = MapHelper.GetMappedType<T>();
            Check.Require(dtoType != null, "未找到对象对应dto类型");
            Type tList = typeof(List<>);
            Type dtoList = tList.MakeGenericType(dtoType);
            var datas = AutoMapper.Mapper.Map(pResult.Data, typeof(List<T>), dtoList);
            var pdata = new GridData { total = pResult.TotalCount, rows = datas };
            return pdata;
        }
    }
}
