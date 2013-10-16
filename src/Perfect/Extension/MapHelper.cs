using AutoMapper;
using Perfect.DesignByContract;
using Perfect.Domain;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace Perfect.Extension
{
    /// <summary>
    /// 与AutoMapper相关的工具类
    /// </summary>
    public sealed class MapHelper
    {
        /// <summary>
        /// 将排序参数中dto类型排序字段转换为实体类型字段
        /// </summary>
        public static string GetMappedSortBy<T>(string orderBy)
            where T : AggregateRoot
        {
            Type dtoType = MapHelper.GetMappedType<T>();
            if (string.IsNullOrWhiteSpace(orderBy))
                return orderBy;
            string[] order = orderBy.Trim().Split(' ');
            string sortName = "";
            sortName = order[0];
            Check.Require(dtoType != null, "未找到对象对应dto类型");
            PropertyInfo property = dtoType.GetProperty(sortName);
            Check.Require(property != null, "属性名称不存在");
            object[] obj = property.GetCustomAttributes(typeof(OrderColumnAttribute), true);
            if (obj.Length == 0)
                return orderBy;
            string MappedName = (obj[0] as OrderColumnAttribute).ColumnName;
            return orderBy.Replace(sortName, MappedName);
        }

        ///存储实体类型与dto类型的集合
        private static Dictionary<Type, Type> typeDic = new Dictionary<Type, Type>();    
        public static Dictionary<Type, Type> TypeDic
        {
            get
            {
                if (typeDic.Count == 0)
                {
                    TypeMap[] types = AutoMapper.Mapper.GetAllTypeMaps();
                    foreach (TypeMap t in types)
                    {
                        typeDic.Add(t.SourceType, t.DestinationType);
                    }
                }
                return typeDic;
            }
        }

        /// <summary>
        /// 从AutoMapper注册类型中 获取实体类型对应的dto类型
        /// </summary>
        public static Type GetMappedType<T>()
        {
            Type dtoType = null;
            TypeDic.TryGetValue(typeof(T), out dtoType);
            return dtoType;
        }

    }
}
