using TelBook.Application;
using TelBook.Domain;
using System.Collections.Generic;
using System.Web.Mvc;
using Perfect.Extension.EasyUI;
using TelBook.DataObjects;
using Perfect.Extension;

namespace TelBook.WebClient.Controllers
{
    public class UserController : ControllerBase<User>
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetData(string username,int pageIndex,int pageSize,string orderby)
        {
            using (var applicationService = new ApplicationService())
            {
                PagingResult<User> list = applicationService.GetPaging<User>(a => a.UserName.Contains(username), orderby, pageIndex, pageSize);
                return Json(list.ToViewData<User, UserData>());
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
                User user = applicationService.GetById<User>(ID);
                return View(user.ToViewData());
            };
        }
        public ActionResult GetRole()
        {
            using (var applicationService = new ApplicationService())
            {
                List<Role> list = applicationService.GetAll<Role>();
                return Json(list.ToViewData<Role, RoleData>());
            }
        }
        
    }
}
