using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Ioc.Impl.Unity
{
    public class UnityObjectContainer : IObjectContainer
    {
        private readonly IUnityContainer _container;

        public UnityObjectContainer()
        {
            _container = new UnityContainer();
        }

        /// <summary>
        /// Register a type mapping with the container.
        /// </summary>
        /// <typeparam name="TFrom"></typeparam>
        /// <typeparam name="TTo"></typeparam>
        /// <param name="life"></param>
        public void RegisterType<TFrom, TTo>(LifeStyle life)
            where TTo : TFrom
        {
            if (life == LifeStyle.Singleton)
            {
                _container.RegisterType<TFrom, TTo>(new ContainerControlledLifetimeManager());
            }
            else
            {
                _container.RegisterType<TFrom, TTo>();
            }
        }

        /// <summary>
        /// Register an instance with the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="instance"></param>
        public void RegisterInstance<T>(T instance) where T : class
        {
            _container.RegisterInstance<T>(instance, new ContainerControlledLifetimeManager());
        }

        /// <summary>
        /// Resolve an instance of the default requested type from the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T Resolve<T>()
        {
            return _container.Resolve<T>();
        }

        /// <summary>
        /// Resolve an instance of the default requested type from the container.
        /// </summary>
        /// <returns></returns>
        public object Resolve(Type t)
        {
            return _container.Resolve(t);
        }

    }
}