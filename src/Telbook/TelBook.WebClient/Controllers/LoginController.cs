using TelBook.Application;
using TelBook.Domain;
using TelBook.Domain.Event;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TelBook.WebClient.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login(string UserName, string Password)
        {
            using (var applicationService = new ApplicationService())
            {
                User user = applicationService.GetSingle<User>(a => a.UserName == UserName && a.Password == Password);
                if (user != null)
                {
                    Session.Add("UserID", user.ID);
                    applicationService.Publish(user, new LoginEvent());
                    return Content("OK");
                }
                return Content("用户名或密码错误!");
            }
        }
    }
}
