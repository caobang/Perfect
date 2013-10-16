using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.IO;

namespace Perfect.DesignByContract
{
    public static class Check
    {
        #region 字段

        private static bool _UseAssertions;

        #endregion

        #region 属性

        public static bool UseAssertions
        {
            get
            {
                return _UseAssertions;
            }
            set
            {
                _UseAssertions = value;
            }
        }

        private static bool UseExceptions
        {
            get
            {
                return !_UseAssertions;
            }
        }

        #endregion

        #region 方法：断言

        public static void Assert(bool assertion, string message)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new AssertionException(message);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_AssertionMessage, message));
            }
        }

        public static void Assert(bool assertion, string message, Exception innerException)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new AssertionException(message, innerException);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_AssertionMessage, message));
            }
        }

        public static void Assert(bool assertion)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new AssertionException(Messages.Error_AssertionFailed);
                }
            }
            else
            {
                Trace.Assert(assertion, Messages.Error_AssertionFailed);
            }
        }

        #endregion

        #region 方法：前置条件

        public static void RequireDirectoryPathMustExists(string directoryPath)
        {
            Require(Directory.Exists(directoryPath), String.Format(Messages.Error_DirectoryPathMustBeExists, directoryPath));
        }

        public static void RequireNotNull(object target, string targetName)
        {
            Require(target != null, String.Format(Messages.Error_TargetCanNotNull, targetName));
        }

        public static void RequireNotNullOrWhiteSpace(string target, string targetName)
        {
            Require(!string.IsNullOrWhiteSpace(target), String.Format(Messages.Error_TargetCanNotNullOrWhiteSpace, targetName));
        }

        public static void RequireNotEmpty<T>(IEnumerable<T> target, string targetName)
        {
            Require(target != null && target.Any(), String.Format(Messages.Error_TargetCanNotEmpty, targetName));
        }

        public static void Require(bool assertion, string message)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new PreconditionException(message);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_PreconditionMessage, message));
            }
        }

        public static void Require(bool assertion, string message, Exception inner)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new PreconditionException(message, inner);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_PreconditionMessage, message));
            }
        }

        public static void Require(bool assertion)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new PreconditionException(Messages.Error_PreconditionFailed);
                }
            }
            else
            {
                Trace.Assert(assertion, Messages.Error_PreconditionFailed);
            }
        }

        #endregion

        #region 方法：后置条件

        public static void Ensure(bool assertion, string message)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new PostconditionException(message);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_PostconditionMessage, message));
            }
        }

        public static void Ensure(bool assertion, string message, Exception innerException)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new PostconditionException(message, innerException);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_PostconditionMessage, message));
            }
        }

        public static void Ensure(bool assertion)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new PostconditionException(Messages.Error_PostconditionFailed);
                }
            }
            else
            {
                Trace.Assert(assertion, Messages.Error_PostconditionFailed);
            }
        }

        #endregion

        #region 方法：不变量

        public static void Invariant(bool assertion, string message)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new InvariantException(message);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_InvariantMessage, message));
            }
        }

        public static void Invariant(bool assertion, string message, Exception innerException)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new InvariantException(message, innerException);
                }
            }
            else
            {
                Trace.Assert(assertion, String.Format(Messages.Error_InvariantMessage, message));
            }
        }

        public static void Invariant(bool assertion)
        {
            if (UseExceptions)
            {
                if (!assertion)
                {
                    throw new InvariantException(Messages.Error_InvariantFailed);
                }
            }
            else
            {
                Trace.Assert(assertion, Messages.Error_InvariantFailed);
            }
        }

        #endregion
    }
}