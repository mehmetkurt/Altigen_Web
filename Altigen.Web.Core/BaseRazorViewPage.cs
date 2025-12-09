using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common.Views;

namespace Altigen.Web.Core;

public abstract class BaseRazorViewPage : UmbracoViewPage
{
}

public abstract class BaseRazorViewPage<TModel> : UmbracoViewPage<TModel>
{
}
