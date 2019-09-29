from django.shortcuts import render, get_object_or_404

from rest_framework import viewsets

from .models import User, Forum, Thread, Post
from .serializers import UserSerializer, ForumSerializer, PostSerializer


###############################################################################
# forum index                                                                 #
###############################################################################
def index(request):
    """
    This is the forums front page view. Show a list of all available forums.
    """
    context = {}
    context['forums'] = Forum.objects.order_by('id');
    return render(request, 'forum/index.html', context)


###############################################################################
# forum detail                                                                #
###############################################################################
def forum_detail_by_id(request, id):
    """
    View the contents of a specific forum.
    """
    forum = get_object_or_404(Forum, pk=id) 
    return _forum_detail(request, forum)


def forum_detail_by_slug(request, forum_slug):
    """
    View the contents of a specific forum (accessed by slug value)
    """
    forum = get_object_or_404(Forum, slug=forum_slug)
    return _forum_detail(request, forum)


def _forum_detail(request, forum):
    """
    View the contents of a specific forum (implementation)
    """
    context = {}
    context['forum'] = forum
    context['threads'] = Thread.objects.filter(forum=forum)
    return render(request, 'forum/forum.html', context)


###############################################################################
# thread detail                                                               #
###############################################################################
def thread_detail_by_id(request, id):
    """
    View the contents of a specific thread.
    """
    thread = get_object_or_404(Thread, pk=id)
    forum = get_object_or_404(thread.forum)
    return _thread_detail(request, forum, thread)
    

def thread_detail_by_slug(request, forum_slug, thread_slug):
    """
    View the contents of a specific thread. (accessed by slug value)
    """
    thread = get_object_or_404(Thread, slug=thread_slug)
    forum = get_object_or_404(Forum, slug=forum_slug)
    return _thread_detail(request, forum, thread)


def _thread_detail(request, forum, thread):
    """
    View the contents of a specific thread.
    """
    context = {}
    context['thread'] = thread
    context['forum'] = forum
    context['posts'] = Post.objects.filter(thread=thread)
    return render(request, 'forum/thread.html', context)


###############################################################################
# REST api views                                                              #
###############################################################################
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class ForumViewSet(viewsets.ModelViewSet):
    """
    API endpoing for viewing and editing forums.
    """
    queryset = Forum.objects.all().order_by('id')
    serializer_class = ForumSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoing for viewing and editing forum posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
