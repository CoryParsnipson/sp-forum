from django.urls import include, path

from rest_framework import routers

from . import views

api_router = routers.DefaultRouter()
api_router.register(r'forums', views.ForumViewSet)
api_router.register(r'posts', views.PostViewSet)

app_name = 'forum'
urlpatterns = [
    path('', views.index, name='index'),

    path('api/', include(api_router.urls)),

    path('forum/view/<int:id>/', views.forum_detail_by_id, name='forum-detail-by-id'),
    path('forum/view/<forum_slug>/', views.forum_detail_by_slug, name='forum-detail-by-slug'),

    path('forum/view/<forum_slug>/thread/new', views.thread_new_form, name='thread-new-form'),
    path('forum/view/<forum_slug>/thread/create', views.thread_create, name='thread-create'),

    path('forum/view/<forum_slug>/thread/view/<int:id>/', views.thread_detail_by_id, name='thread-detail-by-id'),
    path('forum/view/<forum_slug>/thread/view/<thread_slug>/', views.thread_detail_by_slug, name='thread-detail-by-slug'),
]
