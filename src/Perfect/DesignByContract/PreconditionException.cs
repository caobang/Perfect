using System;

namespace Perfect.DesignByContract
{
    public sealed class PreconditionException : DesignByContractException
    {
        public PreconditionException(string message)
            : base(message)
        {
        }

        public PreconditionException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}