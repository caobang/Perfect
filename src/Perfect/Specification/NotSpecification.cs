using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Specification
{
    public class NotSpecification<T> : Specification<T>
    {
        private ISpecification<T> spec;
       
        public NotSpecification(ISpecification<T> specification)
        {
            this.spec = specification;
        }
        
        public override Expression<Func<T, bool>> GetExpression()
        {
            var body = Expression.Not(this.spec.GetExpression().Body);
            return Expression.Lambda<Func<T, bool>>(body, this.spec.GetExpression().Parameters);
        }
    }
}
