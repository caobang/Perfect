using TelBook.Application;
using TelBook.Domain;
using System.Collections.Generic;
using System.Web.Mvc;
using Perfect.Extension.EasyUI;
using TelBook.DataObjects;
using Perfect.Extension;
using System;

namespace TelBook.WebClient.Controllers
{
    public class TelGroupController : ControllerBase<TelGroup>
    {
        //
        // GET: /Group/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetData(string groupname, int pageIndex, int pageSize, string orderby)
        {
            using (var applicationService = new ApplicationService())
            {
                int userID = Convert.ToInt32(Session["UserID"]);
                PagingResult<TelGroup> list = applicationService.GetPaging<TelGroup>(a => a.Name.Contains(groupname) && a.UserID == userID, orderby, pageIndex, pageSize);
                return Json(list.ToViewData<TelGroup, TelGroupData>());
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
                TelGroup group = applicationService.GetById<TelGroup>(ID);
                return View(group.ToViewData());
            };
        }
        public ActionResult GetByUserID()
        {
            using (var applicationService = new ApplicationService())
            {
                int userID = Convert.ToInt32(Session["UserID"]);
                List<TelGroup> list = applicationService.GetMany<TelGroup>(a => a.UserID == userID);
                return Json(list.ToViewData());
            }
        }
    }
}
