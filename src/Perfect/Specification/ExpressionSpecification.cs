using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Specification
{
    internal sealed class ExpressionSpecification<T> : Specification<T>
    {
        private Expression<Func<T, bool>> expression;
        public ExpressionSpecification(Expression<Func<T, bool>> expression)
        {
            this.expression = expression;
        }
        public override Expression<Func<T, bool>> GetExpression()
        {
            return this.expression;
        }
    }
}