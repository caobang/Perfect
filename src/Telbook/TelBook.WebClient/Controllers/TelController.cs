using TelBook.Application;
using TelBook.Domain;
using System.Collections.Generic;
using System.Web.Mvc;
using Perfect.Extension.EasyUI;
using TelBook.DataObjects;
using Perfect.Extension;
using System.Linq.Expressions;
using System;

namespace TelBook.WebClient.Controllers
{
    public class TelController : ControllerBase<Tel>
    {
        //
        // GET: /Tel/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetData(string groupID,string name, int pageIndex, int pageSize, string orderby)
        {
            using (var applicationService = new ApplicationService())
            {
                Expression<Func<Tel, bool>> where = null;
                if (!string.IsNullOrEmpty(groupID))
                {
                    int gID = Convert.ToInt32(groupID);
                    where = a => a.Name.Contains(name) && a.GroupID ==gID;
                }
                else
                {
                    int userID = Convert.ToInt32(Session["UserID"]);
                    where = a => a.Name.Contains(name) && a.TelGroup.UserID == userID;
                }
                PagingResult<Tel> userList = applicationService.GetPaging<Tel>(where, orderby, pageIndex, pageSize);
                return Json(userList.ToViewData<Tel, TelData>());
            }
        }
        public ActionResult Add()
        {
            return View();
        }
        public ActionResult Update(int ID)
        {
            using (var applicationService = new ApplicationService())
            {
                Tel tel = applicationService.GetById<Tel>(ID);
                return View(tel.ToViewData());
            };
        }
    }
}
