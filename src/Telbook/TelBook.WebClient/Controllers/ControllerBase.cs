using Perfect.Domain;
using TelBook.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TelBook.WebClient.Controllers
{
    public class ControllerBase<T> : Controller where T : AggregateRoot
    {
        public ActionResult AddEntity(T user)
        {
            using (var applicationService = new ApplicationService())
            {
                applicationService.AddObject(user);
                return Content("添加成功!");
            }
        }

        public ActionResult UpdateEntity(T user)
        {
            using (var applicationService = new ApplicationService())
            {
                applicationService.UpdateObject(user);
                return Content("编辑成功!");
            }
        }

        public ActionResult DeleteEntities(string IDs)
        {
            using (var applicationService = new ApplicationService())
            {
                applicationService.DeleteObjects<T>(IDs);
                return Content("删除成功!");
            }
        }

    }
}
