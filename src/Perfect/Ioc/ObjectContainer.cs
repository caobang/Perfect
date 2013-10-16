using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Ioc
{
    public class ObjectContainer
    {
        private static IObjectContainer _container;

        /// <summary>Set the object container.
        /// </summary>
        /// <param name="container"></param>
        public static void SetContainer(IObjectContainer container)
        {
            _container = container;
        }

        /// <summary>
        /// Register a type mapping with the container.
        /// </summary>
        /// <typeparam name="TFrom"></typeparam>
        /// <typeparam name="TTo"></typeparam>
        /// <param name="life"></param>
        public static void RegisterType<TFrom, TTo>(LifeStyle life = LifeStyle.Transient)
           where TTo : TFrom
        {
            ThrowIfNotInitialized();
            _container.RegisterType<TFrom, TTo>(life);
        }

        /// <summary>
        /// Register an instance with the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="instance"></param>
        public static void RegisterInstance<T>(T instance) where T : class
        {
            ThrowIfNotInitialized();
            _container.RegisterInstance<T>(instance);
        }

        /// <summary>
        /// Resolve an instance of the default requested type from the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T Resolve<T>()
        {
            ThrowIfNotInitialized();
            return _container.Resolve<T>();
        }

        /// <summary>
        /// Resolve an instance of the default requested type from the container.
        /// </summary>
        /// <returns></returns>
        public static object Resolve(Type t)
        {
            ThrowIfNotInitialized();
            return _container.Resolve(t);
        }
        /// <summary>
        /// ThrowIfNotSetContainer
        /// </summary>
        private static void ThrowIfNotInitialized()
        {
            if (_container == null)
                throw new InvalidOperationException("Container should be set before using it.");
        }
    }
}