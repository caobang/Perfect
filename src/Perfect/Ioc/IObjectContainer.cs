using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Ioc
{
    public interface IObjectContainer
    {
        /// <summary>
        /// Register a type mapping with the container.
        /// </summary>
        /// <typeparam name="TFrom"></typeparam>
        /// <typeparam name="TTo"></typeparam>
        /// <param name="life"></param>
        void RegisterType<TFrom, TTo>(LifeStyle life)
            where TTo : TFrom;
        /// <summary>
        /// Register an instance with the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="instance"></param>
        void RegisterInstance<T>(T instance) where T : class;

        /// <summary>
        /// Resolve an instance of the default requested type from the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        T Resolve<T>();

        /// <summary>
        /// Resolve an instance of the default requested type from the container.
        /// </summary>
        /// <returns></returns>
        object Resolve(Type t);

    }
}