using Autofac;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Ioc.Impl.Autofac
{
    public class AutofacObjectContainer : IObjectContainer
    {
        private readonly IContainer _container;

        public AutofacObjectContainer()
        {
            _container = new ContainerBuilder().Build();
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
            var builder = new ContainerBuilder();
            var registrationBuilder = builder.RegisterType<TTo>().As<TFrom>();
            if (life == LifeStyle.Singleton)
            {
                registrationBuilder.SingleInstance();
            }
            builder.Update(_container);
        }
        /// <summary>
        /// Register an instance with the container.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="instance"></param>
        public void RegisterInstance<T>(T instance) where T : class
        {
            var builder = new ContainerBuilder();
            builder.RegisterInstance(instance).As<T>().SingleInstance();
            builder.Update(_container);
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