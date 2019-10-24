from rest_framework import serializers

from .models import Forum, Post, Thread, User


class ForumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Forum
        fields = ['url', 'id', 'title', 'slug', 'description']
        extra_kwargs = {
            'url': {'view_name': 'api:forum-detail'},
        }


class PostSerializer(serializers.HyperlinkedModelSerializer):
    thread = serializers.SlugRelatedField(queryset=Thread.objects.all(), slug_field='id')

    class Meta:
        model = Post
        fields = ['url', 'author', 'content', 'published', 'thread']
        extra_kwargs = {
            'url': {'view_name': 'api:post-detail'},
            'author': {'view_name': 'api:user-detail'},
        }


class ThreadSerializer(serializers.HyperlinkedModelSerializer):
    forum = serializers.SlugRelatedField(queryset=Forum.objects.all(), slug_field='id')

    class Meta:
        model = Thread
        fields = ['url', 'id', 'title', 'slug', 'author', 'forum']
        extra_kwargs = {
            'url': {'view_name': 'api:thread-detail'},
            'author': {'view_name': 'api:user-detail'},
        }


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']
        extra_kwargs = {
            'url': {'view_name': 'api:user-detail'},
        }
