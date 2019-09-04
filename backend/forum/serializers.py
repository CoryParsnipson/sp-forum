from rest_framework import serializers

from .models import User, Forum, Thread, Post


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class ForumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Forum
        fields = ['url', 'title', 'description']


class PostSerializer(serializers.HyperlinkedModelSerializer):
    thread = serializers.SlugRelatedField(queryset=Thread.objects.all(), slug_field='id')

    class Meta:
        model = Post
        fields = ['url', 'author', 'content', 'published', 'thread']
