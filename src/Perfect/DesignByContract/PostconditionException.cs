using System;

namespace Perfect.DesignByContract
{
    public sealed class PostconditionException : DesignByContractException
    {
        public PostconditionException(string message)
            : base(message)
        {
        }

        public PostconditionException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}