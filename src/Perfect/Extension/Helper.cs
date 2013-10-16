using Perfect.DesignByContract;
using Perfect.Domain;
using System;
using System.Linq.Expressions;
using System.Reflection;

namespace Perfect.Extension
{
    /// <summary>
    /// 常用的工具类
    /// </summary>
    public static class Helper
    {
        /// <summary>
        /// 工具方法 动态创建表达式
        /// </summary>
        public static Expression<Func<T, bool>> CreateExpression<T>(string FieldName, ExpressionType type, object Value) where T : AggregateRoot
        {
            ParameterExpression parExp = Expression.Parameter(typeof(T), "a");
            MemberExpression menberExp = Expression.Property(parExp, FieldName);
            ConstantExpression constant = Expression.Constant(Value);
            BinaryExpression eExp = Expression.MakeBinary(type, menberExp, constant);
            Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(eExp, parExp);
            return lambda;
        }
        /// <summary>
        /// 获取实体对象的属性值
        /// </summary>
        public static object GetProperty<T>(this T entity, string PropertyName) where T : AggregateRoot
        {
            PropertyInfo property = typeof(T).GetProperty(PropertyName);
            Check.Require(property != null, "实体对象不存在" + PropertyName + "属性");
            object value = property.GetValue(entity);
            return value;
        }
        /// <summary>
        /// 设置实体对象的属性值
        /// </summary>
        public static void SetProperty<T>(this T entity, string PropertyName,object Value) where T : AggregateRoot
        {
            PropertyInfo property = typeof(T).GetProperty(PropertyName);
            Check.Require(property != null, "实体对象不存在" + PropertyName + "属性");
            property.SetValue(entity, Value);
        }
    }
}
