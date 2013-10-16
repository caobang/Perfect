﻿using System;

namespace Perfect.Log.Impl
{
    public class EmptyLoggerFactory : ILoggerFactory
    {
        private static readonly EmptyLogger _logger = new EmptyLogger();

        public ILogger Create(string name)
        {
            return _logger;
        }
        public ILogger Create(Type type)
        {
            return _logger;
        }
    }
}
