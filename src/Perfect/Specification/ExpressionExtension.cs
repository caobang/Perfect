using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Specification
{
    public class ExpressionExtension<T>
    {
        public static Expression<Func<T, bool>> Eval(Expression<Func<T, bool>> predicate)
        {
            return predicate;
        }
    }
}
