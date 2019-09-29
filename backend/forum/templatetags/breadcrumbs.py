from django import template
from django.urls import reverse
from django.utils.safestring import mark_safe

register = template.Library()

@register.simple_tag
def breadcrumb(link_text, url_name = None, *args, **kwargs):
    """
    Create a breadcrumb link. Use inside a breadcrumb block.
    """

    if not url_name:
        bc_str = "<li>%s</li>" % link_text
    else:
        bc_str = "<li><a href=\"%s\">%s</a></li>" % (reverse(url_name, kwargs=kwargs), link_text)

    return mark_safe(bc_str)
