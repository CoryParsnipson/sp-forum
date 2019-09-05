from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Forum, Thread, Post

###############################################################################
# Forum admin view                                                            #
###############################################################################
class ForumAdmin(admin.ModelAdmin):
    # show the slug field in django-admin detail view even though it's not editable
    def get_readonly_fields(self, request, obj=None):
        return self.readonly_fields + ('slug',)

###############################################################################
# Thread admin view                                                            #
###############################################################################
class ThreadAdmin(admin.ModelAdmin):
    # show the slug field in django-admin detail view even though it's not editable
    def get_readonly_fields(self, request, obj=None):
        return self.readonly_fields + ('slug',)

admin.site.register(User, UserAdmin)
admin.site.register(Forum, ForumAdmin)
admin.site.register(Thread, ThreadAdmin)
admin.site.register(Post)
