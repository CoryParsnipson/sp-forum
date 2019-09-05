from django.urls import include, path

from rest_framework import routers

from . import views

api_router = routers.DefaultRouter()
api_router.register(r'users', views.UserViewSet)
api_router.register(r'forums', views.ForumViewSet)
api_router.register(r'posts', views.PostViewSet)

urlpatterns = [
    path('', views.index, name='index'),

    path('auth/', include('rest_framework.urls')),
    path('api/', include(api_router.urls)),

    path('forum/<int:id>/', views.forum_detail_by_id, name='forum-detail-by-id'),
    path('forum/<forum_slug>/', views.forum_detail_by_slug, name='forum-detail-by-slug'),

    path('forum/<forum_slug>/thread/<int:id>/', views.thread_detail_by_id, name='thread-detail-by-id'),
    path('forum/<forum_slug>/thread/<thread_slug>/', views.thread_detail_by_slug, name='thread-detail-by-slug'),
]
