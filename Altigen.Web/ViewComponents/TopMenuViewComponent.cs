using Microsoft.AspNetCore.Mvc;

namespace Altigen.Web.ViewComponents;

public class TopMenuViewComponent : ViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
