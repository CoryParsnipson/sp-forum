"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework import routers

from django.contrib import admin
from django.urls import include, path

import forum.views

api_router = routers.DefaultRouter()
api_router.register(r'forums', forum.views.ForumViewSet)
api_router.register(r'posts', forum.views.PostViewSet)
api_router.register(r'threads', forum.views.ThreadViewSet)
api_router.register(r'users', forum.views.UserViewSet)

urlpatterns = [
    path('control-panel/', admin.site.urls),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/1/', include((api_router.urls, 'api'), namespace='api-v1')),

    path('', include('forum.urls')),
]
