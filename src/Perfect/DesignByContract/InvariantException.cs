using System;

namespace Perfect.DesignByContract
{
    public sealed class InvariantException : DesignByContractException
    {
        public InvariantException(string message)
            : base(message)
        {
        }

        public InvariantException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}