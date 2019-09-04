from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Forum, Thread, Post

admin.site.register(User, UserAdmin)
admin.site.register(Forum)
admin.site.register(Thread)
admin.site.register(Post)
