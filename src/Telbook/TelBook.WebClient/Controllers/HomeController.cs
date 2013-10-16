using TelBook.Application;
using TelBook.Domain;
using TelBook.WebClient.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TelBook.WebClient.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            object UserID = Session["UserID"];
            if (UserID == null || string.IsNullOrEmpty(UserID.ToString()))
            {
                return RedirectToAction("Index", "Login");
            }
            using (var applicationService = new ApplicationService())
            {
                User user = applicationService.GetById<User>(Convert.ToInt32(UserID));
                ViewData["Name"] = user.Name;
                return View();
            }
        }

        public ActionResult GetNavMenuData()
        {
            List<TreeData> list = new List<TreeData>();
            list.Add(new TreeData() { id = "1", text = "联系人组", iconCls = "icon-hamburg-docs" });
            list.Add(new TreeData() { id = "2", text = "系统管理", iconCls = "icon-hamburg-product-design" });
            return Json(list);
        }

        public ActionResult GetMenuData(int MenuID)
        {
            using (var applicationService = new ApplicationService())
            {
                User user = applicationService.GetById<User>(Convert.ToInt32(Session["UserID"]));
                List<TreeData> list = new List<TreeData>();

                if (MenuID == 1)
                {
                    List<TreeData> li = new List<TreeData>();
                    int UserID = Convert.ToInt32(Session["UserID"]);
                    List<TelGroup> groups = applicationService.GetMany<TelGroup>(a => a.User.ID == UserID);
                    foreach (TelGroup group in groups)
                    {
                        li.Add(new TreeData() { id = group.ID.ToString(), text = group.Name, attributes = new TreeDataAttr() { href = "/Tel?ID=" + group.ID, iniframe = true, closable = true, refreshable = true, selected = true } });
                    }
                    list.Add(new TreeData() { id = "1", text = "联系人组", children = li, attributes = new TreeDataAttr() { href = "/Tel", iniframe = true, closable = true, refreshable = true, selected = true } });
                }
                else
                {
                    List<TreeData> li = new List<TreeData>();
                    li.Add(new TreeData() { id = "2", text = "分组管理", attributes = new TreeDataAttr() { href = "/TelGroup", iniframe = true, closable = true, refreshable = true, selected = true } });
                    if (user.Role.Power == 1)
                    {
                        li.Add(new TreeData() { id = "3", text = "用户管理", attributes = new TreeDataAttr() { href = "/User", iniframe = true, closable = true, refreshable = true, selected = true } });
                    }
                    list.Add(new TreeData() { id = "1", text = "系统管理", children = li }); ;
                }
                return Json(list);
            }
        }
    }
}
