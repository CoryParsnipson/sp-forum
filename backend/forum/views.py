from django.shortcuts import render

from rest_framework import viewsets

from .models import User, Post
from .serializers import UserSerializer, PostSerializer


def index(request):
    context = {}
    context['posts'] = Post.objects.order_by('-published')[:40];
    return render(request, 'forum/index.html', context)


###############################################################################
# REST api views                                                              #
###############################################################################
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoing for viewing and editing forum posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
