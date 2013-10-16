using System;

namespace Perfect.DesignByContract
{
    public abstract class DesignByContractException : ApplicationException
    {
        protected DesignByContractException(string message)
            : base(message)
        {
        }

        protected DesignByContractException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}