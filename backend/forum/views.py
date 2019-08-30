from django.shortcuts import render
from django.http import JsonResponse

from .models import Post

# Create your views here.
def index(request):
    context = {}
    context['posts'] = Post.objects.order_by('-published')[:40];
    return render(request, 'forum/index.html', context)

def post_detail(request):
    data = {
        'contents' : request.POST['post_contents']
    };
    return JsonResponse(data);
