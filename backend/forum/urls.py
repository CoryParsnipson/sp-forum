from django.urls import include, path

from rest_framework import routers

from . import views

api_router = routers.DefaultRouter()
api_router.register(r'users', views.UserViewSet)
api_router.register(r'posts', views.PostViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('post', views.post_detail, name='post'),

    path('auth/', include('rest_framework.urls')),
    path('api/', include(api_router.urls))
]
