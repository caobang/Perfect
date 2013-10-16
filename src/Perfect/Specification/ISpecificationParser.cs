using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Perfect.Specification
{
    public interface ISpecificationParser<TCriteria>
    {
        TCriteria Parse<T>(ISpecification<T> specification);
    }
}
