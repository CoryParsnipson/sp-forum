from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated

from .models import Forum, Post, Thread, User
from .serializers import ForumSerializer, PostSerializer, ThreadSerializer, UserSerializer


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
    context['threads'] = Thread.objects.filter(forum=forum).order_by("-last_updated")
    return render(request, 'forum/forum.html', context)


###############################################################################
# thread detail                                                               #
###############################################################################
def thread_detail_by_id(request, id):
    """
    View the contents of a specific thread.
    """
    thread = get_object_or_404(Thread, pk=id)
    return _thread_detail(request, thread.forum, thread)
    

def thread_detail_by_slug(request, thread_slug):
    """
    View the contents of a specific thread. (accessed by slug value)
    """
    thread = get_object_or_404(Thread, slug=thread_slug)
    return _thread_detail(request, thread.forum, thread)


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
# thread create                                                               #
###############################################################################
def thread_new_form(request, forum_slug):
    """
    View to allow users to create a new thread.
    """
    context = {}
    context['forum'] = get_object_or_404(Forum, slug=forum_slug)
    return render(request, 'forum/thread_new_form.html', context)


def thread_create(request, forum_slug):
    """
    
    """
    raise NotImplementedError(
        "TODO: Implement 'thread-create' endpoint (%s)"
        % reverse('forum:thread-create', kwargs = { 'forum_slug': forum_slug })
    )


###############################################################################
# REST api views                                                              #
###############################################################################
class ForumViewSet(viewsets.ModelViewSet):
    """
    API endpoing for viewing and editing forums.
    """
    queryset = Forum.objects.all().order_by('id')
    serializer_class = ForumSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.

        Only Admin users can modify User objects, although anyone can
        list and view them.
        """
        if (self.action == 'create'
        or self.action == 'update'
        or self.action == 'partial_update'
        or self.action == 'destroy'):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]


# TODO: Probably want to have even more granular permissions between anonymous
# and logged in users. For example, anonymous users may be rate limited for
# creating posts, but logged in users are not.
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoing for viewing and editing forum posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if (self.action == 'update'
        or self.action == 'partial_update'
        or self.action == 'destroy'):
            # TODO: we actually want to enable Object level permissions here and
            # let anonymous (and authenticated) users edit or delete their own
            # posts but none of the other ones.
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        Upon creating a new post, do the default action, but we also
        need to update the `last_updated` field of the Thread object
        this belongs to.
        """
        response = super().create(request, *args, **kwargs)
        post = Post.objects.get(pk = response.data["id"])
        post.thread.last_updated = timezone.localtime()
        post.thread.save()
        return response


class ThreadViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows threads to be viewed or edited
    """
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

    def get_permissions(self):
        """
        Instantiates and returns a list of permissions that this view requires.
        """
        if (self.action == 'update'
        or self.action == 'partial_update'
        or self.action == 'destroy'):
            # TODO: we actually want to enable Object level permissions here and
            # let anonymous (and authenticated) users edit or delete their own
            # posts but none of the other ones.
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        Make it so that you can't create a thread without supply the contents
        of the first post as well.
        """
        response = super().create(request, *args, **kwargs)

        # get this thread object
        thread = Thread.objects.get(pk = response.data['id'])

        # make a new post
        post = Post(content=request.data['content'], thread=thread)
        post.save()

        return response


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.

        Only Admin users can modify User objects, although anyone can
        list and view them.
        """
        if (self.action == 'create'
        or self.action == 'update'
        or self.action == 'partial_update'
        or self.action == 'destroy'):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]
