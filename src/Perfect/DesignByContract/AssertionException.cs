using System;

namespace Perfect.DesignByContract
{
    public sealed class AssertionException : DesignByContractException
    {
        public AssertionException(string message)
            : base(message)
        {
        }

        public AssertionException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}