from django.urls import include, path

from . import views

app_name = 'forum'
urlpatterns = [
    path('', views.index, name='index'),

    path('forum/<int:id>/', views.forum_detail_by_id, name='forum-detail-by-id'),
    path('forum/<forum_slug>/', views.forum_detail_by_slug, name='forum-detail-by-slug'),

    path('thread/<int:id>/', views.thread_detail_by_id, name='thread-detail-by-id'),
    path('thread/<thread_slug>/', views.thread_detail_by_slug, name='thread-detail-by-slug'),

    path('forum/<forum_slug>/new-thread', views.thread_new_form, name='thread-new-form'),
    path('forum/<forum_slug>/new-thread-create', views.thread_create, name='thread-create'),
]
