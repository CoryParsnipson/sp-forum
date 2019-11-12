from django import template
from django.utils.safestring import mark_safe

register = template.Library()

def format_js_content(value, content_class, content_id = None):
    """
    Nest the provided content in a hidden div with special class
    """
    slate_content_id = '' if not content_id else "id='%s' " % (content_id)

    return mark_safe(
        "<span %sclass='%s'>%s</span>" % (slate_content_id, content_class, value)
    )

@register.filter
def format_rich(value, content_id = None):
    """
    Nest the provided content in a hidden div with special class
    """
    return format_js_content(value, 'format_rich', content_id)

@register.filter
def format_plain(value, content_id = None):
    """
    Nest the provided content in a hidden div with special class
    """
    return format_js_content(value, 'format_plain', content_id)
