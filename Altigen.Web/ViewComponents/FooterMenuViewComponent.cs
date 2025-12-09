using Microsoft.AspNetCore.Mvc;

namespace Altigen.Web.ViewComponents;

public class FooterMenuViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
